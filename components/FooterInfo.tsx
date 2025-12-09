// components/FooterInfo.tsx
export default function FooterInfo({
  address, phone, email, socials,
}:{ address:string; phone:string; email:string; socials?: { label:string; url:string }[] }) {
  return (
    <footer className="rounded-2xl border bg-white p-4 text-sm shadow-sm dark:bg-slate-900">
      <div className="font-semibold">Kantor Kecamatan</div>
      <div className="mt-1 text-slate-600 dark:text-slate-400">{address}</div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
        <div>📞 {phone}</div>
        <div>✉️ {email}</div>
      </div>
      {socials?.length ? (
        <div className="mt-2 flex flex-wrap gap-2">
          {socials.map(s=>(
            <a key={s.label} href={s.url} target="_blank" className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-100 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800">
              {s.label}
            </a>
          ))}
        </div>
      ) : null}
      <div className="mt-3 text-center text-xs text-slate-500">© {new Date().getFullYear()} Kecamatan</div>
    </footer>
  )
}
