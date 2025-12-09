export default function GalleryHeader() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-fuchsia-500/90 via-rose-500/90 to-orange-500/90 px-4 py-5 text-white shadow-sm ring-1 ring-black/5 dark:from-fuchsia-700 dark:via-rose-700 dark:to-orange-700">
      <div className="flex items-center gap-3">
        <span className="text-xl">🖼️</span>
        <div>
          <h1 className="text-lg font-bold leading-tight">Galeri Kegiatan</h1>
          <p className="text-xs/5 opacity-90">Dokumentasi acara, pembangunan, dan aktivitas</p>
        </div>
      </div>
    </div>
  )
}
