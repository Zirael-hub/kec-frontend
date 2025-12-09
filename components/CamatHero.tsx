import Image from 'next/image'
import Link from 'next/link'

type Props = {
  name: string
  title?: string
  photoUrl: string // contoh: '/images/camat.jpg'
  tagline?: string
}

export default function CamatHero({ name, title = 'Camat', photoUrl, tagline }: Props) {
  return (
    <section className="overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-500/90 via-teal-500/90 to-cyan-500/90 p-4 text-white shadow-sm ring-1 ring-black/5 dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-700">
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-2xl ring-2 ring-white/70">
          <Image
            src={photoUrl}
            alt={`Foto ${title} ${name}`}
            fill
            sizes="64px"
            className="object-cover"
            priority
          />
        </div>

        <div className="min-w-0">
          <div className="text-xs/5 opacity-90">{title}</div>
          <h1 className="truncate text-lg font-extrabold">{name}</h1>
          {tagline ? (
            <p className="mt-0.5 line-clamp-2 text-xs/5 opacity-95">{tagline}</p>
          ) : null}

          <div className="mt-2 flex gap-2">
            <Link
              href="/profil"
              className="rounded-xl bg-white/95 px-3 py-1.5 text-xs font-semibold text-emerald-700 shadow-sm ring-1 ring-white hover:bg-white"
            >
              Profil Kecamatan
            </Link>
            <Link
              href="/agenda"
              className="rounded-xl bg-white/15 px-3 py-1.5 text-xs font-medium text-white ring-1 ring-white/30 hover:bg-white/25"
            >
              Lihat Agenda
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
