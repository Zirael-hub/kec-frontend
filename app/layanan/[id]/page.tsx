import Link from 'next/link'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'

type ServiceDetail = {
  id: string
  title: string
  description: string | null
  category: string
  requirements: string[]
  timeEst?: string | null
  contact: { name?: string | null; phone?: string | null; email?: string | null; desk?: string | null }
  files: { name: string; url: string }[]
  applyUrl?: string | null
}

async function getDetail(id: string): Promise<ServiceDetail> {
  const r = await fetch(`${API_BASE}/api/services/${id}`, { cache: 'no-store' })
  if (r.status === 404) throw new Error('NOT_FOUND')
  if (!r.ok) throw new Error('FAILED')
  return r.json()
}

export async function generateMetadata({ params }:{ params: { id: string } }){
  try{
    const d = await getDetail(params.id)
    const title = `${d.title} · Layanan`
    const desc = d.description ? d.description.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').slice(0,150)+'…' : ''
    return {
      title,
      description: desc,
      openGraph: { title, description: desc },
      twitter: { card: 'summary', title, description: desc },
    }
  }catch{
    return { title: 'Layanan', description: '' }
  }
}

export default async function Page({ params }:{ params: { id: string } }){
  let d: ServiceDetail
  try{
    d = await getDetail(params.id)
  }catch(e:any){
    if(e?.message === 'NOT_FOUND'){
      return (
        <main className="mx-auto w-full max-w-[860px] px-4 pb-24 pt-6">
          <h1 className="text-xl font-bold">Layanan tidak ditemukan</h1>
          <div className="mt-4">
            <Link href="/layanan" className="inline-flex items-center rounded-xl border bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:bg-slate-900">
              ← Kembali ke Layanan
            </Link>
          </div>
        </main>
      )
    }
    throw e
  }

  return (
    <main className="mx-auto w-full max-w-[860px] px-4 pb-24 pt-6 text-slate-900 dark:text-slate-100">
      <header className="mb-5">
        <div className="text-xs text-slate-500">{d.category}</div>
        <h1 className="text-2xl font-extrabold leading-tight">{d.title}</h1>
        {d.timeEst ? <div className="mt-1 text-sm text-slate-600 dark:text-slate-300">Estimasi proses: {d.timeEst}</div> : null}
      </header>

      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        {/* Kolom kiri */}
        <div className="space-y-5 lg:col-span-2">
          {/* Deskripsi */}
          <section className="rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
            <h2 className="mb-2 text-lg font-extrabold">Deskripsi</h2>
            {d.description
              ? <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: d.description }} />
              : <p className="text-sm text-slate-500">Belum ada deskripsi.</p>
            }
          </section>

          {/* Syarat */}
          <section className="rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
            <h2 className="mb-2 text-lg font-extrabold">Persyaratan</h2>
            {d.requirements.length === 0 ? (
              <p className="text-sm text-slate-500">Belum ada syarat.</p>
            ) : (
              <ul className="list-inside list-disc space-y-1 text-sm">
                {d.requirements.map((s, i)=> <li key={i}>{s}</li>)}
              </ul>
            )}
          </section>

          {/* Berkas / Formulir */}
          <section className="rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
            <h2 className="mb-2 text-lg font-extrabold">Unduhan</h2>
            {d.files.length === 0 ? (
              <p className="text-sm text-slate-500">Tidak ada berkas.</p>
            ) : (
              <ul className="divide-y">
                {d.files.map((f,i)=>(
                  <li key={i} className="flex items-center justify-between py-2 text-sm">
                    <span>{f.name}</span>
                    <a href={f.url} target="_blank" className="rounded-lg border px-3 py-1 text-xs font-medium hover:bg-gray-50 dark:bg-slate-900">
                      Download
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        {/* Kolom kanan */}
        <div className="space-y-5">
          {/* Kontak */}
          <section className="rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
            <h2 className="mb-2 text-lg font-extrabold">Kontak Layanan</h2>
            <div className="space-y-1 text-sm">
              {d.contact?.name && <div><span className="text-slate-500">Unit:</span> <span className="ml-1">{d.contact.name}</span></div>}
              {d.contact?.desk && <div><span className="text-slate-500">Desk/Loket:</span> <span className="ml-1">{d.contact.desk}</span></div>}
              {d.contact?.phone && <div><span className="text-slate-500">Telepon:</span> <span className="ml-1">{d.contact.phone}</span></div>}
              {d.contact?.email && <div><span className="text-slate-500">Email:</span> <span className="ml-1">{d.contact.email}</span></div>}
              {!d.contact?.name && !d.contact?.desk && !d.contact?.phone && !d.contact?.email && (
                <div className="text-slate-500">Belum ada info kontak.</div>
              )}
            </div>
          </section>

          {/* Ajukan (opsional) */}
          {d.applyUrl ? (
            <section className="rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
              <h2 className="mb-3 text-lg font-extrabold">Ajukan Layanan</h2>
              <a
                href={d.applyUrl}
                target="_blank"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:bg-slate-900"
              >
                Buka Formulir →
              </a>
              <p className="mt-2 text-xs text-slate-500">Tautan membuka halaman pendaftaran/permohonan.</p>
            </section>
          ) : null}
        </div>
      </div>

      <div className="mt-6">
        <Link href="/layanan" className="inline-flex items-center rounded-xl border bg-white px-3 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:bg-slate-900">
          ← Kembali ke Layanan
        </Link>
      </div>
    </main>
  )
}
