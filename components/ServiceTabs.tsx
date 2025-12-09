'use client'
type Props = { categories: string[]; current: string; onChange: (c:string)=>void }
export default function ServiceTabs({ categories, current, onChange }: Props) {
  const cats = ['Semua', ...categories]
  return (
    <div className="no-scrollbar -mx-1 overflow-x-auto px-1">
      <div className="flex gap-2">
        {cats.map(c=>{
          const sel = (c==='Semua' && !current) || c===current
          return (
            <button key={c}
              onClick={()=>onChange(c==='Semua' ? '' : c)}
              className={[
                "rounded-full border px-3 py-1 text-xs shadow-sm transition",
                sel
                ? "border-emerald-600 bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300"
                : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800"
              ].join(' ')}
            >{c}</button>
          )
        })}
      </div>
    </div>
  )
}
