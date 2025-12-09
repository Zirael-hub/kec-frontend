export default function ContactCard({
  address, phone, email, mapEmbedHtml,
}:{
  address: string
  phone?: string
  email?: string
  mapEmbedHtml?: string // boleh iframe HTML dari backend
}) {
  return (
    <section className="grid gap-3">
      <div className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
        <div className="text-sm font-semibold">Kontak & Alamat</div>
        <div className="mt-1 text-sm text-slate-700 dark:text-slate-300">{address}</div>
        <div className="mt-2 grid grid-cols-1 gap-1 text-sm">
          {phone ? <div>📞 {phone}</div> : null}
          {email ? <div>✉️ {email}</div> : null}
        </div>
      </div>

      {mapEmbedHtml ? (
        <div className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
          <div className="h-56 w-full bg-slate-200 dark:bg-slate-800" dangerouslySetInnerHTML={{ __html: mapEmbedHtml }} />
        </div>
      ) : null}
    </section>
  )
}
