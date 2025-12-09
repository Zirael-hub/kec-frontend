import Link from "next/link"

export type Attachment = { name: string; url: string }
export type AnnouncementItem = {
  slug?: string
  title?: string
  excerpt?: string
  date?: string
  category?: string
  tag?: "Penting" | "Umum" | "Layanan" | string
  pinned?: boolean
  attachments?: Attachment[]
}

export default function AnnouncementCard({ item }: { item: AnnouncementItem }) {
  // Badge warna berdasarkan tag
  const badge = item.tag ? (
    <span
      className={
        "rounded-full px-2 py-0.5 text-[10px] ring-1 " +
        (item.tag === "Penting"
          ? "bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:ring-rose-800"
          : item.tag === "Layanan"
          ? "bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:ring-sky-800"
          : "bg-slate-100 text-slate-600 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700")
      }
    >
      {item.tag}
    </span>
  ) : null

  // Fallback slug kalau kosong
  const slug = item.slug ?? "detail"

  // Fallback judul & excerpt
  const title = item.title ?? "Tanpa Judul"
  const excerpt = item.excerpt ?? "Tidak ada deskripsi singkat."

  // Format tanggal aman
  let formattedDate = "Tanggal tidak tersedia"
  if (item.date) {
    try {
      formattedDate = new Date(item.date).toLocaleDateString("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    } catch (e) {
      formattedDate = item.date
    }
  }

  return (
    <Link
      href={`/pengumuman/${slug}`}
      prefetch={false}
      className={
        "group block overflow-hidden rounded-2xl shadow-sm ring-1 transition " +
        (item.pinned
          ? "bg-amber-50 ring-amber-200 hover:-translate-y-0.5 hover:shadow-md dark:bg-amber-900/10 dark:ring-amber-800"
          : "bg-white ring-black/5 hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900") +
        " animate-fade-in-up"
      }
    >
      <div className="p-3">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-2 text-sm font-semibold group-hover:text-emerald-700">
            {title}
          </h3>
          {badge}
        </div>
        <p className="mt-1 line-clamp-3 text-xs text-slate-600 dark:text-slate-400">
          {excerpt}
        </p>
        <div className="mt-2 flex items-center justify-between">
          <time className="text-[11px] text-slate-500">{formattedDate}</time>
          {item.category ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">
              {item.category}
            </span>
          ) : null}
        </div>
      </div>
    </Link>
  )
}
