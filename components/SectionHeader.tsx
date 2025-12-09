export default function SectionHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="flex items-baseline justify-between">
      <h2 className="text-lg font-bold tracking-tight">{title}</h2>
      {subtitle ? <p className="text-xs text-slate-500">{subtitle}</p> : null}
    </div>
  )
}
