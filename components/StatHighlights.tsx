// components/StatHighlights.tsx
type Card = { title:string; value:string|number; gradient?:string; icon?:string }

export default function StatHighlights({ items }:{ items: Card[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Highlight Info</h2>
      <div className="grid grid-cols-2 gap-3">
        {items.map((c, i)=>(
          <div key={i} className={`rounded-2xl p-4 text-white shadow-md ${c.gradient ?? 'bg-gradient-to-br from-indigo-500 to-violet-600'}`}>
            <div className="flex items-start justify-between">
              <div className="text-xs/5 opacity-90">{c.title}</div>
              {c.icon ? <div className="text-lg opacity-90">{c.icon}</div> : null}
            </div>
            <div className="mt-1 text-2xl font-extrabold">{c.value}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
