'use client'
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RTooltip,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, LineChart, Line, Legend
} from 'recharts'

export function PieGender({ male, female }:{ male:number; female:number }) {
  const data = [
    { name: 'Laki-laki', value: male, color: '#10b981' },
    { name: 'Perempuan', value: female, color: '#6366f1' },
  ]
  return (
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={45} outerRadius={70}>
            {data.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Pie>
          <Legend />
          <RTooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}

export function BarAge({ items }:{ items: { label:string; value:number }[] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={items}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="label" />
          <YAxis />
          <RTooltip />
          <Bar dataKey="value" fill="#06b6d4" radius={[6,6,0,0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

export function LinePopulation({ points }:{ points:{ year:number; value:number }[] }) {
  return (
    <div className="h-56">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={points}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="year" />
          <YAxis />
          <RTooltip />
          <Line type="monotone" dataKey="value" stroke="#ef4444" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

export function DonutBudget({ value, total, label }:{ value:number; total:number; label?:string }) {
  // tampilkan sebagai pie dengan hole (donut)
  const used = Math.max(0, Math.min(total, value))
  const data = [
    { name:'Terealisasi', value: used, color:'#10b981' },
    { name:'Sisa', value: Math.max(0, total - used), color:'#e5e7eb' },
  ]
  return (
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={70}>
            {data.map((e, i) => <Cell key={i} fill={e.color} />)}
          </Pie>
          <RTooltip />
        </PieChart>
      </ResponsiveContainer>
      {label ? <div className="mt-1 text-center text-sm text-slate-600 dark:text-slate-300">{label}</div> : null}
    </div>
  )
}
