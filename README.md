# KEC-PWA (Next.js + Tailwind + next-pwa)

## Jalanin
```bash
npm install
npm run dev
# produksi:
# npm run build && npm start
```

## Konfigurasi API
Buat `.env.local`:
```
NEXT_PUBLIC_API_BASE_URL=http://127.0.0.1:8000/api
```

## Struktur Halaman
- `/` (Home)
- `/berita` & `/berita/[slug]`
- `/pengumuman`
- `/agenda`
- `/layanan` & `/layanan/[id]`
- `/galeri` & `/galeri/[id]`
- `/download`
- `/profil`
- `/pengaduan` & `/pengaduan/sukses`
- `/infografis`
- `/offline`
