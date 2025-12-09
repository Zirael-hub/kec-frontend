export default function ServiceHeader() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-emerald-500/90 via-teal-500/90 to-cyan-500/90 px-4 py-5 text-white shadow-sm ring-1 ring-black/5 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-700">
      <div className="flex items-center gap-3">
        <span className="text-xl">🛠️</span>
        <div>
          <h1 className="text-lg font-bold leading-tight">Layanan Kecamatan</h1>
          <p className="text-xs/5 opacity-90">Informasi syarat & prosedur layanan publik</p>
        </div>
      </div>
    </div>
  )
}
