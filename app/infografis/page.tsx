'use client'

import { useEffect, useMemo, useState } from 'react'
import { createPortal } from 'react-dom'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'
const NAV_OFFSET_PX = 56 // tinggi navbar fixed-mu (ubah ke 64 kalau navbar kamu lebih tinggi)

// ====== Types ======
type InfografisData = {
  header: { logo?: string|null; nama?: string|null; tagline?: string|null }
  quick: { penduduk?: number; luas?: number; desa?: number; kk?: number }
  demografi: {
    male?: number; female?: number;
    ages?: { label: string; value: number }[];
    growth?: { year: number; value: number }[];
  }
  admin: { rt?: number; rw?: number; dusun?: number; batas?: { utara?:string; timur?:string; selatan?:string; barat?:string } }
  ekonomi: { items?: { icon?: string; title?: string }[]; photos?: string[] }
  budaya: { images?: string[] }
  layanan: {
    pendidikan?: { sekolah?: number }
    kesehatan?: { puskesmas?: number; klinik?: number; apotek?: number }
    keamanan?: { polsek?: number; koramil?: number }
    infrastruktur?: { internet?: number; jalan_baik?: number } // 0..1
  }
}

type DesaItem = { slug: string; name: string; cover?: string | null }
type DesaDetail = {
  slug: string
  title?: string|null
  cover?: string|null
  payload: {
    profil?: { nama?:string; kepala_desa?:string; alamat_kantor?:string; tagline?:string }
    quick?: { penduduk?:number; kk?:number; dusun?:number; rt?:number; rw?:number }
    galeri?: string[]
    potensi?: string[]
  }
}

// ====== Helpers ======
const fmt = new Intl.NumberFormat('id-ID')
const pct = (v?:number)=> (typeof v==='number' ? Math.round(Math.max(0,Math.min(1,v))*100) : 0)
function cls(...x:(string|false|undefined|null)[]){ return x.filter(Boolean).join(' ') }

// ====== Charts (SVG, no deps) ======
function PieGender({ male=0, female=0 }: { male?:number; female?:number }){
  const total = Math.max(1, (male||0)+(female||0))
  const pm = (male||0)/total
  const circumference = 2*Math.PI*44
  const offMale = (1-pm)*circumference
  return (
    <div className="flex items-center gap-4">
      <svg viewBox="0 0 100 100" className="h-20 w-20 -rotate-90">
        <circle cx="50" cy="50" r="44" fill="none" strokeWidth="12" className="stroke-gray-200" />
        <circle cx="50" cy="50" r="44" fill="none" strokeWidth="12"
                strokeDasharray={circumference} strokeDashoffset={offMale}
                className="stroke-emerald-500 transition-all duration-500" />
      </svg>
      <div className="text-sm">
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" /> Laki-laki:
          <b>{fmt.format(male||0)}</b> ({Math.round(pm*100)}%)
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-gray-300" /> Perempuan:
          <b>{fmt.format(female||0)}</b> ({100-Math.round(pm*100)}%)
        </div>
      </div>
    </div>
  )
}

function BarAge({ data=[] as {label:string; value:number}[] }){
  const max = Math.max(1, ...data.map(d=>d.value||0))
  return (
    <div className="space-y-2">
      {data.map((d,i)=>(
        <div key={i}>
          <div className="flex justify-between text-xs">
            <span>{d.label}</span>
            <span>{d.value}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded bg-slate-200">
            <div className="h-full bg-blue-500" style={{ width: `${(d.value||0)/max*100}%` }} />
          </div>
        </div>
      ))}
    </div>
  )
}

