"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { ArrowRight, Search, TrendingUp, X } from "lucide-react";
import { popularSearches, productSubtitle, searchProducts, sortProducts, getAllProducts } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useDebounced, useEscape, useLockBody } from "@/lib/hooks";
import { useUI } from "@/store";

export function SearchOverlay() {
  const open = useUI((s) => s.searchOpen);
  const set = useUI((s) => s.set);
  const close = () => set({ searchOpen: false });
  useLockBody(open);
  useEscape(close, open);
  if (!open) return null;
  return <SearchPanel onClose={close} />;
}

function SearchPanel({ onClose }: { onClose: () => void }) {
  const [q, setQ] = useState("");
  const dq = useDebounced(q, 120);
  const router = useRouter();
  const results = useMemo(() => searchProducts(dq, 6), [dq]);
  const trending = useMemo(() => sortProducts(getAllProducts(), "popular").slice(0, 4), []);
  const list = dq.trim() ? results : trending;

  const go = (term: string) => {
    if (!term.trim()) return;
    onClose();
    router.push(`/search?q=${encodeURIComponent(term.trim())}`);
  };

  return (
    <div className="fixed inset-0 z-[75]" role="dialog" aria-modal="true" aria-label="Search products">
      <button aria-label="Close search" tabIndex={-1} className="animate-fade-in absolute inset-0 bg-ink/50" onClick={onClose} />
      <div className="animate-fade-up relative max-h-[100dvh] overflow-y-auto bg-ivory shadow-2xl">
        <div className="container-x py-5 sm:py-8">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              go(q);
            }}
            className="flex items-center gap-3 border-b-2 border-ink pb-3"
            role="search"
          >
            <Search className="h-5 w-5 shrink-0 text-muted" aria-hidden="true" />
            <label htmlFor="site-search" className="sr-only">
              Search
            </label>
            <input
              id="site-search"
              data-autofocus
              autoFocus
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search lawn, kurta, embroidered, maroon…"
              className="w-full bg-transparent font-serif text-2xl placeholder:text-muted/60 focus:outline-none sm:text-3xl"
              autoComplete="off"
              role="combobox"
              aria-expanded={list.length > 0}
              aria-controls="search-results"
              aria-autocomplete="list"
            />
            <button type="button" onClick={onClose} className="flex h-10 w-10 shrink-0 items-center justify-center hover:text-maroon" aria-label="Close search">
              <X className="h-5 w-5" />
            </button>
          </form>

          <div className="mt-6 grid gap-8 lg:grid-cols-[240px_1fr]">
            <div>
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold tracking-[0.16em] text-ink-soft uppercase">
                <TrendingUp className="h-3.5 w-3.5" /> Popular searches
              </p>
              <ul className="flex flex-wrap gap-2 lg:flex-col lg:items-start">
                {popularSearches.map((t) => (
                  <li key={t}>
                    <button onClick={() => go(t)} className="border border-line bg-white px-3 py-1.5 text-sm hover:border-ink lg:border-none lg:bg-transparent lg:p-0 lg:hover:text-maroon lg:hover:underline">
                      {t}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-ink-soft uppercase" aria-live="polite">
                {dq.trim() ? (results.length ? `Suggestions for “${dq}”` : `No matches for “${dq}”`) : "Trending now"}
              </p>
              <ul id="search-results" role="listbox" className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                {list.map((p) => (
                  <li key={p.id} role="option" aria-selected="false">
                    <Link href={`/product/${p.slug}`} onClick={onClose} className="group block">
                      <div className="relative aspect-[3/4] overflow-hidden bg-sand">
                        <Image src={p.images[0].src} alt={p.images[0].alt} fill sizes="200px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                      </div>
                      <p className="mt-2 text-[10px] tracking-[0.12em] text-muted uppercase">{productSubtitle(p).split(" · ")[0]}</p>
                      <p className="line-clamp-2 text-sm font-medium group-hover:underline">{p.name}</p>
                      <p className="text-sm font-semibold">{formatPrice(p.price)}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              {dq.trim() && results.length > 0 && (
                <button onClick={() => go(dq)} className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-[0.16em] uppercase hover:text-maroon">
                  See all results <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
