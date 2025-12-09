import Link from 'next/link'
import StatusBadge, { ComplaintStatus } from './StatusBadge'

export type ComplaintItem = {
  id: string
  name: string
  contact?: string
  category?: string
  summary: string
  date: string
  status: ComplaintStatus
}

export default function ComplaintCard({ item }: { item: ComplaintItem }) {
  return (
    <Link href={`/pengaduan/${item.id}` as any}
      className="block rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] animate-fade-in-up dark:bg-slate-900">
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="line-clamp-2 text-sm font-semibold">{item.summary}</div>
          <div className="mt-1 text-xs text-slate-600 dark:text-slate-400">
            {item.category ? <span className="mr-1">#{item.category}</span> : null}
            <time>{new Date(item.date).toLocaleDateString('id-ID',{day:'2-digit',month:'short',year:'numeric'})}</time>
            {item.name ? <span className="ml-1 opacity-70">• {item.name}</span> : null}
          </div>
        </div>
        <StatusBadge status={item.status} />
      </div>
    </Link>
  )
}
