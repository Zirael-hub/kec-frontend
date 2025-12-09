type Item = {
  id: string
  title: string
  date: string      // ISO date time
  time?: string     // "09:00 – 11:30"
  location?: string
}

export default function AgendaTimelineItem({ item }: { item: Item }) {
  const d = new Date(item.date)
  const day = d.getDate().toString().padStart(2,'0')
  const mon = d.toLocaleString('id-ID', { month:'short' })

  return (
    <div className="relative grid grid-cols-[56px,1fr] gap-3">
      {/* Left date rail */}
      <div className="relative">
        <div className="sticky top-20 flex flex-col items-center">
          <div className="flex h-14 w-14 flex-col items-center justify-center rounded-xl bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800">
            <div className="text-[10px] leading-none">{mon}</div>
            <div className="text-lg font-bold leading-none">{day}</div>
          </div>
        </div>
      </div>

      {/* Card */}
      <a href={`/agenda/${item.id}`}
         className="group block rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] animate-fade-in-up dark:bg-slate-900">
        <div className="text-sm font-semibold group-hover:text-emerald-700">{item.title}</div>
        <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
          {item.time ? `🕑 ${item.time}` : null} {item.location ? `• 📍 ${item.location}` : null}
        </div>
      </a>

      {/* vertical rail */}
      <div className="pointer-events-none absolute left-[28px] top-16 h-full w-px bg-slate-200 dark:bg-slate-700" />
    </div>
  )
}
