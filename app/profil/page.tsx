import ProfileHeader from '@/components/ProfileHeader'
import ProfileBanner from '@/components/ProfileBanner'
import ProfileAbout from '@/components/ProfileAbout'
import OrgCard, { type Official } from '@/components/OrgCard'
import ContactCard from '@/components/ContactCard'
import Awards from '@/components/Awards'
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000';
export const metadata = { title: 'Profil Kecamatan' }

// TODO: nanti ganti ke fetch(API)
async function getProfile(){
  const res = await fetch(`${API_BASE}/api/profile`, { cache: 'no-store' });
  if(!res.ok) throw new Error('Gagal memuat profil');
  return res.json();
}

export default async function Page(){
  const d = await getProfile()

  return (
    <main className="mx-auto w-full max-w-[640px] space-y-5 px-4 pb-24 pt-4 text-slate-900 dark:text-slate-100">
      <ProfileHeader />

      <ProfileBanner src={d.banner} />

      <ProfileAbout
        description={d.about.description}
        vision={d.about.vision}
        mission={d.about.mission}
        structureNote={d.about.structureNote}
      />

      {/* Organigram / pejabat */}
      <section className="space-y-3">
        <div className="text-sm font-semibold">Struktur Organisasi</div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {d.officials.map((p,i)=>(<OrgCard key={i} person={p} />))}
        </div>
      </section>

      {/* Kontak & Peta */}
      <ContactCard
        address={d.contact.address}
        phone={d.contact.phone}
        email={d.contact.email}
        mapEmbedHtml={d.contact.mapEmbedHtml}
      />

      {/* Awards / highlights */}
      <Awards items={d.awards} />
    </main>
  )
}
