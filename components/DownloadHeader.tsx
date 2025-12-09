export default function DownloadHeader() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-cyan-500/90 via-teal-500/90 to-emerald-500/90 px-4 py-5 text-white shadow-sm ring-1 ring-black/5 dark:from-cyan-700 dark:via-teal-700 dark:to-emerald-700">
      <div className="flex items-center gap-3">
        <span className="text-xl">⬇️</span>
        <div>
          <h1 className="text-lg font-bold leading-tight">Unduhan Dokumen</h1>
          <p className="text-xs/5 opacity-90">Formulir, peraturan, dan dokumen resmi</p>
        </div>
      </div>
    </div>
  )
}
