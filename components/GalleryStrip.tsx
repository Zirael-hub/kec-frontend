// components/GalleryStrip.tsx
export default function GalleryStrip({ images }:{ images:string[] }) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Galeri</h2>
      <div className="no-scrollbar -mx-4 overflow-x-auto px-4">
        <div className="flex gap-3">
          {images.map((src,i)=>(
            <img key={i} src={src} alt="" className="h-28 w-44 flex-none rounded-2xl object-cover shadow-sm ring-1 ring-black/5" />
          ))}
        </div>
      </div>
    </section>
  )
}
