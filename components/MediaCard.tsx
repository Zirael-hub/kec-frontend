'use client'
export type MediaItem = {
  id: string
  type: 'image' | 'video'
  src: string         // url besar (img/video)
  thumb?: string      // url thumbnail (opsional)
  title?: string
  date?: string       // ISO
  category?: string
}

export default function MediaCard({
  item, onOpen,
}: { item: MediaItem; onOpen: (id:string)=>void }) {
  const isVideo = item.type === 'video'
  const cover = item.thumb ?? item.src
  return (
    <button onClick={()=>onOpen(item.id)}
      className="group relative block overflow-hidden rounded-2xl bg-slate-100 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md active:scale-[0.99] animate-fade-in-up dark:bg-slate-800">
      {isVideo ? (
        <>
          <img src={cover} alt={item.title ?? ''} className="h-32 w-full object-cover sm:h-40" />
          <span className="absolute inset-0 grid place-items-center">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur group-hover:scale-105 transition">▶</span>
          </span>
        </>
      ) : (
        <img src={cover} alt={item.title ?? ''} className="h-32 w-full object-cover transition duration-200 group-hover:scale-[1.03] sm:h-40" />
      )}
      {item.title ? (
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/50 to-transparent p-2 text-left">
          <div className="line-clamp-1 text-xs font-medium text-white">{item.title}</div>
        </div>
      ) : null}
    </button>
  )
}
