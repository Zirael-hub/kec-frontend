'use client'

import { useEffect, useMemo, useState } from 'react'
import GalleryHeader from '@/components/GalleryHeader'
import GalleryTabs from '@/components/GalleryTabs'
import MediaCard, { type MediaItem } from '@/components/MediaCard'
import Lightbox from '@/components/Lightbox'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'
const MONTHS_ID = [
  'Januari','Februari','Maret','April','Mei','Juni',
  'Juli','Agustus','September','Oktober','November','Desember'
]

function toDateSafe(v?: string | null): Date | null {
  if (!v) return null
  const d = new Date(v)
  return isNaN(d.getTime()) ? null : d
}

export default function Page() {
  const now = new Date()

  // data
  const [items, setItems] = useState<MediaItem[]>([])
  const [cats, setCats] = useState<string[]>([])

  // filters
  const [cat, setCat] = useState('')
  const [showAll, setShowAll] = useState(false)
  const [month, setMonth] = useState<number>(now.getMonth() + 1) // 1..12
  const [year, setYear] = useState<number>(now.getFullYear())

  // ui
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string|null>(null)

  // ---- API ----
  async function loadFromApi(params?: {cat?:string; month?:number; year?:number; showAll?:boolean}) {
    try {
      setLoading(true); setErr(null)
      const qs = new URLSearchParams()
      const c = params?.cat ?? cat
      const m = params?.month ?? month
      const y = params?.year  ?? year
      const all = params?.showAll ?? showAll

      if (c) qs.set('cat', c)
      if (!all) { qs.set('month', String(m)); qs.set('year', String(y)) }
      qs.set('limit', '200')

      const r = await fetch(`${API_BASE}/api/gallery?${qs.toString()}`, { cache:'no-store' })
      if (!r.ok) throw new Error('Gagal memuat galeri')
      const j = await r.json() as { items?: MediaItem[]; categories?: string[] }
      setItems(Array.isArray(j.items) ? j.items : [])
      setCats(Array.isArray(j.categories) ? j.categories : [])
    } catch (e:any) {
      setErr(e?.message || 'Gagal memuat galeri'); setItems([])
    } finally { setLoading(false) }
  }

  // initial
  useEffect(()=>{ loadFromApi() },[])
  // reload saat filter berubah
  useEffect(()=>{ loadFromApi() },[cat, month, year, showAll])

  // ---- client-side fallback (kalau BE belum saring penuh) ----
  const filteredByCat = useMemo(
    () => (cat ? items.filter(i => i.category === cat) : items),
    [items, cat]
  )
  const filtered = useMemo(()=>{
    if (showAll) return filteredByCat
    return filteredByCat.filter(i=>{
      const d = toDateSafe((i as any).date || (i as any).created_at || (i as any).published_at)
      if (!d) return false
      return (d.getMonth()+1)===month && d.getFullYear()===year
    })
  }, [filteredByCat, showAll, month, year])

  // years option (ambil dari data; fallback 5 tahun terakhir)
  const yearOptions = useMemo(()=>{
    const ys = new Set<number>()
    items.forEach(i=>{
      const d = toDateSafe((i as any).date || (i as any).created_at || (i as any).published_at)
      if (d) ys.add(d.getFullYear())
    })
    if (!ys.size) {
      for (let k = 0; k < 5; k++) ys.add(now.getFullYear()-k)
    }
    return Array.from(ys).sort((a,b)=>b-a) // desc
  }, [items])

  // lightbox
  function openById(id: string) {
    const idx = filtered.findIndex((i) => i.id === id)
    if (idx >= 0) setLightboxIdx(idx)
  }
  function close() { setLightboxIdx(null) }
  function prev()  { setLightboxIdx(i => i==null?null:(i-1+filtered.length)%filtered.length) }
  function next()  { setLightboxIdx(i => i==null?null:(i+1)%filtered.length) }

  return (
    <main className="mx-auto w-full max-w-[640px] space-y-4 px-4 pb-24 pt-4 text-slate-900 dark:text-slate-100">
      <GalleryHeader />

      {/* ===== Sticky Filter Header + Category Pills (Mobile-first, Estetik) ===== */}
  <div className="sticky top-0 z-40 -mx-4 mb-2 px-4 pb-2 backdrop-blur supports-[backdrop-filter]:bg-white/70 dark:supports-[backdrop-filter]:bg-slate-900/70">
    {/* Kartu filter */}
    <div className="rounded-2xl border bg-white/90 p-2 shadow-sm ring-1 ring-black/5 dark:bg-slate-900/80">
      {/* Bar atas: judul kecil + bulan sekarang */}
      <div className="mb-2 flex items-center justify-between">
        <div className="text-[12px] font-extrabold tracking-wide text-slate-700 dark:text-slate-200">
          Filter Galeri
        </div>
        {!showAll && (
          <div className="text-[11px] text-slate-500">

          </div>
        )}
      </div>

      {/* Kontrol: bulan, tahun, toggle “Semua” — rapi satu baris di mobile */}
      <div className="grid grid-cols-3 gap-2">
        {/* Bulan */}
        <label className="col-span-1">
          <span className="sr-only">Pilih Bulan</span>
          <div className="flex items-center gap-2 rounded-lg border bg-white px-2 h-9 shadow-sm dark:bg-slate-900">
            <span aria-hidden>🗓️</span>
            <select
              value={month}
              onChange={(e)=> setMonth(parseInt(e.target.value,10))}
              disabled={showAll}
              className="w-full bg-transparent text-xs focus:outline-none"
              aria-label="Pilih Bulan"
            >
              {MONTHS_ID.map((m,i)=>(
                <option key={i} value={i+1}>{m}</option>
              ))}
            </select>
          </div>
        </label>

        {/* Tahun */}
        <label className="col-span-1">
          <span className="sr-only">Pilih Tahun</span>
          <div className="flex items-center gap-2 rounded-lg border bg-white px-2 h-9 shadow-sm dark:bg-slate-900">
            <span aria-hidden>📅</span>
            <select
              value={year}
              onChange={(e)=> setYear(parseInt(e.target.value,10))}
              disabled={showAll}
              className="w-full bg-transparent text-xs focus:outline-none"
              aria-label="Pilih Tahun"
            >
              {yearOptions.map(y => <option key={y} value={y}>{y}</option>)}
            </select>
          </div>
        </label>

        {/* Toggle Semua */}
        <button
          onClick={()=> setShowAll(v=>!v)}
          className={
            'col-span-1 inline-flex h-9 items-center justify-center gap-2 rounded-lg border px-2 text-xs font-semibold shadow-sm ' +
            (showAll
              ? 'bg-emerald-600 text-white border-emerald-600'
              : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200')
          }
          aria-pressed={showAll}
        >
          <span aria-hidden>✨</span>
          {showAll ? 'Semua ✓' : 'Semua'}
        </button>
      </div>

      {/* Kategori: pill scrollable (horizontal) */}
      <div className="mt-2 overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div className="flex snap-x snap-mandatory gap-2">
          <button
            onClick={()=> setCat('')}
            className={
              'snap-start whitespace-nowrap rounded-full border px-3 py-1 text-[12px] ' +
              (cat===''
                ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200')
            }
          >
            Semua Kategori
          </button>
          {cats.map((c)=>(
            <button
              key={c}
              onClick={()=> setCat(c)}
              className={
                'snap-start whitespace-nowrap rounded-full border px-3 py-1 text-[12px] ' +
                (cat===c
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-white text-slate-700 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-200')
              }
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>



      {/* Loading / Error */}
      {loading && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {Array.from({length:6}).map((_,i)=>(
            <div key={i} className="h-28 animate-pulse rounded-xl bg-slate-200" />
          ))}
        </div>
      )}
      {err && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {/* GRID */}
      {!loading && !err && (
        <>
          {!showAll && (
            <div className="text-sm font-extrabold">
              {MONTHS_ID[month-1]} {year}
            </div>
          )}

          {filtered.length === 0 ? (
            <div className="rounded-2xl border bg-white p-4 text-center text-sm text-slate-600 shadow-sm dark:bg-slate-900">
              Belum ada media {showAll ? '' : `pada ${MONTHS_ID[month-1]} ${year}`}.
            </div>
          ) : (
            <section className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {filtered.map((m) => (
                <MediaCard key={m.id} item={m} onOpen={openById} />
              ))}
            </section>
          )}
        </>
      )}

      {/* Lightbox */}
      {lightboxIdx != null && (
        <Lightbox
          items={filtered}
          index={lightboxIdx}
          onClose={close}
          onPrev={prev}
          onNext={next}
        />
      )}
    </main>
  )
}
