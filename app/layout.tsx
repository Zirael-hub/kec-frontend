// app/layout.tsx
import '../styles/globals.css'
import '../styles/globals-append.css'
// (opsional, kalau kamu pakai animasi dari patch UX)
// import '../styles/globals-append.css'

import Link from 'next/link'
import InstallPWAButton from '@/components/InstallPWAButton'
import BottomNav from '@/components/BottomNav'
import MoreMenu from '@/components/MoreMenu'
import FabPengaduan from '@/components/FabPengaduan'

export const metadata = {
  title: 'Kecamatan Cisompet',
  description: 'Portal layanan & informasi kecamatan',
  manifest: '/site.webmanifest', // penting untuk installability
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-gray-50 text-slate-900">
        <header className="sticky top-0 z-10 border-b bg-white/80 backdrop-blur">
        <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
  integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossOrigin="" />

          <nav className="mx-auto w-full max-w-[420px] flex items-center gap-4 py-3 px-4">
            <Link href="/" className="font-semibold">Pemerintah Kabupaten Garut</Link>
          </nav>
        </header>

        {/* tambah pb-24 supaya aman tidak ketutup bottom nav */}
        <main className="mx-auto w-full max-w-[420px] px-4 pt-4 pb-24">
          {children}
        </main>

        <footer className="mx-auto w-full max-w-[420px] border-t py-6 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} Kecamatan Cisompet
        </footer>

        {/* Menu bawah utama */}
        <BottomNav />

        {/* Bottom sheet "Lainnya" (dibuka dari tombol Lainnya di BottomNav) */}
        <MoreMenu />

        {/* Tombol Pengaduan mengambang */}
        <FabPengaduan />

        {/* Tombol Install PWA (muncul saat eligible) */}
        <InstallPWAButton />
      </body>
    </html>
  )
}
