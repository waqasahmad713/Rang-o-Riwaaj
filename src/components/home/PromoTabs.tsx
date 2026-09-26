"use client";

import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/format";
import { ProductRail } from "@/components/product/ProductRail";

export function PromoTabs({ groups }: { groups: { id: string; label: string; tagline: string; href: string; products: Product[] }[] }) {
  const [active, setActive] = useState(groups[0].id);
  const g = groups.find((x) => x.id === active)!;
  return (
    <section aria-labelledby="promo-title" className="py-16 lg:py-24">
      <div className="container-x">
        <div className="mb-10 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="eyebrow mb-3">Shop the Moment</p>
            <h2 id="promo-title" className="section-title">
              {g.label}
            </h2>
            <p className="mt-3 text-sm text-muted sm:text-base">{g.tagline}</p>
          </div>
          <div role="tablist" aria-label="Product highlights" className="flex gap-6 border-b border-line">
            {groups.map((x) => (
              <button
                key={x.id}
                role="tab"
                aria-selected={active === x.id}
                onClick={() => setActive(x.id)}
                className={cn(
                  "-mb-px border-b-2 pb-3 text-xs font-semibold tracking-[0.16em] uppercase transition-colors",
                  active === x.id ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink",
                )}
              >
                {x.label}
              </button>
            ))}
          </div>
        </div>
        <div role="tabpanel" key={g.id} className="animate-fade-in">
          <ProductRail products={g.products} label={g.label} />
        </div>
        <div className="mt-10 text-center">
          <Link href={g.href} className="btn-outline">
            View all {g.label}
          </Link>
        </div>
      </div>
    </section>
  );
}
