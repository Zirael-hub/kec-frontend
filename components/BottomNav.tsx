'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Route } from 'next'

type Item = { href: Route; label: string; icon: (active: boolean) => JSX.Element }

function IconHome(a:boolean){ return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?'#065f46':'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 11l9-8 9 8" /><path d="M9 22V12h6v10" /></svg>) }
function IconNews(a:boolean){ return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?'#065f46':'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h10M7 16h7" /></svg>) }
function IconInfo(a:boolean){ return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?'#065f46':'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4M12 8h.01" /></svg>) }
function IconService(a:boolean){ return (<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={a?'#065f46':'currentColor'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l3 7h7l-5.5 4 2 7-6.5-4-6.5 4 2-7L2 9h7z" /></svg>) }
function IconMore(a:boolean){ return (<svg width="22" height="22" viewBox="0 0 24 24" fill={a?'#065f46':'currentColor'}><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>) }

export default function BottomNav(){
  const pathname = usePathname()
  const items: Item[] = [
    { href: '/' as Route,           label: 'Home',   icon: IconHome },
    { href: '/berita' as Route,     label: 'Berita', icon: IconNews },
    { href: '/pengumuman' as Route, label: 'Info',   icon: IconInfo },
    { href: '/layanan' as Route,    label: 'Layanan',icon: IconService },
  ]
  const isActive = (href: string) => pathname === href || (href !== '/' && pathname.startsWith(href))
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white shadow-md backdrop-blur supports-[padding:max(0px)]:pb-[max(env(safe-area-inset-bottom),0px)]">
      <ul className="mx-auto grid max-w-[420px] grid-cols-5 gap-1 px-2 py-2 text-[11px]">
        {items.map((it) => {
          const hrefStr = it.href as unknown as string
          const active = isActive(hrefStr)
          return (
            <li key={hrefStr} className="flex items-center justify-center">
              <Link href={it.href} className="flex flex-col items-center gap-1 rounded-lg px-2 py-1">
                {it.icon(active)}
                <span className={active ? 'font-medium text-emerald-700' : 'text-slate-600'}>{it.label}</span>
              </Link>
            </li>
          )
        })}
        <li className="flex items-center justify-center">
          <button onClick={() => document.getElementById('more-trigger')?.click()} className="flex flex-col items-center gap-1 rounded-lg px-2 py-1">
            {IconMore(false)}
            <span className="text-slate-600">Lainnya</span>
          </button>
        </li>
      </ul>
    </nav>
  )
}
