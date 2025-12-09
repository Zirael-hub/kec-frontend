// components/InstallPWAButton.tsx (ganti seluruhnya)
'use client'
import { useEffect, useState } from 'react'

export default function InstallPWAButton(){
  const [deferred, setDeferred] = useState<any>(null)
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const onBIP = (e: Event) => { (e as any).preventDefault(); setDeferred(e as any) }
    const onInstalled = () => setInstalled(true)
    window.addEventListener('beforeinstallprompt', onBIP)
    window.addEventListener('appinstalled', onInstalled)
    return () => { window.removeEventListener('beforeinstallprompt', onBIP); window.removeEventListener('appinstalled', onInstalled) }
  }, [])

  if (!deferred || installed) return null

  return (
    <button
      onClick={async () => { await deferred.prompt(); setDeferred(null) }}
      className="fixed right-4 bottom-20 z-50 rounded-full bg-emerald-600 px-4 py-2 text-white shadow-lg"
      // ↑ bottom-20 agar tidak ketutup BottomNav, plus z-50
    >
      Install Aplikasi
    </button>
  )
}
