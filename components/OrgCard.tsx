export type Official = { name:string; position:string; photo?:string; bio?:string }

export default function OrgCard({ person }: { person: Official }) {
  return (
    <div className="flex items-center gap-3 rounded-2xl bg-white p-3 shadow-sm ring-1 ring-black/5 transition hover:-translate-y-0.5 hover:shadow-md dark:bg-slate-900">
      <img
        src={person.photo || '/images/avatar-placeholder.png'}
        alt={person.name}
        className="h-14 w-14 rounded-xl object-cover ring-1 ring-black/5"
      />
      <div className="min-w-0">
        <div className="truncate text-sm font-semibold">{person.name}</div>
        <div className="text-xs text-slate-500">{person.position}</div>
        {person.bio ? <p className="line-clamp-2 text-xs text-slate-600 dark:text-slate-400 mt-1">{person.bio}</p> : null}
      </div>
    </div>
  )
}
