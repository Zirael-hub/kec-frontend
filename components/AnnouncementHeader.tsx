export default function AnnouncementHeader() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-amber-500/90 via-orange-500/90 to-rose-500/90 px-4 py-5 text-white shadow-sm ring-1 ring-black/5 dark:from-amber-700 dark:via-orange-700 dark:to-rose-700">
      <div className="flex items-center gap-3">
        <span className="text-xl">📣</span>
        <div>
          <h1 className="text-lg font-bold leading-tight">Pengumuman</h1>
          <p className="text-xs/5 opacity-90">Info resmi & penting untuk masyarakat</p>
        </div>
      </div>
    </div>
  )
}
