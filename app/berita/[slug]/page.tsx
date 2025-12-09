import React from 'react'
import Link from 'next/link'

// (opsional) kalau sudah ada komponen share:
// import ShareBar from '@/components/ShareBar'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'

type ApiDetail = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  thumbnail_url: string | null
  category: string | null
  author: string | null
  published_at: string | null
  url: string | null
}

async function fetchDetail(slug: string): Promise<ApiDetail> {
  const res = await fetch(`${API_BASE}/api/berita/${slug}`, { cache: 'no-store' })
  if (res.status === 404) throw new Error('NOT_FOUND')
  if (!res.ok) throw new Error('FAILED')
  return res.json()
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function stripHtml(html: string){
  return html.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim()
}

function isHtml(raw: string){
  return /<\/?[a-z][\s\S]*>/i.test(raw)
}

/** Render konten rapi:
 * - Jika sudah HTML → render apa adanya
 * - Jika teks biasa → pecah per paragraf (1+ baris kosong) */
function renderContent(raw?: string|null){
  if (!raw) return <p>Tidak ada konten.</p>
  if (isHtml(raw)) return <div dangerouslySetInnerHTML={{ __html: raw }} />
  const paras = raw.split(/\n{2,}/).map(s => s.trim()).filter(Boolean)
  return paras.map((p, i) => <p key={i}>{p}</p>)
}

// SEO dinamis
export async function generateMetadata({ params }:{ params: { slug: string } }) {
  try{
    const d = await fetchDetail(params.slug)
    const title = d.title || 'Detail Berita'
    const desc = d.excerpt || (d.content ? (stripHtml(d.content).slice(0,150)+'…') : '')
    const ogImg = d.thumbnail_url || ''
    return {
      title,
      description: desc,
      openGraph: {
        title, description: desc,
        images: ogImg ? [{ url: ogImg }] : [],
      },
      twitter: {
        card: 'summary_large_image',
        title, description: desc,
        images: ogImg ? [ogImg] : [],
      },
    }
  }catch{
    return { title: 'Detail Berita', description: '' }
  }
}

export default async function Page({ params }:{ params: { slug: string } }){
  let d: ApiDetail
  try{
    d = await fetchDetail(params.slug)
  }catch(e:any){
    if (e?.message === 'NOT_FOUND'){
      return (
        <main className="mx-auto w-full max-w-[640px] px-4 pb-24 pt-6">
          <h1 className="text-xl font-bold">Berita tidak ditemukan</h1>
          <p className="mt-2 text-sm text-slate-600">Coba kembali ke daftar berita.</p>
          <div className="mt-4">
            <Link href="/berita" className="inline-flex items-center rounded-xl border bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:bg-slate-900">
              ← Kembali ke Berita
            </Link>
          </div>
        </main>
      )
    }
    throw e
  }

  return (
    <main className="mx-auto w-full max-w-[720px] px-4 pb-24 pt-6 text-slate-900 dark:text-slate-100">
      {/* Header image */}
      <figure className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
        {d.thumbnail_url ? (
          <img src={d.thumbnail_url} alt="" className="h-56 w-full object-cover sm:h-72" />
        ) : (
          <div className="h-56 w-full bg-gradient-to-br from-slate-200 to-slate-100 sm:h-72 dark:from-slate-800 dark:to-slate-700"/>
        )}
      </figure>

      {/* Title + meta */}
      <article className="mt-4">
        <h1 className="text-xl font-extrabold leading-tight tracking-tight sm:text-2xl">
          {d.title}
        </h1>
        <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-slate-500">
          {d.published_at && (
            <time>
              {new Date(d.published_at).toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' })}
            </time>
          )}
          {d.author ? (<><span>•</span><span>Penulis: {d.author}</span></>) : null}
          {d.category ? (
            <>
              <span>•</span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
                {d.category}
              </span>
            </>
          ) : null}
        </div>

        {/* Content (rapi) */}
        <div
          className="
            prose prose-sm sm:prose-base lg:prose-lg
            mt-4 mx-auto max-w-prose
            text-slate-800 dark:prose-invert
            prose-p:my-4 prose-p:leading-7
            prose-img:rounded-xl prose-img:my-4
            prose-headings:scroll-mt-24
          "
          style={{ textAlign: 'justify' }} // hapus kalau tak mau rata kiri-kanan
        >
          {renderContent(d.content)}
        </div>

        {/* Share buttons (opsional) */}
        {/* <ShareBar url={d.url ?? `${API_BASE}/berita/${d.slug}`} title={d.title} /> */}
      </article>

      {/* Back button */}
      <div className="mt-6">
        <Link
          href="/berita"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:bg-slate-900"
        >
          ← Kembali ke Berita
        </Link>
      </div>
    </main>
  )
}
