'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { bump } from '@/lib/haptics'

export default function MoreMenu(){
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if(e.key === 'Escape') setOpen(false) }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [])

  return (
    <>
      <button
        aria-hidden={!open}
        onClick={()=>setOpen(false)}
        className={"fixed inset-0 bg-black/30 transition-opacity " + (open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none")}
      />
      <div className={"fixed left-0 right-0 bottom-0 z-50 rounded-t-2xl bg-white shadow-xl transition-transform " + (open ? "translate-y-0" : "translate-y-full")}>
        <div className="mx-auto w-full max-w-[420px] p-4">
          <div className="mx-auto mb-3 h-1.5 w-10 rounded-full bg-gray-300" />
          <h3 className="mb-2 text-center text-sm font-medium text-slate-700">Menu Lainnya</h3>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <Link onClick={()=>{ setOpen(false); bump() }} href="/agenda" className="card">Agenda</Link>
            <Link onClick={()=>{ setOpen(false); bump() }} href="/galeri" className="card">Galeri</Link>
            <Link onClick={()=>{ setOpen(false); bump() }} href="/download" className="card">Download</Link>
            <Link onClick={()=>{ setOpen(false); bump() }} href="/infografis" className="card">Infografis</Link>
            <Link onClick={()=>{ setOpen(false); bump() }} href="/pengaduan" className="card">Pengaduan</Link>
            <Link onClick={()=>{ setOpen(false); bump() }} href="/profil" className="card">Profil</Link>
          </div>
          <button onClick={()=>setOpen(false)} className="mt-3 w-full rounded-xl border px-3 py-2">Tutup</button>
        </div>
      </div>
      <button id="more-trigger" onClick={()=>{ setOpen(true); bump() }} className="hidden" />
    </>
  )
}
