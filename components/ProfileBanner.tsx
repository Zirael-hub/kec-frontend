export default function ProfileBanner({ src, alt }:{ src:string; alt?:string }) {
  return (
    <figure className="overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5">
      <img src={src} alt={alt ?? 'Kecamatan Cisompet'} className="h-40 w-full object-cover sm:h-56" />
    </figure>
  )
}
