import Link from "next/link";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'

export async function generateMetadata({ params }:{ params:{ slug:string } }) {
  try {
    const r = await fetch(`${API_BASE}/api/announcements/${params.slug}`, { cache:'no-store' })
    if (!r.ok) return { title: 'Pengumuman' }
    const j = await r.json()
    return { title: j?.title || 'Pengumuman' }
  } catch { return { title: 'Pengumuman' } }
}

type Detail = {
  title: string
  date?: string
  category?: string
  cover?: string | null   // <-- pastikan API kirim ini
  content: string[]
  attachments?: { name?: string; url: string }[]
}

function absolutize(u?: string | null) {
  if (!u) return undefined
  if (/^https?:\/\//i.test(u)) return u
  const base = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/+$/,'')
  return u.startsWith('/') ? `${base}${u}` : `${base}/${u}`
}

export default async function AnnouncementDetailPage({ params }:{ params:{ slug:string } }) {
  const r = await fetch(`${API_BASE}/api/announcements/${params.slug}`, { cache:'no-store' })
  if (!r.ok) {
    return (
      <main className="mx-auto w-full max-w-[420px] px-4 py-8 text-center">
        <h1 className="text-lg font-semibold">Pengumuman tidak ditemukan</h1>
        <Link href="/pengumuman" className="mt-4 inline-block text-sm underline">Kembali ke daftar</Link>
      </main>
    )
  }
  const raw = await r.json() as Detail
  const item: Detail = {
    ...raw,
    cover: absolutize(raw.cover), // jaga-jaga kalau API kasih path relatif
  }

  return (
    <main className="mx-auto w-full max-w-[420px] px-4 pb-24 pt-6 text-slate-900 dark:text-slate-100">
      <article className="space-y-4">
        {/* COVER */}
        {item.cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.cover}
            alt={item.title}
            className="h-44 w-full rounded-2xl object-cover ring-1 ring-black/5 sm:h-56"
          />
        ) : null}

        <header>
          <h1 className="text-xl font-bold">{item.title}</h1>
          <p className="text-sm text-slate-500">
            {item.date ?? ''}{item.category ? ` • ${item.category}` : ''}
          </p>
        </header>

        <div className="prose prose-sm max-w-none dark:prose-invert">
          {item.content?.length
            ? item.content.map((p,i)=><p key={i}>{p}</p>)
            : <p>Tidak ada konten.</p>}
        </div>

        {Array.isArray(item.attachments) && item.attachments.length>0 && (
          <section className="mt-4">
            <div className="mb-2 text-sm font-semibold">Lampiran</div>
            <ul className="list-inside list-disc text-sm">
              {item.attachments.map((a,i)=>(
                <li key={i}>
                  <a href={a.url} target="_blank" rel="noreferrer" className="underline">
                    {a.name || a.url}
                  </a>
                </li>
              ))}
            </ul>
          </section>
        )}
      </article>

      <div className="mt-8 text-center">
        <Link href="/pengumuman" className="text-sm underline">← Kembali ke pengumuman</Link>
      </div>
    </main>
  )
}
