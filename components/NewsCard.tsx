import Link from 'next/link'

export type NewsItem = {
  slug: string
  title: string
  excerpt: string
  cover?: string
  date: string
  category?: string
}

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <Link href={`/berita/${item.slug}` as any}
      className="group block overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 transition-transform hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] animate-fade-in-up dark:bg-slate-900">
      <div className="grid grid-cols-3 gap-0">
        {item.cover
          ? <img src={item.cover} alt="" className="col-span-1 h-24 w-full object-cover sm:h-28" />
          : <div className="col-span-1 h-24 w-full bg-gradient-to-br from-slate-200 to-slate-100 sm:h-28 dark:from-slate-800 dark:to-slate-700" />
        }
        <div className="col-span-2 p-3">
          <div className="line-clamp-2 text-sm font-semibold group-hover:text-emerald-700">{item.title}</div>
          <p className="mt-1 line-clamp-3 text-xs text-slate-600 dark:text-slate-400">{item.excerpt}</p>
          <div className="mt-2 flex items-center justify-between">
            <time className="text-[11px] text-slate-500">
              {new Date(item.date).toLocaleDateString('id-ID', { day:'2-digit', month:'short', year:'numeric' })}
            </time>
            {item.category ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{item.category}</span> : null}
          </div>
        </div>
      </div>
    </Link>
  )
}
