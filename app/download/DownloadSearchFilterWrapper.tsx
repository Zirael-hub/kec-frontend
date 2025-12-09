'use client'

import { useMemo, useState } from 'react'
import DownloadSearchFilter from '@/components/DownloadSearchFilter'
import DownloadCard, { type FileItem } from '@/components/DownloadCard'

export default function DownloadSearchFilterWrapper({
  items,
  categories,
}: { items: FileItem[], categories: string[] }) {
  const [q, setQ] = useState('')
  const [cat, setCat] = useState('')

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    return items.filter(i => {
      const okCat = cat ? i.category === cat : true
      const okTerm = term ? (i.title + ' ' + (i.description ?? '') + ' ' + i.ext).toLowerCase().includes(term) : true
      return okCat && okTerm
    })
  }, [items, q, cat])

  return (
    <>
      <DownloadSearchFilter
        q={q} setQ={setQ}
        category={cat} setCategory={setCat}
        categories={categories}
      />

      <section className="space-y-3">
        {filtered.map(f => <DownloadCard key={f.id} item={f} />)}
        {filtered.length === 0 && (
          <div className="rounded-2xl border bg-white p-4 text-center text-sm text-slate-600 shadow-sm dark:bg-slate-900">
            Dokumen tidak ditemukan.
          </div>
        )}
      </section>
    </>
  )
}
