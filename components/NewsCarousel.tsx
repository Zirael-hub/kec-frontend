// components/NewsCarousel.tsx
import Link from 'next/link'

type News = { slug:string; title:string; excerpt:string; cover?:string; date?:string }

export default function NewsCarousel({ items }: { items: News[] }) {
  return (
    <section className="space-y-2">
      <div className="flex items-baseline justify-between">
        <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Berita Terbaru</h2>
        <Link href="/berita" className="text-xs text-emerald-700 underline">Lihat semua</Link>
      </div>
      <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
        <div className="flex gap-3">
          {items.map(n => (
            <div key={n.slug} className="w-[240px] flex-none overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
              {n.cover ? <img src={n.cover} alt="" className="h-28 w-full object-cover" /> : null}
              <div className="space-y-2 p-3">
                <div className="line-clamp-2 text-sm font-semibold">{n.title}</div>
                <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400">{n.excerpt}</p>
                <Link href={`/berita/${n.slug}`} className="text-xs font-medium text-emerald-700 underline">Read more</Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
