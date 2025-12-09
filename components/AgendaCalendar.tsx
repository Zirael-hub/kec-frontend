// components/AgendaCalendar.tsx
'use client'

import React, { useMemo } from 'react'

export type MiniEvent = { date: string } // date harus "YYYY-MM-DD"

type Props = {
  month: number        // 0..11
  year: number         // 4-digit
  events?: MiniEvent[] // daftar tanggal yg ada event (YYYY-MM-DD)
  onPick?: (ymd: string) => void
  /** Minggu mulai Senin? default: false (Minggu) */
  mondayFirst?: boolean
}

function pad2(n:number){ return String(n).padStart(2,'0') }
function ymd(y:number, m0:number, d:number){ return `${y}-${pad2(m0+1)}-${pad2(d)}` }

/** Ambil key harian "YYYY-MM-DD" dari string apapun */
function toDayKey(s: string){
  const m = s?.match?.(/^(\d{4})-(\d{2})-(\d{2})/)
  if (m) return m[0]
  // fallback kalau ada format lain → gunakan UTC agar tak geser
  const d = new Date(s)
  if (isNaN(d.getTime())) return ''
  return `${d.getUTCFullYear()}-${pad2(d.getUTCMonth()+1)}-${pad2(d.getUTCDate())}`
}

export default function AgendaCalendar({
  month,
  year,
  events = [],
  onPick,
  mondayFirst = false,
}: Props){
  // set untuk lookup cepat
  const eventSet = useMemo(()=>{
    const set = new Set<string>()
    for (const e of events) {
      const k = toDayKey(e?.date ?? '')
      if (k) set.add(k)
    }
    return set
  }, [events])

  // hari ini (untuk highlight)
  const today = new Date()
  const todayKey = ymd(today.getFullYear(), today.getMonth(), today.getDate())

  // jumlah hari di bulan
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  // index hari pertama (0=Min..6=Sabtu) atau Senin-first
  let firstWeekday = new Date(year, month, 1).getDay() // 0..6
  if (mondayFirst) {
    // konversi: Minggu(0) → 6; Sen(1) → 0; ... Sab(6) → 5
    firstWeekday = (firstWeekday + 6) % 7
  }

  // header nama hari
  const weekdayLabels = mondayFirst
    ? ['Sen','Sel','Rab','Kam','Jum','Sab','Min']
    : ['Min','Sen','Sel','Rab','Kam','Jum','Sab']

  // grid cell: kosong di depan + 1..days
  const leading = Array.from({length:firstWeekday})
  const days = Array.from({length:daysInMonth}, (_,i)=> i+1)

  return (
    <div className="rounded-2xl border bg-white p-3 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
      {/* header hari */}
      <div className="grid grid-cols-7 gap-1 text-center text-[11px] text-slate-500">
        {weekdayLabels.map((w,i)=>(
          <div key={i} className="py-1">{w}</div>
        ))}
      </div>

      {/* grid tanggal */}
      <div className="grid grid-cols-7 gap-1">
        {/* sel kosong sebelum tanggal 1 */}
        {leading.map((_,i)=>(
          <div key={`lead-${i}`} className="h-9 rounded-lg bg-transparent" />
        ))}

        {/* tanggal */}
        {days.map((d)=> {
          const key = ymd(year, month, d)
          const isToday = key === todayKey
          const hasEvent = eventSet.has(key)
          return (
            <button
              key={key}
              type="button"
              onClick={()=> onPick?.(key)} // <<< KIRIM YMD, BUKAN ISO-Z
              className={[
                'relative h-9 rounded-lg text-sm transition',
                'hover:bg-slate-100 dark:hover:bg-slate-800',
                isToday ? 'font-bold ring-1 ring-emerald-500/50' : '',
              ].join(' ')}
              aria-label={key}
            >
              {d}
              {hasEvent && (
                <span className="pointer-events-none absolute inset-x-0 bottom-0 mx-auto mb-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}
