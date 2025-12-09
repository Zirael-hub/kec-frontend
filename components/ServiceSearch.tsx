'use client'
type Props = { q: string; setQ: (v:string)=>void }
export default function ServiceSearch({ q, setQ }: Props) {
  return (
    <div className="flex items-center gap-2 rounded-xl border bg-white px-3 py-2 shadow-sm dark:bg-slate-900">
      <svg width="18" height="18" viewBox="0 0 24 24" className="text-slate-400">
        <path fill="currentColor" d="M15.5 14h-.79l-.28-.27A6.5 6.5 0 1 0 9.5 16a6.47 6.47 0 0 0 4.23-1.57l.27.28v.79L19.5 21 21 19.5zM9.5 14A4.5 4.5 0 1 1 14 9.5 4.51 4.51 0 0 1 9.5 14"/>
      </svg>
      <input
        value={q} onChange={e=>setQ(e.target.value)}
        placeholder="Cari layanan (cth: KTP, Izin Usaha)…"
        className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
      />
    </div>
  )
}
