'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

type DesaItem = { slug: string; name: string; cover?: string }
type DesaDetail = {
  slug: string
  cover?: string | null
  payload?: {
    profil?: { nama?: string; tagline?: string; kepala_desa?: string }
    quick?: { penduduk?: number; kk?: number; dusun?: number; rt?: number; rw?: number }
    galeri?: string[]
    potensi?: string[]
  }
}

const NAV_OFFSET_PX = 56

export default function DesaSelect({ items, apiBase }: { items:DesaItem[]; apiBase:string }) {
  const [val, setVal] = useState<string>('')
  const [open, setOpen] = useState(false)  // portal mount/unmount
  const [show, setShow] = useState(false)  // anim in/out
  const [loading, setLoading] = useState(false)
  const [detail, setDetail] = useState<DesaDetail | null>(null)
  const fmt = useMemo(()=> new Intl.NumberFormat('id-ID'), [])
  const sheetRef = useRef<HTMLDivElement>(null)

  // Lock body scroll saat open
  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = prev }
  }, [open])

  // Esc to close
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') beginClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  async function fetchDetail(slug: string) {
    setLoading(true); setDetail(null)
    try {
      let r = await fetch(`${apiBase.replace(/\/+$/,'')}/api/infografis/desa/${encodeURIComponent(slug)}`, { cache:'no-store' })
      if (!r.ok) {
        r = await fetch(`${apiBase.replace(/\/+$/,'')}/api/infografis?slug=${encodeURIComponent(slug)}`, { cache:'no-store' })
      }
      if (r.ok) {
        const json = await r.json()
        setDetail((json?.data ?? json?.item ?? json) as DesaDetail)
      }
    } finally {
      setLoading(false)
    }
  }

  function beginOpen() {
    if (!val) return
    setOpen(true)
    // biar transition jalan, set show di frame berikutnya
    requestAnimationFrame(() => setShow(true))
    fetchDetail(val)
  }

  function beginClose() {
    setShow(false)
  }

  // Hapus portal setelah animasi out selesai
  function onSheetTransitionEnd(e: React.TransitionEvent<HTMLDivElement>) {
    if (e.target !== e.currentTarget) return
    if (!show) setOpen(false)
  }

  return (
    <>
      {/* Card dropdown + tombol */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
        <div className="text-sm font-semibold">Profil Desa</div>
        <div className="mb-3 text-[11px] text-slate-500">Pilih desa untuk melihat detail</div>

        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <select
              value={val}
              onChange={(e)=> setVal(e.target.value)}
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-inner ring-1 ring-black/5 focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:bg-slate-900"
            >
              <option value="">Pilih Desa...</option>
              {items.map(d=>(
                <option key={d.slug} value={d.slug}>{d.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={beginOpen}
            disabled={!val}
            className={`rounded-xl px-3 py-2 text-sm font-semibold text-white transition
              ${val ? 'bg-emerald-500 hover:bg-emerald-600 active:scale-[0.99]' : 'bg-emerald-300 cursor-not-allowed'}`}
          >
            Buka Profil
          </button>
        </div>
      </div>

      {/* Portal modal */}
      {open && createPortal(
        <div className="fixed inset-0 z-[110]">
          {/* Backdrop (fade) */}
          <button
            aria-label="Tutup"
            onClick={beginClose}
            className={`absolute inset-0 transition-opacity duration-200 ease-out
              ${show ? 'bg-black/40 opacity-100 backdrop-blur-[1px]' : 'bg-black/40 opacity-0 backdrop-blur-[0px]'}`}
          />

          {/* Sheet (slide + fade) */}
          <div
            ref={sheetRef}
            onTransitionEnd={onSheetTransitionEnd}
            className={`
              absolute inset-x-0 bottom-0 md:inset-y-0 md:my-auto md:mx-auto md:max-w-2xl
              flex min-h-0 flex-col overflow-hidden rounded-t-2xl md:rounded-2xl
              bg-white shadow-xl ring-1 ring-black/5 dark:bg-slate-900
              transition-all duration-250 will-change-transform
              ${show
                ? 'translate-y-0 opacity-100'
                : 'translate-y-6 opacity-0 md:translate-y-0 md:scale-[0.98]'
              }
            `}
            style={{
              top: `${NAV_OFFSET_PX}px`,
              maxHeight: `calc(100dvh - ${NAV_OFFSET_PX}px)`,
              height:     `calc(100dvh - ${NAV_OFFSET_PX}px)`,
              left: 0, right: 0,
              transitionTimingFunction: show ? 'cubic-bezier(.22,1,.36,1)' : 'cubic-bezier(.4,0,.2,1)', // outBack / standard
            }}
            onWheel={(e)=>e.stopPropagation()}
            onClick={(e)=>e.stopPropagation()}
          >
            {/* Close */}
            <button
              aria-label="Tutup"
              onClick={beginClose}
              className="absolute right-3 top-3 z-20 inline-flex h-8 w-8 items-center justify-center rounded-full border bg-white/90 text-slate-600 shadow-sm ring-1 ring-black/5 hover:bg-slate-50 dark:bg-slate-800 dark:text-slate-200"
            >✕</button>

            {/* Header sticky */}
            <div className="sticky top-0 z-10 bg-white/90 px-4 pt-3 pb-2 backdrop-blur-md dark:bg-slate-900/80">
              <div className="mx-auto mb-2 h-1.5 w-10 rounded-full bg-slate-300 md:hidden" />
              <div className="flex items-center justify-between">
                <div className="text-sm font-extrabold">Profil Desa</div>
                <span className="text-[11px] text-slate-500"></span>
              </div>
            </div>

            {/* Body */}
            <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-[max(16px,env(safe-area-inset-bottom))] overscroll-contain">
              {loading ? (
                <div className="animate-pulse p-1">
                  <div className="h-32 w-full rounded-xl bg-slate-200" />
                  <div className="mt-3 h-4 w-40 rounded bg-slate-200" />
                </div>
              ) : detail ? (
                <div className="space-y-4 pb-6">
                  {detail.cover ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={detail.cover}
                      alt="cover"
                      className="h-36 w-full rounded-xl object-cover ring-1 ring-black/5 md:h-40"
                      loading="lazy"
                    />
                  ) : null}

                  <div>
                    <div className="text-lg font-extrabold leading-tight">
                      {detail.payload?.profil?.nama || detail.slug}
                    </div>
                    <div className="text-[12px] text-slate-500">
                      {detail.payload?.profil?.tagline || '-'}
                    </div>
                    <div className="mt-1 text-[12px] text-slate-500">
                      Kepala Desa: <b>{detail.payload?.profil?.kepala_desa || '-'}</b>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {(['penduduk','kk','dusun','rt','rw'] as const).map((k) => (
                      <div key={k} className="rounded-xl border p-2 text-center shadow-sm ring-1 ring-black/5">
                        <div className="text-base font-extrabold">
                          {fmt.format(detail.payload?.quick?.[k] || 0)}
                        </div>
                        <div className="text-[10px] uppercase text-slate-500">{k}</div>
                      </div>
                    ))}
                  </div>

                  {(detail.payload?.galeri || []).length ? (
                    <div>
                      <div className="mb-1 text-sm font-semibold">Galeri</div>
                      <div className="grid grid-cols-3 gap-2">
                        {detail.payload!.galeri!.map((g, i) => (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img key={i} src={g} alt={`galeri-${i}`} className="h-20 w-full rounded-lg object-cover ring-1 ring-black/5" />
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {(detail.payload?.potensi || []).length ? (
                    <div>
                      <div className="mb-1 text-sm font-semibold">Potensi</div>
                      <div className="flex flex-wrap gap-2">
                        {detail.payload!.potensi!.map((p, i) => (
                          <span key={i} className="rounded-xl border bg-white px-3 py-1 text-xs shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
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
        </div>,
        document.body
      )}
    </>
  )
}
