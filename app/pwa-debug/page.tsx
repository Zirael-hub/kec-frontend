export const dynamic = 'force-dynamic'

export default function PWADebugPage(){
  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">PWA Debug</h1>
      <ol className="list-decimal pl-6 text-sm space-y-2">
        <li>Buka <a className="text-emerald-700 underline" href="/site.webmanifest" target="_blank" rel="noreferrer">/site.webmanifest</a> (mime harus <code>application/manifest+json</code>).</li>
        <li>Buka <a className="text-emerald-700 underline" href="/sw.js" target="_blank" rel="noreferrer">/sw.js</a> (harus ada, status di DevTools <i>activated</i>).</li>
        <li>Cek ikon: <a className="text-emerald-700 underline" href="/icons/icon-192.png" target="_blank" rel="noreferrer">192</a> & <a className="text-emerald-700 underline" href="/icons/icon-512.png" target="_blank" rel="noreferrer">512</a>.</li>
      </ol>
      <p className="text-xs text-slate-600">Jika tombol install tetap tidak tersedia, manifest/SW/ikon belum memenuhi syarat.</p>
    </div>
  )
}
