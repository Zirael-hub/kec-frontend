export default function AgendaHeader() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-violet-500/90 via-indigo-500/90 to-sky-500/90 px-4 py-5 text-white shadow-sm ring-1 ring-black/5 dark:from-violet-700 dark:via-indigo-700 dark:to-sky-700">
      <div className="flex items-center gap-3">
        <span className="text-xl">📅</span>
        <div>
          <h1 className="text-lg font-bold leading-tight">Agenda Kecamatan</h1>
          <p className="text-xs/5 opacity-90">Kegiatan mendatang & event resmi</p>
        </div>
      </div>
    </div>
  )
}
