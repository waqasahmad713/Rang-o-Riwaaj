"use client";

import { useSearchParams } from "next/navigation";
import { popularSearches, searchProducts } from "@/lib/catalog";
import { PageHero } from "@/components/pages/PageHero";
import { CollectionView } from "@/components/shop/CollectionView";

export function SearchResults() {
  const params = useSearchParams();
  const q = (params.get("q") ?? "").trim();
  const products = q ? searchProducts(q) : [];

  return (
    <>
      <PageHero
        eyebrow="Search"
        title={q ? `Results for “${q}”` : "Search the collection"}
        text={q ? `${products.length} style${products.length === 1 ? "" : "s"} matched your search.` : "Try lawn, kurta, embroidered, maroon or wedding."}
        crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
      />
      <div className="container-x py-10 lg:py-14">
        {!q && (
          <ul className="mb-10 flex flex-wrap gap-2">
            {popularSearches.map((s) => (
              <li key={s}>
                <a href={`/search?q=${encodeURIComponent(s)}`} className="border border-line bg-white px-3 py-1.5 text-xs font-medium hover:border-ink">
                  {s}
                </a>
              </li>
            ))}
          </ul>
        )}
        {q && products.length === 0 ? (
          <p className="text-sm text-muted">
            No pieces matched. Try a fabric, colour or category — or{" "}
            <a href="/shop" className="underline">
              browse everything
            </a>
            .
          </p>
        ) : (
          <CollectionView products={q ? products : []} initialSort="featured" />
        )}
      </div>
    </>
  );
}
