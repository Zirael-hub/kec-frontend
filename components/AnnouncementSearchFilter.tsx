'use client'
type Props = {
  q: string; setQ: (v:string)=>void
  category?: string; setCategory: (v:string)=>void
  categories: string[]
}
export default function AnnouncementSearchFilter({ q, setQ, category, setCategory, categories }: Props) {
  const cats = ['Semua', ...categories]
  return (
    <div className="space-y-3">
      {/* Search */}
      <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm dark:bg-slate-900">
        <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-400"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 9.5 16a6.47 6.47 0 0 0 4.23-1.57l.27.28v.79L19.5 21 21 19.5zM9.5 14A4.5 4.5 0 1 1 14 9.5 4.51 4.51 0 0 1 9.5 14"/></svg>
        <input
          value={q} onChange={e=>setQ(e.target.value)}
          placeholder="Cari judul atau deskripsi…"
          className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      {/* Filter kategori */}
      <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
        <div className="flex gap-2">
          {cats.map(c => {
            const selected = (c==='Semua' && !category) || c===category
            return (
              <button
                key={c}
                onClick={()=>setCategory(c==='Semua' ? '' : c)}
                className={[
                  "rounded-full border px-3 py-1 text-xs shadow-sm transition",
                  selected
                    ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                    : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
                ].join(' ')}
              >
                {c}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
