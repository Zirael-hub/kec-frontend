// components/StatCard.tsx
import { I, type IconKey } from './icons'

export default function StatCard({
  title, value, icon, hint, children,
}: { title: string; value?: string | number; icon: IconKey; hint?: string; children?: React.ReactNode }) {
  return (
    <div className="rounded-xl border bg-white p-3 shadow-sm">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-xs text-slate-500">{title}</div>
          {value !== undefined ? <div className="text-lg font-semibold">{value}</div> : null}
          {hint ? <div className="mt-0.5 text-xs text-slate-500">{hint}</div> : null}
        </div>
        <I name={icon} className="h-6 w-6 text-slate-500" />
      </div>
      {children ? <div className="mt-2">{children}</div> : null}
    </div>
  )
}
