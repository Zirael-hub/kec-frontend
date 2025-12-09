// components/icons.tsx
// Kumpulan ikon ringan (SVG inline). Tambah sesuai kebutuhan.

type P = { className?: string; active?: boolean }

const S = (a?:boolean) => a ? '#065f46' : 'currentColor'

export function IconMap({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 18l-6 3V6l6-3 6 3 6-3v15l-6 3-6-3z"/><path d="M9 3v15"/><path d="M15 6v15"/></svg>)
}
export function IconPhone({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.08 4.18 2 2 0 0 1 4.06 2h3a2 2 0 0 1 2 1.72c.12.86.31 1.7.57 2.5a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.58-1.09a2 2 0 0 1 2.11-.45c.8.26 1.64.45 2.5.57A2 2 0 0 1 22 16.92z"/></svg>)
}
export function IconMail({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4h16v16H4z"/><path d="M22 6l-10 7L2 6"/></svg>)
}
export function IconGlobe({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 0 20"/><path d="M12 2a15.3 15.3 0 0 0 0 20"/></svg>)
}
export function IconSocial({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="7" r="3"/><circle cx="17" cy="7" r="3"/><circle cx="12" cy="17" r="3"/><path d="M7 10v2a5 5 0 0 0 10 0v-2"/></svg>)
}
export function IconFlag({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4v16"/><path d="M4 4h12l-2 4 2 4H4"/></svg>)
}
export function IconBuilding({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M7 7h2M7 11h2M7 15h2M11 7h2M11 11h2M11 15h2M15 7h2M15 11h2M15 15h2"/><path d="M3 19h18"/></svg>)
}
export function IconQuote({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h5V5H5zM14 12h5V5h-5z"/></svg>)
}
export function IconArea({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M9 3v18"/></svg>)
}
export function IconVillage({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-9 9 9"/><path d="M9 21V9h6v12"/></svg>)
}
export function IconCompass({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M16 8l-5 2-2 5 5-2 2-5z"/></svg>)
}
export function IconMountain({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 20l9-16 9 16z"/><path d="M9 18l3-5 3 5"/></svg>)
}
export function IconLeaf({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22C12 13 7 8 2 8c9 0 14 5 14 14"/><path d="M12 22c0-9 5-14 10-14-9 0-14 5-14 14"/></svg>)
}
export function IconWarning({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>)
}
export function IconUsers({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>)
}
export function IconGender({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="15" r="5"/><path d="M9 10V5M5 5h8"/><circle cx="19" cy="5" r="3"/><path d="M19 8v4M16 12h6"/></svg>)
}
export function IconHomePeople({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12l9-9 9 9"/><path d="M9 21V9h6v12"/><path d="M7 21h10"/></svg>)
}
export function IconDensity({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>)
}
export function IconAges({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="7" cy="12" r="3"/><circle cx="17" cy="9" r="4"/><path d="M3 22v-1a4 4 0 0 1 4-4h0"/><path d="M13 22v-1a4 4 0 0 1 4-4h0"/></svg>)
}
export function IconReligion({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l7 7-7 7-7-7 7-7z"/><path d="M12 9v11"/></svg>)
}
export function IconChat({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a4 4 0 0 1-4 4H7l-4 4V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z"/></svg>)
}
export function IconOrg({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 6v6M6 18h12M6 18v-6h12v6"/><circle cx="12" cy="3" r="2"/><circle cx="6" cy="21" r="2"/><circle cx="18" cy="21" r="2"/></svg>)
}
export function IconTarget({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>)
}
export function IconBriefcase({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>)
}
export function IconStore({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 7h16l-1 12H5L4 7z"/><path d="M3 7l3-4h12l3 4"/></svg>)
}
export function IconFactory({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="10" width="20" height="12"/><path d="M6 10V6l4 2V6l4 2v2"/></svg>)
}
export function IconSprout({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 20s5-4 5-10V6a5 5 0 0 0-5 5"/><path d="M12 10c0-5 5-5 5-5v4c0 6 5 10 5 10"/></svg>)
}
export function IconTheater({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 10s3-2 7-2 7 2 7 2v4s-3 2-7 2-7-2-7-2z"/><path d="M16 6h6v10h-6z"/></svg>)
}
export function IconCalendar({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>)
}
export function IconMonument({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l5 5v13H7V7z"/><path d="M7 7h10"/></svg>)
}
export function IconStarUser({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/><path d="M12 2l1.2 3.6L17 6l-3 2.2L15.2 12 12 9.8 8.8 12 9.9 8.2 7 6l3.8-.4z"/></svg>)
}
export function IconSchool({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12l8-6 8 6-8 6-8-6z"/><path d="M12 6v12"/></svg>)
}
export function IconHealth({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 21s-6-4.35-9-7.5A5.86 5.86 0 0 1 12 3a5.86 5.86 0 0 1 9 10.5C18 16.65 12 21 12 21z"/><path d="M12 8v6M9 11h6"/></svg>)
}
export function IconShield({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>)
}
export function IconBus({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="4" y="3" width="16" height="13" rx="2"/><path d="M6 16v2M18 16v2"/><circle cx="7.5" cy="19.5" r="1.5"/><circle cx="16.5" cy="19.5" r="1.5"/></svg>)
}
export function IconBolt({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z"/></svg>)
}
export function IconWifi({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12a10 10 0 0 1 14 0"/><path d="M8.5 15.5a6 6 0 0 1 7 0"/><path d="M12 19h.01"/></svg>)
}
export function IconMarket({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 7h18l-2 13H5L3 7z"/><path d="M3 7l3-4h12l3 4"/></svg>)
}
export function IconRiver({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 18c3 0 3-2 6-2s3 2 6 2 3-2 6-2"/><path d="M2 12c3 0 3-2 6-2s3 2 6 2 3-2 6-2"/></svg>)
}
export function IconTree({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2l7 10H5L12 2z"/><path d="M12 12v10"/></svg>)
}
export function IconShieldLeaf({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 14c2-4 6-4 6-4"/></svg>)
}
export function IconTrend({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="M7 14l4-4 3 3 4-5"/></svg>)
}
export function IconMedal({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="4"/><path d="M8.5 12.5L7 22l5-3 5 3-1.5-9.5"/></svg>)
}
export function IconCap({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10L12 4 2 10l10 6z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/></svg>)
}
export function IconHeart({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 22l7.8-8.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg>)
}
export function IconHammer({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2l6 6-3 3-6-6z"/><path d="M7 7l-5 5 10 10 5-5z"/></svg>)
}
export function IconBadge({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="5"/><path d="M7 14l5 7 5-7"/></svg>)
}
export function IconPin({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s7-4.5 7-10a7 7 0 0 0-14 0c0 5.5 7 10 7 10z"/><circle cx="12" cy="12" r="3"/></svg>)
}
export function IconUtensils({className,active}:P){
  return (<svg className={className} viewBox="0 0 24 24" width="24" height="24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 3v7a4 4 0 0 0 4 4v7M12 3v18M20 3v7a4 4 0 0 1-4 4v7"/></svg>)
}
export function IconInfo({className,active}:P){
  return (<svg className={className} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={S(active)} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>)
}

// peta nama -> komponen
export const iconSet = {
  map: IconMap, phone: IconPhone, mail: IconMail, globe: IconGlobe, social: IconSocial,
  flag: IconFlag, building: IconBuilding, quote: IconQuote, area: IconArea, village: IconVillage,
  compass: IconCompass, mountain: IconMountain, leaf: IconLeaf, warning: IconWarning,
  users: IconUsers, gender: IconGender, homepeople: IconHomePeople, density: IconDensity,
  ages: IconAges, religion: IconReligion, chat: IconChat, org: IconOrg, target: IconTarget,
  briefcase: IconBriefcase, store: IconStore, factory: IconFactory, sprout: IconSprout,
  theater: IconTheater, calendar: IconCalendar, monument: IconMonument, staruser: IconStarUser,
  school: IconSchool, health: IconHealth, shield: IconShield, bus: IconBus, bolt: IconBolt,
  wifi: IconWifi, market: IconMarket, river: IconRiver, tree: IconTree, shieldleaf: IconShieldLeaf,
  trend: IconTrend, medal: IconMedal, cap: IconCap, heart: IconHeart, hammer: IconHammer,
  badge: IconBadge, pin: IconPin, utensils: IconUtensils, info: IconInfo,
} as const

export type IconKey = keyof typeof iconSet
export function I({name,className,active}:{name:IconKey; className?:string; active?:boolean}){
  const C = iconSet[name]
  return <C className={className} active={active} />
}
