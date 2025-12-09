'use client'
import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const root = document.documentElement
    const onLoad = root.classList.contains('dark')
    setDark(onLoad)
  }, [])
  const toggle = () => {
    const root = document.documentElement
    root.classList.toggle('dark')
    setDark(root.classList.contains('dark'))
    try { localStorage.setItem('theme', root.classList.contains('dark') ? 'dark':'light') } catch {}
  }
  useEffect(()=>{
    try {
      const saved = localStorage.getItem('theme')
      if(saved === 'dark') document.documentElement.classList.add('dark')
    } catch {}
  },[])
  return (
    <button
      onClick={toggle}
      className="rounded-full border px-3 py-1 text-sm shadow-sm hover:bg-gray-50 dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      {dark ? '🌙 Dark' : '☀️ Light'}
    </button>
  )
}
