// components/QuickAccess.tsx
'use client'
import Link from 'next/link'

type Item = { href: string; label: string; emoji?: string; bg?: string }
const base = "rounded-2xl p-3 text-white shadow-sm"

export default function QuickAccess({ items }: { items: Item[] }) {
  return (
    <section className="space-y-2">
      <div className="text-sm font-semibold text-slate-700 dark:text-slate-200">Akses Cepat</div>
      <div className="grid grid-cols-4 gap-2">
        {items.map((it) => (
          <Link key={it.label} href={it.href as any}
            className={`${base} ${it.bg ?? 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
            <div className="flex h-16 flex-col items-center justify-center gap-1">
              <div className="text-xl">{it.emoji ?? '📌'}</div>
              <div className="text-[11px] leading-tight text-white/95 text-center">{it.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
