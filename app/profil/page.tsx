import ProfileHeader from '@/components/ProfileHeader'
import ProfileBanner from '@/components/ProfileBanner'
import ProfileAbout from '@/components/ProfileAbout'
import OrgCard, { type Official } from '@/components/OrgCard'
import ContactCard from '@/components/ContactCard'
import Awards from '@/components/Awards'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'

export const metadata = { title: 'Profil Kecamatan' }

type ProfileResponse = {
  banner?: string | null
  about: {
    description?: string | null
    vision?: string | null
    mission?: string[] | null
    structureNote?: string | null
  }
  officials?: Official[] | null
  contact: {
    address?: string | null
    phone?: string | null
    email?: string | null
    mapEmbedHtml?: string | null
  }
  awards?: any[] | null
}

// TODO: nanti ganti ke fetch(API)
async function getProfile(): Promise<ProfileResponse> {
  const res = await fetch(`${API_BASE}/api/profile`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Gagal memuat profil')
  const data = await res.json()
  return data as ProfileResponse
}

export default async function Page() {
  const d = await getProfile()

  const officials: Official[] = Array.isArray(d.officials) ? d.officials : []
  const awards = Array.isArray(d.awards) ? d.awards : []

  const bannerSrc: string =
    d.banner ??
    '/images/hero-sample.jpg' // fallback supaya selalu string

  return (
    <main className="mx-auto w-full max-w-[640px] space-y-5 px-4 pb-24 pt-4 text-slate-900 dark:text-slate-100">
      <ProfileHeader />

      <ProfileBanner src={bannerSrc} />

      <ProfileAbout
        description={d.about?.description ?? ''}
        vision={d.about?.vision ?? ''}
        mission={d.about?.mission ?? []}
        structureNote={d.about?.structureNote ?? ''}
      />

      {/* Organigram / pejabat */}
      <section className="space-y-3">
        <div className="text-sm font-semibold">Struktur Organisasi</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {officials.map((p: Official, i: number) => (
            <OrgCard key={i} person={p} />
          ))}
          {officials.length === 0 && (
            <div className="col-span-1 text-xs text-slate-500">
              Data pejabat belum tersedia.
            </div>
          )}
        </div>
      </section>

      {/* Kontak & Peta */}
      <ContactCard
        address={d.contact?.address ?? ''}
        phone={d.contact?.phone ?? ''}
        email={d.contact?.email ?? ''}
        mapEmbedHtml={d.contact?.mapEmbedHtml ?? ''}
      />

      {/* Awards / highlights */}
      <Awards items={awards} />
    </main>
  )
}
