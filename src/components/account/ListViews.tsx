"use client";

import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import { Heart, GitCompareArrows } from "lucide-react";
import { getProductsByIds } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useHydrated } from "@/lib/hooks";
import { useCompare, useWishlist } from "@/store";
import { PageHero } from "@/components/pages/PageHero";
import { ProductGrid } from "@/components/product/ProductRail";
import { Price, Swatch } from "@/components/ui/primitives";

export function WishlistView() {
  const hydrated = useHydrated();
  const ids = useWishlist((s) => s.ids);
  const clear = useWishlist((s) => s.clear);
  const items = getProductsByIds(ids);

  if (!hydrated) return <div className="min-h-[40vh]" />;

  return (
    <>
      <PageHero
        eyebrow="Saved"
        title="Your wishlist"
        text={items.length ? `${items.length} piece${items.length === 1 ? "" : "s"} waiting for you.` : "Tap the heart on any product to save it here."}
        crumbs={[{ label: "Home", href: "/" }, { label: "Wishlist" }]}
      />
      <div className="container-x py-12 lg:py-16">
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <Heart className="h-12 w-12 text-gold" strokeWidth={1.2} />
            <div className="mt-6 flex gap-3">
              <Link href="/women" className="btn-primary">
                Shop Women
              </Link>
              <Link href="/new-arrivals" className="btn-outline">
                New Arrivals
              </Link>
            </div>
          </div>
        ) : (
          <>
            <div className="mb-8 flex justify-end">
              <button onClick={clear} className="text-xs text-muted underline hover:text-ink">
                Clear wishlist
              </button>
            </div>
            <ProductGrid products={items} />
          </>
        )}
      </div>
    </>
  );
}

export function CompareView() {
  const hydrated = useHydrated();
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const items = getProductsByIds(ids);

  if (!hydrated) return <div className="min-h-[40vh]" />;

  const rows: { label: string; cell: (i: (typeof items)[number]) => ReactNode }[] = [
    { label: "Price", cell: (p) => <Price price={p.price} compareAt={p.compareAtPrice} size="sm" /> },
    { label: "Fabric", cell: (p) => p.fabric },
    { label: "Type", cell: (p) => (p.construction === "unstitched" ? "Unstitched" : p.construction === "stitched" ? "Ready to Wear" : "Accessory") },
    { label: "Pieces", cell: (p) => (p.pieces ? `${p.pieces}-Piece` : "—") },
    { label: "Colours", cell: (p) => (
      <span className="flex flex-wrap gap-1.5">
        {p.colors.map((c) => (
          <Swatch key={c.name} hex={c.hex} name={c.name} />
        ))}
      </span>
    ) },
    { label: "Sizes", cell: (p) => p.sizes.join(", ") },
    { label: "Season", cell: (p) => p.season },
    { label: "Rating", cell: (p) => `${p.rating.toFixed(1)} (${p.reviewCount})` },
    { label: "SKU", cell: (p) => p.sku },
  ];

  return (
    <>
      <PageHero
        eyebrow="Compare"
        title="Side by side"
        text="Compare price, fabric, colour, size and product type — up to four pieces."
        crumbs={[{ label: "Home", href: "/" }, { label: "Compare" }]}
      />
      <div className="container-x py-12 lg:py-16">
        {items.length === 0 ? (
          <div className="flex flex-col items-center py-10 text-center">
            <GitCompareArrows className="h-12 w-12 text-gold" strokeWidth={1.2} />
            <p className="mt-4 text-sm text-muted">Add products with the compare icon on any card.</p>
            <Link href="/shop" className="btn-primary mt-6">
              Browse the shop
            </Link>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <button onClick={clear} className="text-xs text-muted underline hover:text-ink">
                Clear all
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] border-collapse text-sm">
                <thead>
                  <tr>
                    <th className="w-36 p-3 text-left text-xs font-semibold tracking-wider text-muted uppercase"> </th>
                    {items.map((p) => (
                      <th key={p.id} className="p-3 text-left align-top">
                        <Link href={`/product/${p.slug}`} className="relative mb-3 block aspect-[3/4] max-w-[180px] bg-sand">
                          <Image src={p.images[0].src} alt={p.name} fill sizes="180px" className="object-cover" />
                        </Link>
                        <Link href={`/product/${p.slug}`} className="font-serif text-lg font-medium hover:underline">
                          {p.name}
                        </Link>
                        <p className="mt-1 font-normal text-muted">{formatPrice(p.price)}</p>
                        <button onClick={() => remove(p.id)} className="mt-2 text-xs text-muted underline">
                          Remove
                        </button>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.label} className="border-t border-line">
                      <th className="p-3 text-left text-xs font-semibold tracking-wider text-muted uppercase">{r.label}</th>
                      {items.map((p) => (
                        <td key={p.id} className="p-3 align-top text-ink-soft">
                          {r.cell(p)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </>
  );
}
