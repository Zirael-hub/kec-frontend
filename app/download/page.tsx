import DownloadHeader from '@/components/DownloadHeader'
import DownloadSearchFilterWrapper from './DownloadSearchFilterWrapper'
import Link from 'next/link'
import { type FileItem } from '@/components/DownloadCard'

export const metadata = { title: 'Unduhan Dokumen' }

// Dummy loader (ganti ke fetch API / DB query di server)
async function loadFiles(): Promise<{ items: FileItem[]; categories: string[] }> {
  const items: FileItem[] = [
    { id:'f-01', title:'Formulir Permohonan KTP-el', description:'Digunakan untuk perekaman dan pencetakan KTP elektronik.', sizeBytes: 245_760, ext:'pdf', category:'Formulir', url:'/files/form-ktp.pdf' },
    { id:'f-02', title:'Formulir Kartu Keluarga (KK)', description:'Permohonan penerbitan KK baru atau perubahan data.', sizeBytes: 196_608, ext:'docx', category:'Formulir', url:'/files/form-kk.docx' },
    { id:'f-03', title:'Laporan Realisasi Kegiatan Triwulan', description:'Realisasi program pembangunan kecamatan.', sizeBytes: 1_572_864, ext:'xlsx', category:'Laporan', url:'/files/laporan-triwulan.xlsx' },
    { id:'f-04', title:'Peraturan Camat No. 3 Tahun 2025', description:'Pedoman pelayanan administrasi kependudukan di kecamatan.', sizeBytes: 512_000, ext:'pdf', category:'Peraturan', url:'/files/percam-3-2025.pdf' },
    { id:'f-05', title:'Panduan UMKM Naik Kelas', description:'E-book singkat untuk pelaku UMKM di wilayah kecamatan.', sizeBytes: 2_621_440, ext:'pdf', category:'Panduan', url:'/files/panduan-umkm.pdf' },
    { id:'f-06', title:'Paket Dokumen Pengajuan IUMK', description:'Arsip zip berisi contoh formulir & checklist persyaratan.', sizeBytes: 4_980_736, ext:'zip', category:'Perizinan', url:'/files/paket-iumk.zip' },
  ]
  const categories = Array.from(new Set(items.map(i=>i.category).filter(Boolean))) as string[]
  return { items, categories }
}

export default async function Page() {
  const { items, categories } = await loadFiles()

  return (
    <main className="mx-auto w-full max-w-[640px] space-y-5 px-4 pb-24 pt-4 text-slate-900 dark:text-slate-100">
      <DownloadHeader />

      {/* Komponen client diimport terpisah */}
      <DownloadSearchFilterWrapper
        items={items}
        categories={categories}
      />

      <div className="pt-2 text-center text-[11px] text-slate-500">
        <Link href="/" className="underline">Beranda</Link>
      </div>
    </main>
  )
}
