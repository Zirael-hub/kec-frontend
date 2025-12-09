import Link from 'next/link'
import StatusBadge, { type ComplaintStatus } from '@/components/StatusBadge'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'

type TimelineItem = { time:string; title:string; note?:string }
type Detail = {
  id: string
  name: string
  contact?: string
  category?: string
  message: string
  date: string
  status: ComplaintStatus
  imageUrl?: string | null
  timeline: TimelineItem[]
  response?: string
}

async function fetchDetail(ticket: string, pin: string): Promise<Detail | null> {
  if (!pin) return null
  const url = new URL(`${API_BASE}/api/pengaduan/${encodeURIComponent(ticket)}`)
  url.searchParams.set('pin', pin)
  const r = await fetch(url.toString(), { cache: 'no-store' })
  if (!r.ok) return null
  const j = await r.json()
  return {
    id: String(j.ticket ?? j.id ?? ticket),
    name: j.name ?? '-',
    contact: j.contact ?? '',
    category: j.category ?? 'Pengaduan',
    message: j.message ?? '',
    date: j.submitted_at ?? j.created_at ?? new Date().toISOString(),
    status: (j.status ?? 'Baru') as ComplaintStatus,
    imageUrl: j.image_url ?? null,
    timeline: Array.isArray(j.timelines) ? j.timelines : [],
    response: j.admin_response ?? '',
  }
}

export default async function Page({ params, searchParams }:{ params:{ ticket:string }, searchParams: { pin?: string } }){
  const pin = (searchParams?.pin || '').trim()
  const d = await fetchDetail(params.ticket, pin)

  if (!pin || !d) {
    // tampilin form PIN kalau belum/ salah
    return (
      <main className="mx-auto w-full max-w-[520px] px-4 pb-24 pt-10 text-slate-900 dark:text-slate-100">
        <h1 className="text-xl font-extrabold">Cek Pengaduan</h1>
        <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">Masukkan PIN untuk melihat detail pengaduan #{params.ticket}.</p>
        <form action={`/pengaduan/${encodeURIComponent(params.ticket)}`} method="get" className="mt-4 rounded-2xl border bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
          <label className="mb-1 block text-sm font-medium">PIN</label>
          <input name="pin" inputMode="numeric" pattern="[0-9]*" placeholder="6 digit"
                 className="w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm dark:bg-slate-900" required />
          <button className="mt-4 w-full rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white hover:bg-rose-700">Lihat Detail</button>
          {!pin ? null : <p className="mt-2 text-xs text-red-600">PIN salah atau sesi kadaluarsa.</p>}
        </form>
        <div className="mt-6">
          <Link href="/pengaduan" className="text-sm underline">← Kembali ke Pengaduan</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="mx-auto w-full max-w-[640px] px-4 pb-24 pt-4 text-slate-900 dark:text-slate-100">
      {/* Header card */}
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
        <div className="flex items-center justify-between">
          <div className="text-xs text-slate-500">#{d.id}</div>
          <StatusBadge status={d.status} />
        </div>
        <h1 className="mt-1 text-lg font-extrabold leading-snug sm:text-xl">{d.category ?? 'Pengaduan'}</h1>
        <div className="text-xs text-slate-500">
          <time>{new Date(d.date).toLocaleString('id-ID')}</time> • {d.name}{d.contact ? ` • ${d.contact}` : ''}
        </div>
        <p className="mt-2 text-sm text-slate-700 dark:text-slate-300">{d.message}</p>
        {d.imageUrl ? <img src={d.imageUrl} alt="" className="mt-3 h-44 w-full rounded-xl object-cover ring-1 ring-black/5" /> : null}
      </div>

      {/* Timeline */}
      <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
        <div className="mb-2 text-sm font-semibold">Status Timeline</div>
        {d.timeline.length === 0 ? (
          <div className="text-sm text-slate-500">Belum ada pembaruan.</div>
        ) : (
          <div className="relative ml-3 space-y-3 before:absolute before:left-0 before:top-1 before:h-full before:w-px before:bg-slate-300 dark:before:bg-slate-700">
            {d.timeline.map((t:any,i:number)=>(
              <div key={i} className="relative pl-3">
                <div className="absolute -left-[7px] top-1 h-3 w-3 rounded-full bg-emerald-500"></div>
                <div className="text-xs text-slate-500">{t.time}</div>
                <div className="text-sm font-medium">{t.title}</div>
                {t.note ? <div className="text-xs text-slate-600 dark:text-slate-400">{t.note}</div> : null}
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Respon */}
      {d.response ? (
        <section className="mt-4 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
          <div className="text-sm font-semibold">Tanggapan Admin</div>
          <p className="mt-1 text-sm text-slate-700 dark:text-slate-300">{d.response}</p>
        </section>
      ) : null}

      <div className="mt-6">
        <Link href="/pengaduan" className="text-sm underline">← Kembali ke Pengaduan</Link>
      </div>
    </main>
  )
}
