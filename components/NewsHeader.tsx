export default function NewsHeader() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-500/90 via-teal-500/90 to-cyan-500/90 px-4 py-5 text-white shadow-sm ring-1 ring-black/5 dark:from-sky-700 dark:via-teal-700 dark:to-cyan-700">
      <div className="flex items-center gap-3">
        <span className="text-xl">🗞️</span>
        <div>
          <h1 className="text-lg font-bold leading-tight">Berita Terbaru</h1>
          <p className="text-xs/5 opacity-90">Update kegiatan & informasi resmi kecamatan</p>
        </div>
      </div>
    </div>
  )
}
