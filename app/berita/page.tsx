'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'

type ApiListMeta = { total: number; page: number; per_page: number }
type ApiListItem = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string | null
  thumbnail_url: string | null
  category: string | null
  author: string | null
  published_at: string | null
}
type ApiListResp = { items: ApiListItem[]; meta: ApiListMeta; categories: string[] }

type NewsItem = {
  slug: string
  title: string
  excerpt: string
  cover: string | null
  date: string | null
  category: string | null
}
const mapItem = (a: ApiListItem): NewsItem => ({
  slug: a.slug,
  title: a.title,
  excerpt: a.excerpt ?? '',
  cover: a.thumbnail_url,
  date: a.published_at,
  category: a.category,
})

async function fetchList(page: number): Promise<ApiListResp>{
  const u = new URL(`${API_BASE}/api/berita`)
  u.searchParams.set('page', String(page))
  const res = await fetch(u.toString(), { cache: 'no-store' })
  if (!res.ok) throw new Error('Gagal memuat daftar berita')
  return res.json()
}

export default function Page(){
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')
  const [page, setPage] = useState(1)
  const [items, setItems] = useState<NewsItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // load pertama
  useEffect(()=>{ (async()=>{
    try{
      setLoading(true); setError(null)
      const r = await fetchList(1)
      setItems(r.items.map(mapItem))
      setCategories(r.categories || [])
      setPage(1)
      setHasMore(r.items.length >= (r.meta?.per_page ?? 1))
    }catch(e:any){
      setError(e?.message || 'Error')
    }finally{
      setLoading(false)
    }
  })() },[])

  // filter realtime (search + kategori)
  const filtered = useMemo(()=>{
    const term = q.trim().toLowerCase()
    return items.filter(it=>{
      const okCat = cat ? (it.category ?? '').toLowerCase() === cat.toLowerCase() : true
      const okTerm = term ? (`${it.title} ${it.excerpt ?? ''}`).toLowerCase().includes(term) : true
      return okCat && okTerm
    })
  },[items,q,cat])

  const loadMore = async()=>{
    if (loading || !hasMore) return
    try{
      setLoading(true); setError(null)
      const next = page + 1
      const r = await fetchList(next)
      setItems(prev => [...prev, ...r.items.map(mapItem)])
      setPage(next)
      setHasMore(r.items.length >= (r.meta?.per_page ?? 1))
    }catch(e:any){
      setError(e?.message || 'Error')
    }finally{
      setLoading(false)
    }
  }

  const ioRef = useRef<HTMLDivElement>(null)
  useEffect(()=>{
    if(!ioRef.current) return
    const obs = new IntersectionObserver((entries)=>{
      if(entries[0].isIntersecting && hasMore && !loading) loadMore()
    },{ rootMargin: '160px' })
    obs.observe(ioRef.current)
    return ()=>obs.disconnect()
  },[ioRef.current, hasMore, loading]) // eslint-disable-line

  return (
    <main className="mx-auto w-full max-w-[760px] px-4 pb-24 pt-6 text-slate-900 dark:text-slate-100">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-xl font-extrabold">Berita</h1>
        <Link href="/" className="text-sm underline">Beranda</Link>
      </div>

      {/* Search + kategori (tanpa tombol) */}
      <div className="mb-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
        <input
          value={q}
          onChange={e=> setQ(e.target.value)}
          placeholder="Cari judul / ringkasan…"
          className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm dark:bg-slate-900"
        />
        <select
          value={cat}
          onChange={e=> setCat(e.target.value)}
          className="rounded-xl border bg-white px-3 py-2 text-sm shadow-sm dark:bg-slate-900"
        >
          <option value="">Semua Kategori</option>
          {categories.map(c=> <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      {error && (
        <div className="mb-3 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">
          {error}
        </div>
      )}

      {/* List berita */}
      <section className="space-y-3">
        {filtered.map(n=> (
          <article key={n.slug} className="overflow-hidden rounded-2xl border bg-white shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
            {n.cover ? (
              <img src={n.cover} alt="" className="h-44 w-full object-cover sm:h-56" />
            ) : (
              <div className="h-44 w-full bg-gradient-to-br from-slate-200 to-slate-100 dark:from-slate-800 dark:to-slate-700"/>
            )}
            <div className="space-y-1 p-4">
              <h2 className="text-base font-bold leading-snug">
                <Link href={`/berita/${n.slug}`} className="hover:underline">{n.title}</Link>
              </h2>
              {n.date && (
                <div className="text-xs text-slate-500">
                  {new Date(n.date).toLocaleDateString('id-ID', { day:'2-digit', month:'long', year:'numeric' })}
                  {n.category ? <> • <span>{n.category}</span></> : null}
                </div>
              )}
              {n.excerpt && <p className="text-sm text-slate-700 line-clamp-2 dark:text-slate-300">{n.excerpt}</p>}
              <div className="pt-2">
                <Link href={`/berita/${n.slug}`} className="text-sm font-medium underline">Baca selengkapnya →</Link>
              </div>
            </div>
          </article>
        ))}

        {!loading && filtered.length === 0 && (
          <div className="rounded-2xl border bg-white p-4 text-center text-sm text-slate-600 shadow-sm dark:bg-slate-900">
            Tidak ada berita yang cocok.
          </div>
        )}
      </section>

      {/* Load more */}
      {hasMore && (
        <div className="mt-4 text-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="rounded-xl border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 disabled:opacity-60 dark:bg-slate-900"
          >
            {loading ? 'Memuat…' : 'Muat Lebih Banyak'}
          </button>
        </div>
      )}
      <div ref={ioRef} className="h-8" aria-hidden />
    </main>
  )
}
