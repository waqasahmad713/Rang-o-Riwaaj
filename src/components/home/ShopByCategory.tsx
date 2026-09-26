"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { categoryCards } from "@/data/collections";
import { cn } from "@/lib/format";

const tabs = [
  { id: "women", label: "Women", href: "/women" },
  { id: "men", label: "Men", href: "/men" },
  { id: "stitched", label: "Stitched", href: "/stitched" },
  { id: "unstitched", label: "Unstitched", href: "/unstitched" },
] as const;

export function ShopByCategory() {
  const [tab, setTab] = useState<(typeof tabs)[number]["id"]>("women");
  const cards = categoryCards.filter((c) => c.group === tab);
  const current = tabs.find((t) => t.id === tab)!;

  return (
    <section aria-labelledby="cat-title" className="bg-sand py-16 lg:py-24">
      <div className="container-x">
        <div className="mb-10 flex flex-col items-center text-center">
          <p className="eyebrow mb-3">Shop by Category</p>
          <h2 id="cat-title" className="section-title">
            Find exactly what you&apos;re looking for
          </h2>
          <div role="tablist" aria-label="Category groups" className="mt-8 flex flex-wrap justify-center gap-2">
            {tabs.map((t) => (
              <button
                key={t.id}
                role="tab"
                aria-selected={tab === t.id}
                aria-controls="cat-panel"
                onClick={() => setTab(t.id)}
                className={cn(
                  "min-w-24 border px-5 py-2.5 text-xs font-semibold tracking-[0.16em] uppercase transition-colors",
                  tab === t.id ? "border-ink bg-ink text-ivory" : "border-ink/20 bg-transparent text-ink hover:border-ink",
                )}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <ul id="cat-panel" role="tabpanel" className={cn("grid grid-cols-2 gap-3 sm:gap-5", cards.length <= 3 ? "sm:grid-cols-3" : cards.length === 5 ? "sm:grid-cols-3 lg:grid-cols-5" : "sm:grid-cols-3 lg:grid-cols-4")}>
          {cards.map((c) => (
            <li key={c.slug}>
              <Link href={c.slug} className="group relative block aspect-[4/5] overflow-hidden bg-sand-deep">
                <Image src={c.image} alt={`${current.label} ${c.name}`} fill sizes="(min-width:1024px) 24vw, 48vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 bg-gradient-to-t from-ink/75 via-ink/5 to-transparent" />
                <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-2 p-4 sm:p-5">
                  <span>
                    <span className="block font-serif text-xl leading-tight text-ivory sm:text-2xl">{c.name}</span>
                    <span className="mt-0.5 block text-[11px] text-ivory/80">{c.blurb}</span>
                  </span>
                  <span className="hidden shrink-0 border-b border-ivory/70 pb-0.5 text-[10px] font-semibold tracking-[0.16em] text-ivory uppercase sm:block">Shop</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Link href={current.href} className="btn-outline">
            Shop all {current.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
