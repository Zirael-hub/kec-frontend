// app/page.tsx
import Link from 'next/link'
import dynamic from 'next/dynamic'

export const metadata = { title: 'Beranda' }

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'
const DesaPicker = dynamic(() => import('@/components/DesaPicker'), { ssr: false })

/* helpers */
function absolutize(u?: string | null) {
  if (!u) return undefined
  if (/^https?:\/\//i.test(u)) return u
  const base = (process.env.NEXT_PUBLIC_API_BASE || '').replace(/\/+$/, '')
  return u.startsWith('/') ? `${base}${u}` : `${base}/${u}`
}
async function safeJson<T>(path: string, fallback: T): Promise<T> {
  try {
    const r = await fetch(`${API_BASE}${path}`, { cache: 'no-store' })
    if (!r.ok) return fallback
    return (await r.json()) as T
  } catch {
    return fallback
  }
}
function monthRangeISO() {
  const now = new Date(); const y = now.getFullYear(); const m = now.getMonth()
  const last = new Date(y, m + 1, 0).getDate()
  const pad = (n: number) => String(n).padStart(2, '0')
  return { from: `${y}-${pad(m + 1)}-01`, to: `${y}-${pad(m + 1)}-${pad(last)}` }
}

export default async function Page() {
  const { from, to } = monthRangeISO()

  const [
    instansi,
    newsApi,
    desaApi,            // ← ambil dari /api/infografis/desa-list
    agendaApi,
    galleryApi,
  ] = await Promise.all([
    safeJson<any>('/api/instansi', {}),
    safeJson<{ items: any[] }>('/api/berita?limit=3', { items: [] }),
    safeJson<any>('/api/infografis/desa-list', {}),  // ← di sini controller API desaList
    safeJson<{ items: any[] }>(`/api/agenda?from=${from}&to=${to}&limit=100`, { items: [] }),
    safeJson<{ items: any[] }>('/api/gallery?type=image&limit=8', { items: [] }),
  ])

  /* instansi/camat/kontak */
  const header = {
    name: instansi?.name ?? 'Kecamatan',
    tagline: instansi?.tagline ?? 'Portal layanan & informasi publik',
    logo: absolutize(instansi?.logo) ?? '/icons/icon-192.png',
    bg: absolutize(instansi?.hero_bg) ?? '/images/hero-sample.jpg',
  }
  const camat = {
    name: instansi?.camat?.name ?? 'Nama Camat',
    title: instansi?.camat?.title ?? 'Camat',
    photo: absolutize(instansi?.camat?.photo) ?? '/images/camat.jpg',
    tagline: instansi?.camat?.tagline ?? 'Pelayanan prima untuk warga.',
  }
  const contact = {
    address: instansi?.contact?.address ?? 'Alamat kantor kecamatan',
    phone: instansi?.contact?.phone ?? '-',
    email: instansi?.contact?.email ?? '-',
    lat: instansi?.contact?.lat,
    lng: instansi?.contact?.lng,
    socials: Array.isArray(instansi?.contact?.socials) ? instansi.contact.socials : [],
  }

  /* berita terbaru (cover dari API / storage) */
  const news = (newsApi.items || []).slice(0, 3).map((n: any) => {
    const rawCover =
      n.cover
      || n.cover_url
      || n.coverPath
      || n.thumbnail_url || n.thumbnail || n.image
      || (n.cover_path ? `/storage/${String(n.cover_path).replace(/\\/g, '/')}` : undefined)
    return {
      slug: n.slug,
      title: n.title,
      date: n.date,
      cover: absolutize(rawCover) ?? '/images/hero-sample.jpg',
      excerpt: n.excerpt,
    }
  })

  /* LIST DESA dari /api/infografis/desa-list
     Handle 3 bentuk: {items:[...]}, {desa:[...]}, atau [...] langsung */
  const rawDesa = Array.isArray(desaApi?.items) ? desaApi.items
    : Array.isArray(desaApi?.desa) ? desaApi.desa
      : (Array.isArray(desaApi) ? desaApi : [])
  const desaList = rawDesa
    .map((d: any) => ({
      slug: d.slug ?? d.id ?? '',
      name: d.name ?? d.title ?? 'Profil Desa',
      cover: absolutize(d.cover || d.image || d.thumb || d.cover_url || (d.cover_path ? `/storage/${String(d.cover_path).replace(/\\/g, '/')}` : undefined)),
    }))
    .filter((x: any) => x.slug)

  /* agenda bulan berjalan */
  const agendas = (agendaApi.items || []).map((a: any) => ({
    id: a.id ?? a.slug ?? a.day ?? a.date,
    day: a.day ?? (typeof a.date === 'string' ? a.date.slice(0, 10) : ''),
    title: a.title, time: a.time, place: a.location ?? a.place,
  }))

  /* galeri */
  const galleryImages: string[] = (galleryApi.items || [])
    .filter((g: any) => g.type === 'image' && (g.thumb || g.src))
    .map((g: any) => absolutize(g.thumb || g.src)!)
    .filter(Boolean)
    .slice(0, 8)

  /* map */
  const mapUrl = (contact.lat && contact.lng)
    ? `https://www.google.com/maps?q=${contact.lat},${contact.lng}&z=14&output=embed`
    : `https://www.google.com/maps?q=${encodeURIComponent(contact.address || header.name)}&z=14&output=embed`

  return (
    <main className="mx-auto w-full max-w-[420px] space-y-6 px-4 pb-24 pt-3 text-slate-900 dark:text-slate-100">

      {/* HEADER INSTANSI */}
      <section className="overflow-hidden rounded-2xl ring-1 ring-black/5">
        <div className="relative h-40 w-full bg-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={header.bg} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
        </div>

        <div className="flex items-center gap-3 bg-white p-4 dark:bg-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-white ring-1 ring-black/5 dark:bg-slate-800">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={header.logo} alt="" className="h-9 w-9 object-contain" />
          </div>

          {/* biar gak kepotong: pakai line-clamp, bukan truncate 1 baris */}
          <div className="min-w-0">
            <div className="line-clamp-2 text-base font-extrabold leading-snug">
              {header.name}
            </div>
            <div className="mt-0.5 line-clamp-2 text-xs leading-snug text-slate-500">
              {header.tagline}
            </div>
          </div>
        </div>

        {/* tombol dibuat flex-center dengan tinggi konsisten */}
        <div className="grid grid-cols-2 gap-2 bg-white p-4 pt-0 dark:bg-slate-900">
          <Link
            href="/profil"
            className="flex h-10 items-center justify-center rounded-xl bg-slate-50 px-3 text-center text-sm font-medium ring-1 ring-black/5 hover:bg-slate-100 dark:bg-slate-800"
          >
            Profil Kecamatan
          </Link>
          <Link
            href="/agenda"
            className="flex h-10 items-center justify-center rounded-xl bg-slate-50 px-3 text-center text-sm font-medium ring-1 ring-black/5 hover:bg-slate-100 dark:bg-slate-800"
          >
            Lihat Agenda
          </Link>
        </div>
      </section>

      {/* HERO CAMAT (foto dominan, teks lebih kecil) */}
      <section className="flex items-center gap-4 rounded-2xl bg-gradient-to-br from-teal-600 to-emerald-600 p-5 text-white shadow-sm">
        <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl ring-1 ring-white/20 sm:h-24 sm:w-24">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={camat.photo} alt={camat.name} className="h-full w-full object-cover" />
        </div>

        <div className="min-w-0">
          <div className="line-clamp-2 text-[11px] font-semibold leading-snug sm:text-[12px]">
            {camat.name}
          </div>
          <div className="mt-0.5 line-clamp-2 text-[10px] leading-snug opacity-90">
            {camat.title}
          </div>
          <div className="mt-1 line-clamp-2 text-[10px] italic opacity-95">
            “{camat.tagline}”
          </div>
        </div>
      </section>

      {/* AKSES CEPAT */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
        <div className="mb-3 text-sm font-semibold">Akses Cepat</div>
        <div className="grid grid-cols-4 gap-2">
          {[
            { href: '/berita', label: 'Berita', emoji: '📰' },
            { href: '/agenda', label: 'Agenda', emoji: '📅' },
            { href: '/layanan', label: 'Layanan', emoji: '🛠️' },
            { href: '/galeri', label: 'Galeri', emoji: '🖼️' },
            { href: '/infografis', label: 'Infografis', emoji: '📊' },
            { href: '/pengaduan', label: 'Pengaduan', emoji: '✍️' },
            { href: '/download', label: 'Download', emoji: '⬇️' },
            { href: '/profil', label: 'Profil', emoji: '🏛️' },
          ].map(x => (
            <Link
              key={x.href}
              href={x.href as any}
              className="group flex flex-col items-center justify-center gap-1 rounded-xl bg-slate-50 p-3 text-center text-xs font-medium ring-1 ring-black/5 hover:bg-slate-100 dark:bg-slate-800"
            >
              <div className="text-xl">{x.emoji}</div>
              <div className="truncate">{x.label}</div>
            </Link>
          ))}
        </div>
      </section>

      {/* BERITA TERBARU */}
      <section className="space-y-3">
        <div className="mb-1 flex items-center justify-between">
          <div className="text-sm font-semibold">Berita Terbaru</div>
          <Link href="/berita" className="text-xs text-emerald-700 underline">Lihat semua</Link>
        </div>
        <div className="space-y-2">
          {news.map(b => (
            <Link
              key={b.slug}
              href={`/berita/${b.slug}`}
              className="flex items-stretch gap-3 rounded-2xl bg-white p-3 ring-1 ring-black/5 transition hover:bg-slate-50 dark:bg-slate-900"
            >
              <div className="relative h-16 w-24 flex-none overflow-hidden rounded-lg ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={b.cover} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="min-w-0">
                <div className="line-clamp-2 text-sm font-semibold">{b.title}</div>
                <div className="mt-1 text-[12px] text-slate-500">{b.date}</div>
              </div>
            </Link>
          ))}
          {news.length === 0 && (
            <div className="rounded-2xl border bg-white p-4 text-center text-sm text-slate-600 dark:bg-slate-900">
              Belum ada berita.
            </div>
          )}
        </div>
      </section>

      {/* PROFIL DESA (dropdown + tombol) */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
        <DesaPicker apiBase={API_BASE} items={desaList} />
      </section>

      {/* AGENDA */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Agenda Bulan Ini</div>
          <Link href="/agenda" className="text-xs text-emerald-700 underline">Lihat semua</Link>
        </div>
        <div className="space-y-2">
          {agendas.map(a => (
            <div key={a.id} className="flex items-start gap-3 rounded-xl bg-slate-50 p-3 ring-1 ring-black/5 dark:bg-slate-800">
              <div className="flex h-10 w-10 flex-none items-center justify-center rounded-lg bg-white text-sm font-bold ring-1 ring-black/5 dark:bg-slate-900">
                {a.day?.slice(8, 10) || '--'}
              </div>
              <div className="min-w-0">
                <div className="truncate text-sm font-semibold">{a.title}</div>
                <div className="text-[12px] text-slate-500">
                  {a.day} {a.time ? `• ${a.time}` : ''}{a.place ? ` • ${a.place}` : ''}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* GALERI */}
      <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
        <div className="mb-3 flex items-center justify-between">
          <div className="text-sm font-semibold">Galeri</div>
          <Link href="/galeri" className="text-xs text-emerald-700 underline">Lihat semua</Link>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {galleryImages.map((src, i) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={src} alt="" className="h-28 w-full rounded-xl object-cover ring-1 ring-black/5" />
          ))}
          {galleryImages.length === 0 && (
            <div className="col-span-2 rounded-xl bg-slate-50 p-4 text-center text-sm text-slate-600 ring-1 ring-black/5 dark:bg-slate-800">
              Belum ada galeri.
            </div>
          )}
        </div>
      </section>

      {/* KONTAK + MAP */}
      <section className="space-y-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
        <div className="text-sm font-semibold">Alamat & Kontak</div>
        <div className="text-sm">{contact.address}</div>
        <div className="text-xs text-slate-500">
          {contact.phone && <>Telp: {contact.phone} • </>}
          {contact.email && <>Email: {contact.email}</>}
        </div>
        <div className="overflow-hidden rounded-xl ring-1 ring-black/5">
          <iframe
            src={mapUrl}
            className="h-56 w-full"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
        {Array.isArray(contact.socials) && contact.socials.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {contact.socials.map((s: any, i: number) => (
              <a
                key={i}
                href={s.url}
                target="_blank"
                className="rounded-xl bg-slate-50 px-3 py-1.5 text-xs font-medium ring-1 ring-black/5 hover:bg-slate-100 dark:bg-slate-800"
              >
                {s.label}
              </a>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
