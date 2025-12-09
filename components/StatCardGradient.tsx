type Props = {
  title: string
  value: string | number
  icon?: React.ReactNode
  gradient?: string // tailwind gradient classes
}
export default function StatCardGradient({ title, value, icon, gradient }: Props) {
  return (
    <div className={`rounded-2xl p-4 text-white shadow-md ${gradient || 'bg-gradient-to-br from-emerald-500 to-teal-600'}`}>
      <div className="flex items-start justify-between">
        <div className="text-sm/5 opacity-90">{title}</div>
        {icon ? <div className="opacity-90">{icon}</div> : null}
      </div>
      <div className="mt-2 text-2xl font-extrabold">{value}</div>
    </div>
  )
}
