// components/AgendaList.tsx
type Item = { id:number|string; date:string; title:string; time?:string; place?:string }

export default function AgendaList({ items }: { items: Item[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Agenda</h2>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
        <ul className="divide-y divide-slate-100 dark:divide-slate-800">
          {items.map(a=>(
            <li key={a.id} className="flex items-start gap-3 px-3 py-2">
              <div className="flex w-14 flex-col items-center justify-center rounded-xl bg-emerald-50 p-2 text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800">
                <div className="text-[10px] leading-none">{new Date(a.date).toLocaleString('id-ID',{month:'short'})}</div>
                <div className="text-lg font-bold leading-none">{new Date(a.date).getDate()}</div>
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-medium">{a.title}</div>
                <div className="text-xs text-slate-500">{a.time ?? ''} {a.place ? `• ${a.place}` : ''}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
