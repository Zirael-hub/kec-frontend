export type FileItem = {
  id: string
  title: string
  description?: string
  sizeBytes?: number
  ext: 'pdf'|'doc'|'docx'|'xls'|'xlsx'|'ppt'|'pptx'|'zip'|'img'|'other'
  category?: string
  url: string
}

function prettySize(n?: number){
  if(!n && n !== 0) return ''
  const units = ['B','KB','MB','GB']
  let i = 0, val = n
  while(val >= 1024 && i < units.length-1){ val /= 1024; i++ }
  return `${val.toFixed(val>=100 ? 0 : val>=10 ? 1 : 2)} ${units[i]}`
}

function extBadge(ext: FileItem['ext']){
  const map: Record<FileItem['ext'], string> = {
    pdf: 'bg-rose-50 text-rose-700 ring-rose-200 dark:bg-rose-900/20 dark:text-rose-300 dark:ring-rose-800',
    doc: 'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:ring-sky-800',
    docx:'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:ring-sky-800',
    xls: 'bg-green-50 text-green-700 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-800',
    xlsx:'bg-green-50 text-green-700 ring-green-200 dark:bg-green-900/20 dark:text-green-300 dark:ring-green-800',
    ppt: 'bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:ring-orange-800',
    pptx:'bg-orange-50 text-orange-700 ring-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:ring-orange-800',
    zip: 'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
    img: 'bg-fuchsia-50 text-fuchsia-700 ring-fuchsia-200 dark:bg-fuchsia-900/20 dark:text-fuchsia-300 dark:ring-fuchsia-800',
    other:'bg-slate-100 text-slate-700 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700',
  }
  return map[ext] ?? map.other
}

export default function DownloadCard({ item }: { item: FileItem }) {
  return (
    <div className="group flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md animate-fade-in-up dark:bg-slate-900">
      {/* icon */}
      <div className="mt-0.5 grid h-12 w-12 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-sm text-lg">
        {item.ext === 'pdf' ? '📕'
          : item.ext === 'doc' || item.ext === 'docx' ? '📘'
          : item.ext === 'xls' || item.ext === 'xlsx' ? '📗'
          : item.ext === 'ppt' || item.ext === 'pptx' ? '📙'
          : item.ext === 'zip' ? '🗜️'
          : item.ext === 'img' ? '🖼️'
          : '📄'}
      </div>

      {/* text */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="truncate text-sm font-semibold">{item.title}</h3>
          <span className={`rounded-full px-2 py-0.5 text-[10px] ring-1 ${extBadge(item.ext)}`}>{item.ext.toUpperCase()}</span>
          {item.category ? <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] text-slate-600 ring-1 ring-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:ring-slate-700">{item.category}</span> : null}
        </div>
        {item.description ? <p className="mt-0.5 line-clamp-2 text-xs text-slate-600 dark:text-slate-400">{item.description}</p> : null}
        <div className="mt-2 flex items-center justify-between">
          <span className="text-[11px] text-slate-500">{prettySize(item.sizeBytes)}</span>
          <a href={item.url} download
             className="rounded-xl bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white shadow-sm transition active:scale-[0.98] hover:bg-emerald-700">
            Download
          </a>
        </div>
      </div>
    </div>
  )
}
