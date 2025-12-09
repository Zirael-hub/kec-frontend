'use client'
import { useEffect, useState } from 'react'

export default function InstallPWAButtonVerbose(){
  const [deferred, setDeferred] = useState<any>(null)
  const [log, setLog] = useState<string[]>([])
  const [installed, setInstalled] = useState(false)

  useEffect(() => {
    const onBeforeInstall = (e: Event) => {
      const ev = e as any
      ev.preventDefault()
      setDeferred(ev)
      setLog((l)=>[...l, 'beforeinstallprompt fired ✓'])
    }
    const onInstalled = () => { setInstalled(true); setLog((l)=>[...l, 'appinstalled fired ✓']) }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    setLog(l=>[...l, 'listeners attached'])
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const tryPrompt = async () => {
    try {
      if (!deferred) return
      const r = await deferred.prompt()
      setLog(l=>[...l, 'prompt() called; outcome=' + (r?.outcome || 'unknown')])
      setDeferred(null)
    } catch (e:any) {
      setLog(l=>[...l, 'prompt() error: ' + (e?.message || e)])
    }
  }

  return (
    <div className="space-y-2">
      <button
        onClick={tryPrompt}
        disabled={!deferred || installed}
        className="rounded-lg border px-3 py-2 disabled:opacity-50"
        title={deferred ? 'Ready to install' : 'Not eligible yet'}
      >
        {installed ? 'Terpasang' : deferred ? 'Install Aplikasi (manual)' : 'Install tidak tersedia'}
      </button>
      <pre className="text-xs bg-gray-100 p-2 rounded">{log.join('\n')}</pre>
    </div>
  )
}