function LinePopulation({ points=[] as {year:number; value:number}[] }){
  const w=240, h=90, pad=8
  const xs = points.map(p=>p.year)
  const ys = points.map(p=>p.value)
  const minX = xs.length ? Math.min(...xs) : 0
  const maxX = xs.length ? Math.max(...xs) : 1
  const minY = ys.length ? Math.min(...ys) : 0
  const maxY = ys.length ? Math.max(...ys) : 1
  const nx = (x:number)=> pad + (w-2*pad) * ((x-minX)/(maxX-minX || 1))
  const ny = (y:number)=> (h-pad) - (h-2*pad) * ((y-minY)/(maxY-minY || 1))
  const line = points.map(p=>`${nx(p.year)},${ny(p.value)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="h-[90px] w-full">
      {points.length >= 2 ? (
        <>
          <polyline fill="none" stroke="currentColor" className="text-blue-600" strokeWidth="2" points={line} />
          <polygon
            points={`${line} ${w-pad},${h-pad} ${pad},${h-pad}`}
            className="fill-blue-50"
          />
        </>
      ) : (
        <text x="8" y="45" className="fill-slate-400 text-xs">Belum ada data pertumbuhan</text>
      )}
    </svg>
  )
}

// ====== UI bits ======
function Card({ title, subtitle, children, className }:{ title:string; subtitle?:string; children:React.ReactNode; className?:string }){
  return (
    <section className={cls("rounded-2xl border bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900", className)}>
      <div className="mb-3">
        <div className="text-sm font-extrabold">{title}</div>
        {subtitle ? <div className="text-[12px] text-slate-500">{subtitle}</div> : null}
      </div>
      {children}
    </section>
  )
}
function Stat({ label, value, small }:{ label:string; value:React.ReactNode; small?:string }){
  return (
    <div className="rounded-xl border p-3 text-center">
      <div className="text-xl font-extrabold">{value}</div>
      <div className="text-[12px] text-slate-500 uppercase tracking-wide">{label}</div>
      {small ? <div className="mt-1 text-[11px] text-slate-400">{small}</div> : null}
    </div>
  )
}
function Grid({ children }:{ children:React.ReactNode }){
  return <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">{children}</div>
}
function Img({src,alt,className}:{src?:string|null;alt?:string;className?:string}){
  if(!src) return null
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} alt={alt||''} className={className} />
}
function Prog({label, value}:{label:string; value:number}){
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-[12px]">
        <span>{label}</span><span>{value}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded bg-slate-200">
        <div className="h-full bg-emerald-500" style={{ width: `${value}%` }} />
      </div>
    </div>
  )
}

// ====== Page ======
export default function Page(){
  const [data, setData] = useState<InfografisData | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  // Desa list
  const [desaList, setDesaList] = useState<DesaItem[]>([])
  const [desaListLoading, setDesaListLoading] = useState(true)
  const [desaListErr, setDesaListErr] = useState<string|null>(null)

  // Desa modal
  const [desaOpen, setDesaOpen] = useState(false)
  const [desaSlug, setDesaSlug] = useState('')
  const [desa, setDesa] = useState<DesaDetail | null>(null)
  const [desaLoading, setDesaLoading] = useState(false)

  useEffect(()=>{
    (async ()=>{
      try{
        setLoading(true)
        const r = await fetch(`${API_BASE}/api/infografis`, { cache:'no-store' })
        if(!r.ok) throw new Error('Gagal memuat data infografis')
        const j = await r.json()
        setData(j)
      }catch(e:any){ setErr(e?.message || 'Gagal memuat data') }
      finally{ setLoading(false) }
    })()
  },[])

  useEffect(()=>{
    (async ()=>{
      try{
        setDesaListLoading(true)
        const r = await fetch(`${API_BASE}/api/infografis/desa-list?limit=200`, { cache:'no-store' })
        if(!r.ok) throw new Error('Gagal memuat daftar desa')
        const j = await r.json() as { items: DesaItem[] }
        setDesaList(Array.isArray(j.items) ? j.items : [])
      }catch(e:any){
        setDesaListErr(e?.message || 'Gagal memuat desa'); setDesaList([])
      }finally{
        setDesaListLoading(false)
      }
    })()
  },[])

  const openDesa = async (slug:string)=>{
    setDesaOpen(true); setDesa(null); setDesaLoading(true); setDesaSlug(slug)
    try{
      const r = await fetch(`${API_BASE}/api/infografis/desa/${encodeURIComponent(slug)}`, { cache:'no-store' })
      if(!r.ok) throw new Error('Data desa tidak ditemukan')
      setDesa(await r.json())
    }catch(e:any){
      setDesa({ slug, payload:{} as any, title:'', cover:null })
    }finally{
      setDesaLoading(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-[960px] px-4 pb-24 pt-6 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="mb-5 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm">📊</div>
        <div>
          <h1 className="text-lg font-extrabold leading-tight sm:text-xl">Infografis Wilayah</h1>
          <p className="text-[12px] text-slate-500">Statistik, demografi, layanan, dan potensi daerah</p>
        </div>
      </div>

      {/* Error / Loading */}
      {err && <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>}
      {loading && (
        <div className="mb-4 animate-pulse rounded-2xl border bg-white p-5 ring-1 ring-black/5 dark:bg-slate-900">
          <div className="h-4 w-32 rounded bg-slate-200" />
          <div className="mt-3 grid grid-cols-4 gap-3">
            {[...Array(4)].map((_,i)=><div key={i} className="h-20 rounded-xl bg-slate-200" />)}
          </div>
        </div>
      )}

      {!loading && data && (
        <div className="space-y-4">
          {/* Header */}
          <Card title="Profil Singkat" subtitle={data.header?.tagline || ''}>
            <div className="flex items-center gap-3">
              <Img src={data.header?.logo||''} alt="Logo" className="h-12 w-12 rounded-xl object-cover ring-1 ring-black/5" />
              <div>
                <div className="text-lg font-extrabold">{data.header?.nama || '-'}</div>
                <div className="text-[12px] text-slate-500">{data.header?.tagline || '—'}</div>
              </div>
            </div>
          </Card>

          {/* Quick stats */}
          <Card title="Statistik Cepat">
            <Grid>
              <Stat label="Penduduk" value={fmt.format(data.quick?.penduduk||0)} />
              <Stat label="Luas (km²)" value={(data.quick?.luas||0).toLocaleString('id-ID',{maximumFractionDigits:2})} />
              <Stat label="Desa" value={fmt.format(data.quick?.desa||0)} />
              <Stat label="KK" value={fmt.format(data.quick?.kk||0)} />
            </Grid>
          </Card>

          {/* Demografi */}
          <Card title="Demografi" subtitle="Komposisi penduduk & tren">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded-xl border p-3">
                <div className="mb-2 text-sm font-semibold">Gender</div>
                <PieGender male={data.demografi?.male||0} female={data.demografi?.female||0} />
              </div>
              <div className="rounded-xl border p-3">
                <div className="mb-2 text-sm font-semibold">Kelompok Usia</div>
                <BarAge data={data.demografi?.ages||[]} />
              </div>
              <div className="sm:col-span-2 rounded-xl border p-3">
                <div className="mb-2 text-sm font-semibold">Pertumbuhan Penduduk</div>
                <LinePopulation points={data.demografi?.growth||[]} />
              </div>
            </div>
          </Card>

          {/* Admin wilayah */}
          <Card title="Administratif & Batas">
            <Grid>
              <Stat label="RT" value={fmt.format(data.admin?.rt||0)} />
              <Stat label="RW" value={fmt.format(data.admin?.rw||0)} />
              <Stat label="Dusun" value={fmt.format(data.admin?.dusun||0)} />
              <div className="rounded-xl border p-3">
                <div className="text-[12px] font-semibold">Batas Wilayah</div>
                <ul className="mt-2 space-y-1 text-[12px] text-slate-600 dark:text-slate-300">
                  <li>Utara: <b>{data.admin?.batas?.utara || '-'}</b></li>
                  <li>Timur: <b>{data.admin?.batas?.timur || '-'}</b></li>
                  <li>Selatan: <b>{data.admin?.batas?.selatan || '-'}</b></li>
                  <li>Barat: <b>{data.admin?.batas?.barat || '-'}</b></li>
                </ul>
              </div>
            </Grid>
          </Card>

          {/* Ekonomi & Potensi */}
          <Card title="Ekonomi & Potensi">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border p-3">
                <div className="mb-2 text-sm font-semibold">Sektor Utama</div>
                <div className="flex flex-wrap gap-2">
                  {(data.ekonomi?.items||[]).map((it,i)=>(
                    <div key={i} className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-sm shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
                      <span className="text-lg">{it.icon || '•'}</span> {it.title || '-'}
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="mb-2 text-sm font-semibold">Galeri</div>
                <div className="grid grid-cols-3 gap-2">
                  {(data.ekonomi?.photos||[]).slice(0,6).map((src,i)=>(
                    <Img key={i} src={src} alt={`photo-${i}`} className="h-20 w-full rounded-lg object-cover ring-1 ring-black/5" />
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Budaya & Wisata */}
          <Card title="Budaya & Wisata">
            {!(data.budaya?.images||[]).length ? (
              <div className="text-sm text-slate-500">Belum ada data.</div>
            ) : (
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {(data.budaya?.images||[]).map((src,i)=>(
                  <Img key={i} src={src} alt={`budaya-${i}`} className="h-24 w-full rounded-lg object-cover ring-1 ring-black/5" />
                ))}
              </div>
            )}
          </Card>

          {/* Layanan Publik */}
          <Card title="Layanan Publik" subtitle="Fasilitas pendidikan, kesehatan, keamanan, dan infrastruktur">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-xl border p-3">
                <div className="mb-2 text-sm font-semibold">Pendidikan</div>
                <div className="text-2xl font-extrabold">{fmt.format(data.layanan?.pendidikan?.sekolah || 0)}</div>
                <div className="text-[12px] text-slate-500">Sekolah</div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="mb-2 text-sm font-semibold">Kesehatan</div>
                <div className="text-sm">
                  Puskesmas: <b>{fmt.format(data.layanan?.kesehatan?.puskesmas||0)}</b> •
                  Klinik: <b>{fmt.format(data.layanan?.kesehatan?.klinik||0)}</b> •
                  Apotek: <b>{fmt.format(data.layanan?.kesehatan?.apotek||0)}</b>
                </div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="mb-2 text-sm font-semibold">Keamanan</div>
                <div className="text-sm">
                  Polsek: <b>{fmt.format(data.layanan?.keamanan?.polsek||0)}</b> •
                  Koramil: <b>{fmt.format(data.layanan?.keamanan?.koramil||0)}</b>
                </div>
              </div>
              <div className="rounded-xl border p-3">
                <div className="mb-2 text-sm font-semibold">Infrastruktur</div>
                <div className="space-y-2">
                  <Prog label="Akses Internet" value={pct(data.layanan?.infrastruktur?.internet)} />
                  <Prog label="Jalan Kondisi Baik" value={pct(data.layanan?.infrastruktur?.jalan_baik)} />
                </div>
              </div>
            </div>
          </Card>

          {/* Profil Desa */}
          <Card title="Profil Desa" subtitle="Pilih desa untuk melihat detail">
            <div className="flex flex-col items-stretch gap-2 sm:flex-row">
              <div className="flex-1">
                <select
                  className="w-full rounded-xl border bg-white px-3 py-2 text-sm ring-1 ring-black/5 dark:bg-slate-900"
                  onChange={(e)=> setDesaSlug(e.target.value)}
                  value={desaSlug}
                >
                  <option value="">{desaListLoading ? 'Memuat desa…' : 'Pilih Desa…'}</option>
                  {desaList.map(d => (
                    <option key={d.slug} value={d.slug}>{d.name}</option>
                  ))}
                </select>
                {desaListErr ? <div className="mt-1 text-[11px] text-rose-600">{desaListErr}</div> : null}
              </div>

              <button
                className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-700 disabled:opacity-50"
                onClick={()=> desaSlug && openDesa(desaSlug)}
                disabled={!desaSlug || desaListLoading}
              >
                Buka Profil
              </button>
            </div>

            {/* Sheet / Modal mobile-first dengan offset navbar */}
            {desaOpen && createPortal(
        <div
          className="fixed inset-0 z-[110] pointer-events-none"
          aria-modal="true"
          role="dialog"
        >
          {/* Backdrop (klik untuk tutup) */}
          <button
            aria-label="Tutup"
            onClick={() => setDesaOpen(false)}
            className="absolute inset-0 bg-black/40 backdrop-blur-[1px] pointer-events-auto focus:outline-none"
          />

          {/* Sheet (offset dari navbar) */}
          <div
            className="
              absolute inset-x-0 bottom-0
              flex min-h-0 flex-col overflow-hidden pointer-events-auto
              rounded-t-2xl bg-white shadow-xl ring-1 ring-black/5 dark:bg-slate-900
              animate-[slideUp_.18s_ease-out]
              md:inset-y-0 md:my-auto md:mx-auto md:h-[80dvh] md:max-w-2xl md:rounded-2xl
            "
            style={{
              // tinggi penuh layar dikurangi navbar → anti kepotong address bar mobile
              top: `${NAV_OFFSET_PX}px`,
              maxHeight: `calc(100dvh - ${NAV_OFFSET_PX}px)`,
              height:     `calc(100dvh - ${NAV_OFFSET_PX}px)`,
              left: 0, right: 0,
            }}
            onWheel={(e)=>e.stopPropagation()}
            onClick={(e)=>e.stopPropagation()}
          >
            {/* Tombol close melayang */}
            <button
              aria-label="Tutup"
              onClick={() => setDesaOpen(false)}
              className="
                absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center
                rounded-full border bg-white/90 text-slate-600 shadow-sm ring-1 ring-black/5
                hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200
              "
            >
              ✕
            </button>

            {/* Header sticky */}
            <div className="sticky top-0 z-10 bg-white/90 px-4 pt-3 pb-2 backdrop-blur-md dark:bg-slate-900/80">
              <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-slate-300 md:hidden" />
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold">Profil Desa</div>
                <button
                  onClick={()=> setDesaOpen(false)}
                  className="rounded-lg border px-2 py-1 text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
                >

                </button>
              </div>
            </div>

            {/* Konten scrollable */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(16px,env(safe-area-inset-bottom))] overscroll-contain">
              {desaLoading ? (
                <div className="animate-pulse p-1">
                  <div className="h-32 w-full rounded-xl bg-slate-200" />
                  <div className="mt-3 h-4 w-40 rounded bg-slate-200" />
                </div>
              ) : desa ? (
                <div className="space-y-4 pb-6">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {desa.cover ? (
                    <img
                      src={desa.cover}
                      alt="cover"
                      className="h-36 w-full rounded-xl object-cover ring-1 ring-black/5 md:h-40"
                    />
                  ) : null}

                  <div>
                    <div className="text-lg font-extrabold leading-tight">
                      {desa.payload?.profil?.nama || desa.slug}
                    </div>
                    <div className="text-[12px] text-slate-500">
                      {desa.payload?.profil?.tagline || '-'}
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500">
                      Kepala Desa: <b>{desa.payload?.profil?.kepala_desa || '-'}</b>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(['penduduk','kk','dusun','rt','rw'] as const).map((k) => (
                      <div key={k} className="rounded-xl border p-2 text-center shadow-sm ring-1 ring-black/5">
                        <div className="text-base font-extrabold">
                          {fmt.format(desa.payload?.quick?.[k] || 0)}
                        </div>
                        <div className="text-[10px] uppercase text-slate-500">{k}</div>
                      </div>
                    ))}
                  </div>

                  {(desa.payload?.galeri || []).length ? (
                    <div>
                      <div className="mb-1 text-sm font-semibold">Galeri</div>
                      <div className="grid grid-cols-3 gap-2">
                        {desa.payload!.galeri!.map((g, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            key={i}
                            src={g}
                            alt={`galeri-${i}`}
                            className="h-20 w-full rounded-lg object-cover ring-1 ring-black/5"
                          />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {(desa.payload?.potensi || []).length ? (
                    <div>
                      <div className="mb-1 text-sm font-semibold">Potensi</div>
                      <div className="flex flex-wrap gap-2">
                        {desa.payload!.potensi!.map((p, i) => (
                          <span
                            key={i}
                            className="rounded-xl border bg-white px-3 py-1 text-xs shadow-sm ring-1 ring-black/5 dark:bg-slate-900"
                          >
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="p-4 text-sm text-slate-500">Data desa tidak ditemukan.</div>
              )}
            </div>
          </div>

          {/* Animasi */}
          <style jsx>{`
            @keyframes slideUp {
              from { transform: translateY(8%); opacity: 0 }
              to   { transform: translateY(0);   opacity: 1 }
            }
          `}</style>
        </div>,
        document.body
      )}

          </Card>
        </div>
      )}
    </main>
  )
}
