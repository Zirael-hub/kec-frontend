export default function ProfileHeader() {
  return (
    <div className="rounded-2xl bg-gradient-to-br from-indigo-500/90 via-sky-500/90 to-cyan-500/90 px-4 py-5 text-white shadow-sm ring-1 ring-black/5 dark:from-indigo-700 dark:via-sky-700 dark:to-cyan-700">
      <div className="flex items-center gap-3">
        <span className="text-xl">🏛️</span>
        <div>
          <h1 className="text-lg font-bold leading-tight">Profil Kecamatan</h1>
          <p className="text-xs/5 opacity-90">Sejarah, visi misi, struktur & kontak resmi</p>
        </div>
      </div>
    </div>
  )
}
