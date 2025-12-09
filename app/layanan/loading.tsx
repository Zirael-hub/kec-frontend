export default function Loading(){
  return (
    <div className="space-y-3">
      {[...Array(3)].map((_,i)=>(
        <div key={i} className="h-20 animate-pulse rounded-xl bg-gray-200" />
      ))}
    </div>
  )
}
