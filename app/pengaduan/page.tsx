'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'

export default function Page() {
  const router = useRouter()

  // ----- state Form Kirim -----
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [category, setCategory] = useState('')
  const [message, setMessage] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [filePreview, setFilePreview] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ----- state Cek Laporan -----
  const [ticket, setTicket] = useState('')
  const [pin, setPin] = useState('')
  const [checking, setChecking] = useState(false)
  const [checkError, setCheckError] = useState<string | null>(null)

  // simpan & ambil tiket/pin terakhir (biar nyaman)
  useEffect(() => {
    const lastTicket = localStorage.getItem('complaint_last_ticket') || ''
    const lastPin = localStorage.getItem('complaint_last_pin') || ''
    if (lastTicket) setTicket(lastTicket)
    if (lastPin) setPin(lastPin)
  }, [])

  useEffect(() => {
    return () => { if (filePreview) URL.revokeObjectURL(filePreview) }
  }, [filePreview])

  const onPickFile = (f?: File | null) => {
    if (filePreview) URL.revokeObjectURL(filePreview)
    if (!f) { setFile(null); setFilePreview(null); return }
    setFile(f)
    setFilePreview(URL.createObjectURL(f))
  }

  // ==================== KIRIM PENGADUAN ====================
  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (submitting) return
    setError(null)

    if (!name.trim()) return setError('Nama wajib diisi.')
    if (!message.trim()) return setError('Isi pengaduan belum diisi.')
    if (file && file.size > 4 * 1024 * 1024) return setError('Ukuran gambar maksimal 4MB.')

    try {
      setSubmitting(true)

      const fd = new FormData()
      fd.append('name', name.trim())
      if (contact.trim()) fd.append('contact', contact.trim())
      if (category.trim()) fd.append('category', category.trim())
      fd.append('message', message.trim())
      if (file) fd.append('image', file)

      const res = await fetch(`${API_BASE}/api/pengaduan`, {
        method: 'POST',
        body: fd,
        cache: 'no-store',
      })

      // baca body SEKALI via arrayBuffer (anti "body stream already read")
      const ct = (res.headers.get('content-type') || '').toLowerCase()
      const buf = await res.arrayBuffer()
      const raw = buf.byteLength ? new TextDecoder().decode(buf) : ''
      const parsed = ct.includes('application/json')
        ? (() => { try { return raw ? JSON.parse(raw) : null } catch { return null } })()
        : null

      if (!res.ok) {
        const msg = (parsed && (parsed.message || parsed.error)) || (raw?.trim() || `Gagal mengirim (HTTP ${res.status})`)
        throw new Error(msg)
      }

      // Ambil dari header kalau diset di BE; fallback ke body
      const tk = res.headers.get('x-ticket') || parsed?.ticket || ''
      const pn = res.headers.get('x-pin')    || parsed?.pin    || ''

      // simpan terakhir biar gampang cek lagi
      if (tk) localStorage.setItem('complaint_last_ticket', tk)
      if (pn) localStorage.setItem('complaint_last_pin', pn)

      const params = new URLSearchParams()
      if (tk) params.set('ticket', tk)
      if (pn) params.set('pin', pn)
      router.push(`/pengaduan/terkirim?${params.toString()}`)
    } catch (err: any) {
      setError(err?.message || 'Terjadi kesalahan saat mengirim.')
    } finally {
      setSubmitting(false)
    }
  }

  // ==================== CEK LAPORAN (TIKET + PIN) ====================
  const onCheck = async (e: React.FormEvent) => {
    e.preventDefault()
    if (checking) return
    setCheckError(null)

    const tk = ticket.trim()
    const pn = pin.trim()
    if (!tk) return setCheckError('Nomor tiket belum diisi.')
    if (!pn || pn.length < 4) return setCheckError('PIN kurang valid.')

    try {
      setChecking(true)
      // opsional: validasi cepat call GET (supaya kalau salah PIN, kasih pesan dulu)
      const url = new URL(`${API_BASE}/api/pengaduan/${encodeURIComponent(tk)}`)
      url.searchParams.set('pin', pn)
      const r = await fetch(url.toString(), { cache: 'no-store' })

      if (!r.ok) {
        // jangan baca body banyak², cukup error generik
        return setCheckError('Tiket atau PIN tidak cocok.')
      }
      // simpan terakhir
      localStorage.setItem('complaint_last_ticket', tk)
      localStorage.setItem('complaint_last_pin', pn)

      router.push(`/pengaduan/${encodeURIComponent(tk)}?pin=${encodeURIComponent(pn)}`)
    } finally {
      setChecking(false)
    }
  }

  return (
    <main className="mx-auto w-full max-w-[760px] px-4 pb-24 pt-8 text-slate-900 dark:text-slate-100">
      {/* Header */}
      <div className="mb-6 flex items-center gap-3 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 px-5 py-4 text-white shadow-sm">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">📣</div>
        <div>
          <h1 className="text-base font-extrabold leading-tight">Pengaduan Warga</h1>
          <p className="text-[12px] opacity-90">Sampaikan keluhan, saran, atau laporan Anda</p>
        </div>
      </div>

      {/* ===== Form Kirim Pengaduan ===== */}
      <form onSubmit={onSubmit} className="rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
        {error && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-sm font-medium">
              Nama <span className="text-red-500">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 dark:bg-slate-900"
              placeholder="Nama lengkap"
              required
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Kontak (Telepon/Email)</label>
            <input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 dark:bg-slate-900"
              placeholder="Opsional"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Kategori</label>
            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 dark:bg-slate-900"
              placeholder="Contoh: Infrastruktur, Pelayanan, Keamanan"
              list="kategori-preset"
            />
            <datalist id="kategori-preset">
              <option value="Infrastruktur" />
              <option value="Pelayanan" />
              <option value="Keamanan" />
              <option value="Kebersihan" />
            </datalist>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Lampiran Foto (opsional)</label>
            <div className="flex items-center gap-3">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={(e) => onPickFile(e.target.files?.[0] || null)}
                className="block w-full text-sm file:mr-3 file:rounded-lg file:border file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-medium file:shadow-sm hover:file:bg-slate-50 dark:file:bg-slate-900"
              />
              {file && (
                <button
                  type="button"
                  onClick={() => {
                    onPickFile(null)
                    if (fileInputRef.current) fileInputRef.current.value = ''
                  }}
                  className="rounded-lg border px-2 py-1 text-xs hover:bg-slate-50 dark:bg-slate-900"
                >
                  Hapus
                </button>
              )}
            </div>
            {filePreview && (
              <div className="mt-2 overflow-hidden rounded-xl ring-1 ring-black/5">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={filePreview} alt="Preview" className="max-h-48 w-full object-cover" />
              </div>
            )}
            <p className="mt-1 text-[11px] text-slate-500">Maks 4MB. Format gambar (JPG/PNG/WEBP).</p>
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">
              Isi Pengaduan <span className="text-red-500">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-rose-500/40 dark:bg-slate-900"
              placeholder="Tuliskan kronologi, lokasi, dan detail lainnya…"
              required
            />
          </div>
        </div>

        <div className="mt-5 flex items-center justify-between">
          <p className="text-[11px] text-slate-500">
            Dengan mengirim, Anda menyetujui data diproses untuk penanganan aduan.
          </p>
          <button
            disabled={submitting}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
          >
            {submitting ? 'Mengirim…' : 'Kirim Pengaduan'}
          </button>
        </div>
      </form>

      {/* ===== Garis pemisah ===== */}
      <div className="mx-auto my-8 h-px w-full max-w-[680px] bg-slate-200/80" />

      {/* ===== Cek Laporan (Tiket + PIN) ===== */}
      <section className="rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
        <div className="mb-3">
          <h2 className="text-base font-extrabold">Cek Laporan</h2>
          <p className="text-[12px] text-slate-500">Masukkan <strong>Nomor Tiket</strong> dan <strong>PIN</strong> dari bukti pengiriman.</p>
        </div>

        {checkError && (
          <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {checkError}
          </div>
        )}

        <form onSubmit={onCheck} className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium">Nomor Tiket</label>
            <input
              value={ticket}
              onChange={(e)=> setTicket(e.target.value.toUpperCase())}
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm uppercase tracking-wide focus:outline-none focus:ring-2 focus:ring-rose-500/30 dark:bg-slate-900"
              placeholder="CTH: AB12CD34"
              required
            />
          </div>
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium">PIN</label>
            <input
              value={pin}
              onChange={(e)=> setPin(e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              className="w-full rounded-xl border bg-white px-3 py-2 text-sm shadow-sm tracking-widest focus:outline-none focus:ring-2 focus:ring-rose-500/30 dark:bg-slate-900"
              placeholder="6 digit"
              required
            />
          </div>
          <div className="sm:col-span-1 flex items-end">
            <button
              className="w-full rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-rose-700 disabled:opacity-60"
              disabled={checking}
            >
              {checking ? 'Mengecek…' : 'Lihat Detail →'}
            </button>
          </div>
        </form>

        <p className="mt-2 text-[11px] text-slate-500">
          Tips: kolom akan otomatis terisi jika Anda baru saja mengirim aduan (kami menyimpannya sementara di perangkat ini).
        </p>
      </section>
    </main>
  )
}
