"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import AnnouncementHeader from "@/components/AnnouncementHeader";
import AnnouncementSearchFilter from "@/components/AnnouncementSearchFilter";
import AnnouncementCard, { type AnnouncementItem } from "@/components/AnnouncementCard";
import Link from "next/link";

type ApiResult = { items: AnnouncementItem[]; nextPage?: number | null; categories: string[] };

// Dummy loader
// di file list page kamu, ubah loader:
const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://127.0.0.1:8000'

async function loadAnnouncements({ page, q, category }:{ page:number; q?:string; category?:string }) {
  const qs = new URLSearchParams()
  qs.set('page', String(page))
  if (q) qs.set('q', q)
  if (category) qs.set('category', category)
  const r = await fetch(`${API_BASE}/api/announcements?${qs.toString()}`, { cache: 'no-store' })
  if (!r.ok) throw new Error('Gagal memuat pengumuman')
  return await r.json() as { items:any[]; nextPage:number|null; categories:string[] }
}

export default function PengumumanPage() {
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<AnnouncementItem[]>([]);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { (async () => {
    setLoading(true);
    const res = await loadAnnouncements({ page: 1 });
    setItems(res.items);
    setNextPage(res.nextPage ?? null);
    setCategories(res.categories);
    setLoading(false);
  })(); }, []);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return items.filter(it => {
      const okCat = category ? it.category?.toLowerCase() === category.toLowerCase() : true;
      const okTerm = term ? (it.title + " " + it.excerpt).toLowerCase().includes(term) : true;
      return okCat && okTerm;
    });
  }, [items, q, category]);

  const loadMore = async () => {
    if (!nextPage) return;
    setLoading(true);
    const res = await loadAnnouncements({ page: nextPage });
    setItems(prev => [...prev, ...res.items]);
    setNextPage(res.nextPage ?? null);
    setLoading(false);
  };

  const ioRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!ioRef.current) return;
    const obs = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && nextPage && !loading) loadMore();
    }, { rootMargin: "120px" });
    obs.observe(ioRef.current);
    return () => obs.disconnect();
  }, [ioRef.current, nextPage, loading]); // eslint-disable-line

  return (
    <main className="mx-auto w-full max-w-[420px] space-y-5 px-4 pb-24 pt-4 text-slate-900 dark:text-slate-100">
      <AnnouncementHeader />

      <AnnouncementSearchFilter
        q={q} setQ={setQ}
        category={category} setCategory={setCategory}
        categories={categories}
      />

      <section className="space-y-3">
        {filtered.map(a => <AnnouncementCard key={a.slug} item={a} />)}
        {(!loading && filtered.length === 0) && (
          <div className="rounded-2xl border bg-white p-4 text-center text-sm text-slate-600 shadow-sm dark:bg-slate-900">
            Tidak ada pengumuman yang cocok.
          </div>
        )}
      </section>

      {nextPage ? (
        <>
          <div className="text-center">
            <button
              onClick={loadMore}
              className="rounded-xl border bg-white px-4 py-2 text-sm font-medium shadow-sm hover:bg-gray-50 dark:bg-slate-900"
            >
              {loading ? "Memuat…" : "Muat Lebih Banyak"}
            </button>
          </div>
          <div ref={ioRef} aria-hidden className="h-8"></div>
        </>
      ) : null}

      <div className="pt-2 text-center text-[11px] text-slate-500">
        <Link href="/" className="underline">Beranda</Link>
      </div>
    </main>
  );
}
