'use client'

import { useEffect, useMemo, useState } from 'react'
import AgendaHeader from '@/components/AgendaHeader'
import AgendaTimelineItem from '@/components/AgendaTimelineItem'
import AgendaCalendar, { type MiniEvent } from '@/components/AgendaCalendar'
import Link from 'next/link'

const API_BASE = (process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000').replace(/\/+$/, '')

export type EventItem = {
  id: string
  title: string
  date: string          // untuk display (boleh ISO penuh)
  time?: string | null  // "09:00 – Selesai" atau null
  location?: string | null
  banner?: string | null
  description?: string | null
  _dayKey: string       // YYYY-MM-DD (wajib, buat kalender & filter)
}

/* ================= Helpers ================= */

function absolutize(src?: string | null) {
  if (!src) return null
  if (/^https?:\/\//i.test(src)) return src
  return src.startsWith('/') ? `${API_BASE}${src}` : `${API_BASE}/${src}`
}

/** Ambil YYYY-MM-DD aman: regex dulu; kalau gagal, pakai UTC biar anti maju-sehari */
function toDayKey(input: string): string {
  if (!input) return ''
  const m = input.match(/^\d{4}-\d{2}-\d{2}/)
  if (m) return m[0]
  const d = new Date(input)
  if (isNaN(d.getTime())) return ''
  const y = d.getUTCFullYear()
  const mo = String(d.getUTCMonth() + 1).padStart(2, '0')
  const da = String(d.getUTCDate()).padStart(2, '0')
  return `${y}-${mo}-${da}`
}

function pad2(n: number) {
  return String(n).padStart(2, '0')
}

function monthNameId(year: number, month0: number) {
  // label bulan pakai locale id-ID
  return new Intl.DateTimeFormat('id-ID', { month: 'long' }).format(new Date(year, month0, 1))
}

function sameMonth(ymd: string, year: number, month0: number) {
  const m = ymd.match(/^(\d{4})-(\d{2})-\d{2}$/)
  if (!m) return false
  return Number(m[1]) === year && Number(m[2]) === month0 + 1
}

/** Pastikan tanggal yang dipilih dari kalender tetap di bulan yang sedang dilihat */
function normalizePickToViewMonth(ymdOrIso: string, viewYear: number, viewMonth0: number) {
  const m = ymdOrIso.match(/^\d{4}-\d{2}-\d{2}$/)
  let day = m ? parseInt(ymdOrIso.slice(8, 10), 10) : NaN
  if (isNaN(day)) {
    const d = new Date(ymdOrIso)
    day = isNaN(d.getTime()) ? 1 : d.getUTCDate()
  }
  return `${viewYear}-${pad2(viewMonth0 + 1)}-${pad2(day)}`
}

/* ================= Fetch ================= */

async function fetchAgenda(): Promise<EventItem[]> {
  try {
    // Ambil semua supaya bisa lihat bulan lalu juga
    const r = await fetch(`${API_BASE}/api/agenda?from=1900-01-01&limit=500`, { cache: 'no-store' })
    if (!r.ok) throw new Error(`HTTP ${r.status}`)
    let payload: any
    try {
      payload = await r.json()
    } catch {
      return []
    }

    const rows: any[] =
      Array.isArray(payload?.items) ? payload.items :
      Array.isArray(payload) ? payload :
      []

    const items: EventItem[] = rows
      .map((it: any, i: number) => {
        // PENTING: iso > date > datetime > tanggal
        const rawDate: string = String(it.iso ?? it.date ?? it.datetime ?? it.tanggal ?? '')
        const dayKey = toDayKey(rawDate)
        if (!dayKey) return null

        return {
          id: String(it.id ?? it.slug ?? `ev-${i}`),
          title: String(it.title ?? it.judul ?? '-'),
          date: rawDate, // simpan apa adanya buat display
          time: it.time ?? null, // "09:00 – Selesai" kalau ada
          location: it.location ?? it.place ?? null,
          banner: absolutize(it.banner ?? it.banner_url ?? it.image_url ?? it.cover),
          description: Array.isArray(it.description) ? it.description.join('\n') : (it.description ?? null),
          _dayKey: dayKey,
        }
      })
      .filter(Boolean) as EventItem[]

    // Urutkan per hari, lalu jam (string)
    items.sort((a, b) => {
      if (a._dayKey === b._dayKey) {
        return String(a.time || '').localeCompare(String(b.time || ''))
      }
      return a._dayKey.localeCompare(b._dayKey)
    })

    return items
  } catch {
    return []
  }
}

/* ================= Page ================= */

export default function Page() {
  // Bulan tampilan → default bulan sekarang
  const today = new Date()
  const [viewMonth, setViewMonth] = useState(today.getMonth())     // 0..11
  const [viewYear, setViewYear] = useState(today.getFullYear())   // 4-digit
  const [picked, setPicked] = useState<string | null>(null)       // YYYY-MM-DD

  const [items, setItems] = useState<EventItem[]>([])
  const [loading, setLoading] = useState(true)
  const [err, setErr] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      try {
        setLoading(true)
        setErr(null)
        const data = await fetchAgenda()
        setItems(data)
      } catch (e: any) {
        setErr(e?.message || 'Gagal memuat agenda')
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  // Titik event di kalender → hanya bulan yang sedang dilihat
  const miniEvents: MiniEvent[] = useMemo(
    () =>
      items
        .filter(i => sameMonth(i._dayKey, viewYear, viewMonth))
        .map(i => ({ date: i._dayKey })), // WAJIB _dayKey
    [items, viewMonth, viewYear]
  )

  // Daftar timeline:
  // - Jika picked → hari itu saja
  // - Jika tidak → semua event di bulan tampilan
  const s = useMemo(() => {
    if (picked) return items.filter(i => i._dayKey === picked)
    return items.filter(i => sameMonth(i._dayKey, viewYear, viewMonth))
  }, [items, picked, viewMonth, viewYear])

  // Navigasi bulan
  function prevMonth() {
    const m = viewMonth - 1
    if (m < 0) {
      setViewMonth(11)
      setViewYear(viewYear - 1)
    } else {
      setViewMonth(m)
    }
    setPicked(null)
  }

  function nextMonth() {
    const m = viewMonth + 1
    if (m > 11) {
      setViewMonth(0)
      setViewYear(viewYear + 1)
    } else {
      setViewMonth(m)
    }
    setPicked(null)
  }

  const titleMonth = `${monthNameId(viewYear, viewMonth)} ${viewYear}`
  const monthOptions = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: monthNameId(2025, i),
  }))
  const yearOptions = Array.from({ length: 11 }, (_, k) => (viewYear - 5) + k)

  return (
    <main className="mx-auto w-full max-w-[640px] space-y-5 px-4 pb-24 pt-4 text-slate-900 dark:text-slate-100">
      <AgendaHeader />

      {/* Nav Bulan */}
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={prevMonth}
            className="rounded-lg border px-2 py-1 text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            ←
          </button>

          <div className="flex items-center gap-2">
            <select
              value={viewMonth}
              onChange={e => {
                setViewMonth(Number(e.target.value))
                setPicked(null)
              }}
              className="rounded-lg border bg-white px-2 py-1 text-xs shadow-sm ring-1 ring-black/5 dark:bg-slate-900"
            >
              {monthOptions.map(m => (
                <option key={m.value} value={m.value}>
                  {m.label}
                </option>
              ))}
            </select>
            <select
              value={viewYear}
              onChange={e => {
                setViewYear(Number(e.target.value))
                setPicked(null)
              }}
              className="rounded-lg border bg-white px-2 py-1 text-xs shadow-sm ring-1 ring-black/5 dark:bg-slate-900"
            >
              {yearOptions.map(y => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={nextMonth}
            className="rounded-lg border px-2 py-1 text-xs hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            →
          </button>
        </div>

        <div className="text-sm font-semibold">{titleMonth}</div>
      </div>

      {/* Kalender */}
      <AgendaCalendar
        month={viewMonth}
        year={viewYear}
        events={miniEvents}
        onPick={val => {
          // pastikan simpan YYYY-MM-DD sesuai bulan tampilan (anti maju-hari)
          const ymd = normalizePickToViewMonth(val, viewYear, viewMonth)
          setPicked(ymd)
        }}
      />

      {/* Reset filter tanggal */}
      {picked && (
        <div className="text-right">
          <button onClick={() => setPicked(null)} className="text-xs text-emerald-700 underline">
            Tampilkan semua tanggal
          </button>
        </div>
      )}

      {/* Loading / Error */}
      {loading && (
        <div className="space-y-3">
          <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-200" />
          <div className="h-24 w-full animate-pulse rounded-2xl bg-slate-200" />
        </div>
      )}
      {err && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {err}
        </div>
      )}

      {/* Timeline */}
      {!loading && !err && (
        <section className="space-y-5">
          {!picked && s.length === 0 && (
            <div className="rounded-2xl border bg-white p-4 text-center text-sm text-slate-600 shadow-sm dark:bg-slate-900">
              Belum ada agenda pada {titleMonth}.
            </div>
          )}
          {picked && s.length === 0 && (
            <div className="rounded-2xl border bg-white p-4 text-center text-sm text-slate-600 shadow-sm dark:bg-slate-900">
              Tidak ada agenda untuk tanggal tersebut.
            </div>
          )}

          {s.map(ev => (
            <AgendaTimelineItem
              key={ev.id}
              item={{
                ...ev,
                time: ev.time ?? '',
                title: ev.title ?? '',
                // tidak mengirim field description karena tipe Item di AgendaTimelineItem tidak punya field ini
                location: ev.location ?? '',
              }}
            />
          ))}
        </section>
      )}

      {/* Footer kecil */}
      <div className="pt-2 text-center text-[11px] text-slate-500">
        <Link href="/" className="underline">
          Beranda
        </Link>
      </div>
    </main>
  )
}
