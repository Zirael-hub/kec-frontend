export default function Awards({ items }:{ items:{ label:string; year?:string }[] }) {
  if(!items?.length) return null
  return (
    <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
      <div className="mb-2 text-sm font-semibold">Penghargaan & Capaian</div>
      <div className="flex flex-wrap gap-2">
        {items.map((a,i)=>(
          <span key={i} className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800">
            {a.label}{a.year ? ` (${a.year})` : ''}
          </span>
        ))}
      </div>
    </section>
  )
}
