'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import ServiceHeader from '@/components/ServiceHeader'
import ServiceSearch from '@/components/ServiceSearch'
import ServiceTabs from '@/components/ServiceTabs'
import ServiceCard, { ServiceItem } from '@/components/ServiceCard'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'

type ApiListResp = { items: ServiceItem[]; categories: string[] }

export default function Page(){
  const [items, setItems] = useState<ServiceItem[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('') // '' = semua
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(()=>{ (async()=>{
    try{
      setLoading(true); setError(null)
      const r = await fetch(`${API_BASE}/api/services`, { cache: 'no-store' })
      if(!r.ok) throw new Error('Gagal memuat layanan')
      const data: ApiListResp = await r.json()
      setItems(data.items || [])
      setCategories(data.categories || [])
    }catch(e:any){
      setError(e?.message || 'Error')
    }finally{
      setLoading(false)
    }
  })() },[])

  const filtered = useMemo(()=>{
    const term = q.trim().toLowerCase()
    return items.filter(it=>{
      const byCat = cat ? it.category.toLowerCase() === cat.toLowerCase() : true
      const byQ = term ? (`${it.name} ${it.short ?? ''}`).toLowerCase().includes(term) : true
      return byCat && byQ
    })
  },[items,q,cat])

  return (
    <main className="mx-auto w-full max-w-[1040px] px-5 pb-24 pt-8 text-slate-900 dark:text-slate-100">
      {/* top bar */}
      <div className="mb-5">
    <ServiceHeader />
  </div>


      {/* search */}
      <ServiceSearch q={q} setQ={setQ} />

      {/* tabs */}
      <div className="mt-4">
        <ServiceTabs categories={categories} current={cat} onChange={setCat} />
      </div>

      {/* error */}
      {error && (
        <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-red-700">{error}</div>
      )}

      {/* grid */}
      <div className="mt-4">
        {loading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({length:6}).map((_,i)=>(
              <div key={i} className="h-36 animate-pulse rounded-2xl border bg-white shadow-sm ring-1 ring-black/5 dark:bg-slate-900"/>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border bg-white p-6 text-center text-sm text-slate-600 shadow-sm dark:bg-slate-900">
            Tidak ada layanan yang cocok.
          </div>
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((it)=>(
              <li key={it.id}>
                <ServiceCard item={it}/>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* footer line */}
      <div className="mx-auto mt-16 h-px w-full max-w-[920px] bg-slate-200/70" />
      <p className="mt-3 text-center text-[11px] text-slate-500">© {new Date().getFullYear()} Kecamatan Cisompet</p>
    </main>
  )
}
