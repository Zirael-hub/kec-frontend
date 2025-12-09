import Link from 'next/link'

export type ServiceItem = {
  id: string
  name: string
  icon?: string
  category: string
  short?: string
}

export default function ServiceCard({ item }: { item: ServiceItem }) {
  return (
    <Link href={`/layanan/${item.id}` as any}
      className="group flex flex-col items-center justify-center gap-2 rounded-2xl bg-white p-4 text-center shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 hover:shadow-md active:scale-[0.98] animate-fade-in-up dark:bg-slate-900">
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-2xl text-white shadow-sm">
        {item.icon ?? '📄'}
      </div>
      <div className="text-sm font-semibold">{item.name}</div>
      {item.short ? <div className="line-clamp-2 text-[11px] text-slate-500">{item.short}</div> : null}
    </Link>
  )
}
