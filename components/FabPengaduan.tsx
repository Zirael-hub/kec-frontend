'use client'
import Link from 'next/link'
import { bump } from '@/lib/haptics'

export default function FabPengaduan(){
  return (
    <Link href="/pengaduan" onClick={bump}
      className="fixed right-4 bottom-24 z-40 rounded-full bg-emerald-600 px-4 py-3 text-white shadow-lg">
      Pengaduan +
    </Link>
  )
}
