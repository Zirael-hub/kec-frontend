// components/ProfileAbout.tsx
'use client'

import React from 'react'

type Props = {
  description?: unknown
  vision?: unknown
  mission?: unknown
  structureNote?: unknown
}

/* Helpers aman */
const toStr = (v: unknown): string => {
  if (v == null) return ''
  if (typeof v === 'string') return v
  if (Array.isArray(v)) return v.map(toStr).join('\n')
  if (typeof v === 'object') {
    const anyv = v as any
    if (typeof anyv.text === 'string') return anyv.text
    if (typeof anyv.value === 'string') return anyv.value
    try { return String(v) } catch { return '' }
  }
  return String(v)
}
const isHtml = (s: unknown): boolean =>
  typeof s === 'string' && /<\/?[a-z][\s\S]*>/i.test(s)
const cleanLine = (s: string) =>
  s.replace(/^["“”']+|["“”']+$/g, '').replace(/^\s*[-–•]\s*/, '').replace(/^\s*\d+[.)]\s*/, '').trim()

function renderParagraphs(raw?: unknown) {
  const text = toStr(raw)
  if (!text) return <p>-</p>
  if (isHtml(text)) return <div dangerouslySetInnerHTML={{ __html: text }} />
  const parts = text.split(/\n{2,}|\r{2,}/).map(s => s.trim()).filter(Boolean)
  return parts.map((p, i) => <p key={i}>{p}</p>)
}
function renderVision(raw?: unknown) {
  const text = toStr(raw)
  if (!text) return <p>-</p>
  if (isHtml(text)) return <div dangerouslySetInnerHTML={{ __html: text }} />
  const joined = text.split(/\r?\n/).map(s => s.trim()).filter(Boolean).join(' ')
  const cleaned = cleanLine(joined)
  return (
    <blockquote className="not-italic">
      <p>{cleaned}</p>
    </blockquote>
  )
}
function renderMission(raw?: unknown) {
  const text = toStr(raw)
  if (!text) return <p>-</p>
  if (isHtml(text)) return <div dangerouslySetInnerHTML={{ __html: text }} />
  const lines = text.split(/\r?\n/).map(cleanLine).filter(Boolean)
  return (
    <ul className="list-disc pl-5">
      {lines.map((line, i) => <li key={i}>{line}</li>)}
    </ul>
  )
}

/* Komponen utama */
export default function ProfileAbout({ description, vision, mission, structureNote }: Props) {
  return (
    <section className="rounded-2xl border bg-white p-5 shadow-sm ring-1 ring-black/5 dark:bg-slate-900">
      <div
        className="
          prose prose-sm sm:prose-base lg:prose-lg
          max-w-none text-slate-800 dark:prose-invert
          prose-p:my-3 prose-p:leading-7 prose-p:indent-6
          prose-blockquote:my-4 prose-blockquote:border-l-4
          prose-blockquote:border-rose-300/60 prose-blockquote:pl-4
          prose-ul:my-3 prose-li:my-1
        "
        style={{ textAlign: 'justify' }}
      >
        <h2 className="!mt-0 font-extrabold tracking-tight">Deskripsi Singkat</h2>
        {renderParagraphs(description)}

        <h3 className="font-extrabold tracking-tight">Visi</h3>
        {renderVision(vision)}

        <h3 className="font-extrabold tracking-tight">Misi</h3>
        {renderMission(mission)}

        {toStr(structureNote) ? (
          <>
            <h3 className="font-extrabold tracking-tight">Keterangan</h3>
            {renderParagraphs(structureNote)}
          </>
        ) : null}
      </div>
    </section>
  )
}
