export type ComplaintStatus = 'Baru' | 'Proses' | 'Selesai'
export default function StatusBadge({ status }: { status: ComplaintStatus }) {
  const map = {
    'Baru':    'bg-sky-50 text-sky-700 ring-sky-200 dark:bg-sky-900/20 dark:text-sky-300 dark:ring-sky-800',
    'Proses':  'bg-amber-50 text-amber-700 ring-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:ring-amber-800',
    'Selesai': 'bg-emerald-50 text-emerald-700 ring-emerald-200 dark:bg-emerald-900/20 dark:text-emerald-300 dark:ring-emerald-800',
  } as const
  return (
    <span className={`rounded-full px-2 py-0.5 text-[10px] ring-1 ${map[status]}`}>{status}</span>
  )
}
