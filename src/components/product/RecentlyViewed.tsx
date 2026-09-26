"use client";

import { useMemo } from "react";
import { getProductsByIds, getRecommendations } from "@/lib/catalog";
import { useHydrated } from "@/lib/hooks";
import { useRecent } from "@/store";
import { SectionHeader } from "@/components/ui/primitives";
import { ProductRail } from "./ProductRail";

export function RecentlyViewed({ excludeId, className = "container-x py-16" }: { excludeId?: string; className?: string }) {
  const hydrated = useHydrated();
  const ids = useRecent((s) => s.ids);
  const items = useMemo(() => getProductsByIds(ids.filter((id) => id !== excludeId)).slice(0, 8), [ids, excludeId]);
  if (!hydrated || items.length === 0) return null;
  return (
    <section aria-labelledby="recent-title" className={className}>
      <div id="recent-title">
        <SectionHeader eyebrow="Your History" title="Recently Viewed" />
      </div>
      <ProductRail products={items} label="Recently viewed" />
    </section>
  );
}

export function RecommendedForYou({ excludeId, title = "Recommended for You", className = "container-x py-16" }: { excludeId?: string; title?: string; className?: string }) {
  const hydrated = useHydrated();
  const ids = useRecent((s) => s.ids);
  const items = useMemo(() => getRecommendations(hydrated ? ids.slice(0, 4) : [], excludeId ? [excludeId] : [], 8), [ids, excludeId, hydrated]);
  return (
    <section aria-label={title} className={className}>
      <SectionHeader eyebrow="Picked for You" title={title} text={hydrated && ids.length ? "Based on what you've been browsing." : "Popular with shoppers like you."} />
      <ProductRail products={items} label={title} />
    </section>
  );
}
