'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ComplaintForm() {
  const router = useRouter()
  const [sending, setSending] = useState(false)
  const [fileName, setFileName] = useState<string>('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const fd = new FormData(form)
    // TODO: ganti ke fetch(`${API}/pengaduan`, { method:'POST', body: fd })
    setSending(true)
    await new Promise(r=>setTimeout(r, 800)) // simulasi
    setSending(false)
    router.push('/pengaduan/sukses')
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
      <div className="grid gap-1">
        <label className="text-xs text-slate-600 dark:text-slate-300">Nama</label>
        <input name="name" required placeholder="Nama lengkap"
          className="rounded-xl border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="grid gap-1">
        <label className="text-xs text-slate-600 dark:text-slate-300">Kontak (HP/Email)</label>
        <input name="contact" required placeholder="08xxxx / email@contoh.go.id"
          className="rounded-xl border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400"
        />
      </div>

      <div className="grid gap-1">
        <label className="text-xs text-slate-600 dark:text-slate-300">Kategori (opsional)</label>
        <select name="category" className="rounded-xl border bg-transparent px-3 py-2 text-sm outline-none">
          <option value="">Pilih kategori</option>
          <option>Pelayanan</option>
          <option>Infrastruktur</option>
          <option>Keamanan</option>
          <option>Sosial</option>
          <option>Lainnya</option>
        </select>
      </div>

      <div className="grid gap-1">
        <label className="text-xs text-slate-600 dark:text-slate-300">Isi Pengaduan</label>
        <textarea name="message" required rows={4} placeholder="Tuliskan pengaduan secara singkat, jelas, dan sopan…"
          className="rounded-xl border bg-transparent px-3 py-2 text-sm outline-none placeholder:text-slate-400"
        ></textarea>
      </div>

      <div className="grid gap-1">
        <label className="text-xs text-slate-600 dark:text-slate-300">Lampiran Foto (opsional)</label>
        <label className="flex cursor-pointer items-center justify-between rounded-xl border bg-white px-3 py-2 text-sm shadow-sm hover:bg-gray-50 dark:bg-slate-900">
          <span className="truncate">{fileName || 'Pilih file gambar…'}</span>
          <span className="text-emerald-700">Upload</span>
          <input type="file" name="file" accept="image/*" className="hidden"
            onChange={(e)=> setFileName(e.target.files?.[0]?.name || '') } />
        </label>
      </div>

      <button
        type="submit"
        disabled={sending}
        className="mt-1 inline-flex items-center justify-center rounded-2xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] hover:bg-emerald-700 disabled:opacity-60"
      >
        {sending ? 'Mengirim…' : 'Kirim Pengaduan'}
      </button>

      <p className="text-center text-[11px] text-slate-500">
        Data Anda kami jaga sesuai kebijakan privasi.
      </p>
    </form>
  )
}
