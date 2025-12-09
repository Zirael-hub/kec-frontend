// components/HomeHero.tsx
export default function HomeHero({
  logo, name, tagline, bgImage,
}: { logo: string; name: string; tagline: string; bgImage?: string }) {
  return (
    <section
      className={[
        "relative overflow-hidden rounded-2xl shadow-sm ring-1 ring-black/5",
        "bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500",
        "dark:from-emerald-700 dark:via-teal-700 dark:to-cyan-700"
      ].join(" ")}
      style={bgImage ? {
        backgroundImage: `linear-gradient(to bottom right, rgba(16,185,129,.85), rgba(14,165,233,.85)), url(${bgImage})`,
        backgroundSize: 'cover', backgroundPosition: 'center'
      } : {}}
    >
      <div className="flex items-center gap-3 px-4 py-5">
        <img src={logo} alt="Logo" className="h-12 w-12 rounded-xl bg-white/90 p-1 shadow" />
        <div className="text-white">
          <h1 className="text-lg font-bold leading-tight">{name}</h1>
          <p className="text-xs/5 opacity-90">{tagline}</p>
        </div>
      </div>
    </section>
  )
}
