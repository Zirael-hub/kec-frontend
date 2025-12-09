'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'

type Detail = {
  id: string
  title: string
  date: string            // ISO / YYYY-MM-DD (boleh ada jam)
  time?: string | null
  location?: string | null
  banner?: string | null
  description: string[]   // paragraf
  mapEmbedHtml?: string | null
}

function absolutize(src?: string | null) {
  if (!src) return undefined
  if (/^https?:\/\//i.test(src)) return src
  const base = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/+$/,'')
  return src.startsWith('/') ? `${base}${src}` : `${base}/${src}`
}

/** Ambil potongan YYYY-MM-DD dari string apa pun */
function ymdPart(s?: string){
  if (!s) return null
  const m = String(s).match(/(\d{4})-(\d{2})-(\d{2})/)
  return m ? { y:+m[1], m:+m[2], d:+m[3] } : null
}

const ID_MON_SHORT = ['Jan','Feb','Mar','Apr','Mei','Jun','Jul','Agu','Sep','Okt','Nov','Des']

/** Rapikan jam: "07.00.00" -> "07.00", "07:00:00" -> "07:00". Biarkan range "09:00 – Selesai" apa adanya. */
function prettyTime(t?: string | null): string | null {
  if (!t) return null
  const s = String(t).trim()
  if (s.includes('–')) return s // sudah format rentang; biarkan
  // pola jam tunggal dengan titik atau titik dua, opsional detik
  const mm = s.match(/^(\d{1,2})[.:](\d{2})(?:[.:](\d{2}))?$/)
  if (mm) {
    const hh = mm[1].padStart(2, '0')
    const mi = mm[2]
    const useDot = s.includes('.') // pertahankan gaya pemisah
    return useDot ? `${hh}.${mi}` : `${hh}:${mi}`
  }
  return s // fallback: tampilkan apa adanya
}

export default function Page(){
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const [d, setD] = useState<Detail | null>(null)
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string|null>(null)

  useEffect(()=> {
    (async ()=> {
      try{
        setLoading(true); setErr(null)
        const r = await fetch(`${API_BASE}/api/agenda/${encodeURIComponent(id)}`, { cache:'no-store' })
        if (!r.ok) throw new Error('Agenda tidak ditemukan')
        const j = await r.json() as Detail
        j.description = Array.isArray(j.description) ? j.description : []
        j.banner = absolutize(j.banner)
        setD(j)
      }catch(e:any){
        setErr(e?.message || 'Gagal memuat agenda')
      }finally{
        setLoading(false)
      }
    })()
  },[id])

  const ymd = ymdPart(d?.date)
  const dateLabel = ymd ? `${String(ymd.d).padStart(2,'0')} ${ID_MON_SHORT[ymd.m-1]} ${ymd.y}` : '—'
  const timeLabel = prettyTime(d?.time)

  return (
    <main className="mx-auto w-full max-w-[760px] px-4 pb-24 pt-6 text-slate-900 dark:text-slate-100">
      {/* Back */}
      <div className="mb-3">
        <button onClick={()=>router.back()}
                className="inline-flex items-center gap-2 rounded-xl border bg-white px-3 py-1.5 text-sm shadow-sm ring-1 ring-black/5 hover:bg-slate-50 dark:bg-slate-900">
          ← Kembali
        </button>
      </div>

      {loading && (
        <div className="animate-pulse space-y-3">
          <div className="h-44 w-full rounded-2xl bg-slate-200" />
          <div className="h-4 w-2/3 rounded bg-slate-200" />
          <div className="h-3 w-1/3 rounded bg-slate-200" />
          <div className="h-24 w-full rounded-2xl bg-slate-200" />
        </div>
      )}

      {err && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{err}</div>
      )}

      {!loading && d && (
        <>
          {/* Banner */}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {d.banner ? (
            <img src={d.banner} alt="" className="h-44 w-full rounded-2xl object-cover ring-1 ring-black/5 sm:h-60" />
          ) : (
            <div className="h-44 w-full rounded-2xl bg-slate-200 sm:h-60" />
          )}

          <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
            <div className="text-xs text-slate-500">
              {dateLabel}{timeLabel ? ` • ${timeLabel}` : ''}
            </div>
            <h1 className="mt-1 text-lg font-extrabold leading-snug sm:text-xl">{d.title}</h1>
            {d.location ? <div className="text-[12px] text-slate-500">📍 {d.location}</div> : null}
          </div>

          {/* Deskripsi */}
          {d.description.length ? (
            <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
              <div className="mb-2 text-sm font-semibold">Deskripsi</div>
              <div className="prose prose-sm max-w-none dark:prose-invert">
                {d.description.map((p, i)=>(
                  <p key={i} className="text-sm leading-relaxed">{p}</p>
                ))}
              </div>
            </section>
          ) : null}

          {/* Map */}
          {d.mapEmbedHtml ? (
            <section className="mt-4 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
              <div className="mb-2 text-sm font-semibold">Lokasi Peta</div>
              <div className="relative h-64 w-full overflow-hidden rounded-xl ring-1 ring-black/5">
                <div className="h-full w-full" dangerouslySetInnerHTML={{ __html: d.mapEmbedHtml }} />
              </div>
            </section>
          ) : null}

          {/* CTA lagi */}
          <div className="mt-6">
            <Link href="/agenda"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:bg-slate-900">
              Lihat Semua Agenda
            </Link>
          </div>
        </>
      )}
    </main>
  )
}
