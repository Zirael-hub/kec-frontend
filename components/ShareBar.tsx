"use client"

export default function ShareBar({ url, title }: { url: string; title: string }) {
  const wa = `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`
  const fb = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2">
      {/* Web Share API */}
      <button
        onClick={async () => {
          if (typeof navigator !== "undefined" && (navigator as any).share) {
            try {
              await (navigator as any).share({ title, url })
            } catch {}
          } else {
            window.open(wa, "_blank")
          }
        }}
        className="rounded-full bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-emerald-700"
      >
        Bagikan
      </button>

      <a
        href={wa}
        target="_blank"
        className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800"
      >
        WhatsApp
      </a>

      <a
        href={fb}
        target="_blank"
        className="rounded-full bg-sky-50 px-3 py-1.5 text-xs font-medium text-sky-700 ring-1 ring-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:ring-sky-800"
      >
        Facebook
      </a>

      <button
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url)
            alert("Tautan disalin")
          } catch {}
        }}
        className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 ring-1 ring-slate-200 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700"
      >
        Copy Link
      </button>
    </div>
  )
}
