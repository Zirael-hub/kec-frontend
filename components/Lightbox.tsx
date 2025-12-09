'use client'

import { useEffect, useMemo, useRef } from 'react'
import type { MediaItem } from './MediaCard'

type PlayerMeta = {
  type: 'image' | 'html5' | 'youtube' | 'vimeo' | 'iframe' | 'unknown'
  src?: string | null
  poster?: string | null
}

export default function Lightbox({
  items, index, onClose, onPrev, onNext,
}:{
  items: MediaItem[]; index: number
  onClose: ()=>void; onPrev: ()=>void; onNext: ()=>void
}) {
  const item = useMemo(()=> items?.[index] ?? null, [items, index])
  const startX = useRef<number|null>(null)
  const shellRef = useRef<HTMLDivElement|null>(null)

  // lock body scroll while open
  useEffect(()=>{
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return ()=> { document.body.style.overflow = prev }
  },[])

  // ESC / arrows
  useEffect(()=>{
    function onKey(e: KeyboardEvent){
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft') onPrev()
      if (e.key === 'ArrowRight') onNext()
    }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[onClose,onPrev,onNext])

  // swipe
  function onTouchStart(e: React.TouchEvent){ startX.current = e.touches[0].clientX }
  function onTouchEnd(e: React.TouchEvent){
    if(startX.current==null) return
    const dx = e.changedTouches[0].clientX - startX.current
    if(Math.abs(dx) > 40) { dx>0 ? onPrev() : onNext() }
    startX.current = null
  }

  // close if click backdrop (but ignore clicks on media)
  function onBackdropClick(e: React.MouseEvent) {
    if (e.target === shellRef.current) onClose()
  }

  if (!item) return null

  // ---- choose how to render media ----
  const player: PlayerMeta | undefined = item.player
  const kind = player?.type ?? (item.type === 'video' ? 'html5' : 'image')
  const src   = (player?.src ?? item.src) || ''
  const poster= (player?.poster ?? item.thumb) || undefined

  const isIframe = kind === 'youtube' || kind === 'vimeo' || kind === 'iframe'
  const isHtml5  = kind === 'html5'
  const isImage  = kind === 'image' || item.type === 'image'

  return (
    <div
      ref={shellRef}
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm"
      onClick={onBackdropClick}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      role="dialog"
      aria-modal="true"
    >
      {/* close */}
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute right-3 top-3 rounded-full bg-white/10 p-2 text-white ring-1 ring-white/20 hover:bg-white/20"
      >
        ✕
      </button>

      {/* nav */}
      <button
        onClick={onPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white ring-1 ring-white/20 hover:bg-white/20"
        aria-label="Previous"
      >
        ←
      </button>
      <button
        onClick={onNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white ring-1 ring-white/20 hover:bg-white/20"
        aria-label="Next"
      >
        →
      </button>

      <div className="mx-auto flex h-full max-w-[960px] items-center justify-center px-4">
        <figure className="w-full text-center">
          {/* MEDIA */}
          {isImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={src}
              alt={item.title ?? ''}
              className="mx-auto max-h-[80vh] w-auto max-w-full rounded-xl object-contain shadow-2xl"
            />
          )}

          {isHtml5 && (
            <video
              src={src}
              poster={poster}
              controls
              playsInline
              preload="metadata"
              className="mx-auto max-h-[80vh] w-auto max-w-full rounded-xl shadow-2xl"
            />
          )}

          {isIframe && (
            <div className="mx-auto aspect-video w-full max-w-3xl overflow-hidden rounded-xl shadow-2xl">
              <iframe
                src={src}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={item.title ?? 'video'}
              />
            </div>
          )}

          {!isImage && !isHtml5 && !isIframe && (
            <div className="mx-auto max-w-md rounded-xl bg-white/10 p-4 text-sm text-white/80">
              Media tidak didukung.
            </div>
          )}

          {(item.title || item.date) && (
            <figcaption className="mt-3 text-center text-sm text-white/80">
              {item.title ?? ''}
              {item.date ? ` • ${new Date(item.date).toLocaleDateString('id-ID')}` : ''}
            </figcaption>
          )}
        </figure>
      </div>
    </div>
  )
}
