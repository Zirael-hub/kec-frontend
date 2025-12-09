import Link from 'next/link'

export const metadata = { title: 'Pengaduan Terkirim' }

export default function Page({ searchParams }: { searchParams: { ticket?: string; pin?: string } }) {
  const ticket = searchParams?.ticket || ''
  const pin = searchParams?.pin || ''

  return (
    <main className="mx-auto w-full max-w-[760px] px-4 pb-24 pt-14 text-slate-900 dark:text-slate-100">
      <div className="mx-auto mb-6 w-max rounded-full bg-green-100 px-4 py-1.5 text-green-700 ring-1 ring-green-200">✅ Terkirim</div>
      <h1 className="text-center text-2xl font-extrabold">Terima kasih, pengaduan Anda sudah kami terima</h1>
      <p className="mx-auto mt-2 max-w-[560px] text-center text-sm text-slate-600 dark:text-slate-300">
        Simpan nomor tiket dan PIN berikut untuk melihat detail aduan Anda.
      </p>

      <div className="mx-auto mt-4 grid w-full max-w-[520px] grid-cols-1 gap-2 sm:grid-cols-2">
        <div className="rounded-2xl bg-white px-5 py-3 text-center text-lg font-bold shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
          Tiket: <span className="tracking-wide">#{ticket}</span>
        </div>
        <div className="rounded-2xl bg-white px-5 py-3 text-center text-lg font-bold shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
          PIN: <span className="tracking-widest">{pin}</span>
        </div>
      </div>

      {ticket && pin ? (
        <div className="mt-6 flex justify-center">
          <Link
            href={`/pengaduan/${ticket}?pin=${pin}`}
            className="rounded-xl border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:bg-slate-900"
          >
            Lihat Detail →
          </Link>
        </div>
      ) : null}

      <div className="mt-8 flex justify-center">
        <Link href="/" className="text-sm underline">Kembali ke Beranda</Link>
      </div>
    </main>
  )
}
