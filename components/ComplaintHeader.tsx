export default function ComplaintHeader() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-rose-500/90 via-orange-500/90 to-amber-500/90 px-4 py-5 text-white shadow-sm ring-1 ring-black/5 dark:from-rose-700 dark:via-orange-700 dark:to-amber-700">
      <div className="flex items-center gap-3">
        <span className="text-xl">📝</span>
        <div>
          <h1 className="text-lg font-bold leading-tight">Pengaduan Masyarakat</h1>
          <p className="text-xs/5 opacity-90">Sampaikan keluhan, saran, atau laporan Anda</p>
        </div>
      </div>
    </div>
  )
}
