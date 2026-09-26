"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, GitCompareArrows, Heart, ShoppingBag } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent, inStock, isLowStock, productSubtitle, totalStock } from "@/lib/catalog";
import { cn } from "@/lib/format";
import { useHydrated } from "@/lib/hooks";
import { useCompare, useWishlist } from "@/store";
import { Price, Stars, Swatch } from "@/components/ui/primitives";
import { useProductActions } from "./useProductActions";

export function ProductCard({
  product: p,
  priority = false,
  tone = "light",
  className,
}: {
  product: Product;
  priority?: boolean;
  tone?: "light" | "dark";
  className?: string;
}) {
  const hydrated = useHydrated();
  const wished = useWishlist((s) => s.ids.includes(p.id)) && hydrated;
  const compared = useCompare((s) => s.ids.includes(p.id)) && hydrated;
  const { addToCart, wishlist, compare, quickView } = useProductActions();
  const pct = discountPercent(p);
  const soldOut = !inStock(p);
  const low = isLowStock(p);
  const second = p.images[1];
  const href = `/product/${p.slug}`;
  const dark = tone === "dark";

  return (
    <article className={cn("group relative flex flex-col", className)}>
      <div className={cn("relative aspect-[3/4] overflow-hidden", dark ? "bg-white/5" : "bg-sand")}>
        <Link href={href} aria-label={p.name} className="absolute inset-0">
          <Image
            src={p.images[0].src}
            alt={p.images[0].alt}
            fill
            priority={priority}
            sizes="(min-width:1280px) 22vw, (min-width:768px) 30vw, 48vw"
            className={cn("object-cover transition-all duration-700 ease-out group-hover:scale-[1.03]", second && "group-hover:opacity-0")}
          />
          {second && (
            <Image
              src={second.src}
              alt=""
              fill
              sizes="(min-width:1280px) 22vw, (min-width:768px) 30vw, 48vw"
              className="object-cover opacity-0 transition-opacity duration-700 ease-out group-hover:opacity-100"
            />
          )}
        </Link>

        <div className="pointer-events-none absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5">
          {soldOut && <span className="bg-ink px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-ivory uppercase">Sold out</span>}
          {!soldOut && pct > 0 && <span className="bg-maroon px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-ivory uppercase">−{pct}%</span>}
          {!soldOut && p.badges.includes("new") && <span className="bg-ivory px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-ink uppercase">New</span>}
          {!soldOut && p.badges.includes("limited") && <span className="bg-gold px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-white uppercase">Limited</span>}
        </div>

        <div className="absolute top-2 right-2 flex flex-col gap-1.5">
          <button
            onClick={() => wishlist(p)}
            aria-label={wished ? `Remove ${p.name} from wishlist` : `Add ${p.name} to wishlist`}
            aria-pressed={wished}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ivory/90 text-ink shadow-sm transition-colors hover:bg-ivory hover:text-maroon"
          >
            <Heart className={cn("h-4 w-4", wished && "fill-maroon text-maroon")} />
          </button>
          <button
            onClick={() => compare(p)}
            aria-label={compared ? `Remove ${p.name} from compare` : `Compare ${p.name}`}
            aria-pressed={compared}
            className={cn(
              "flex h-9 w-9 items-center justify-center rounded-full shadow-sm transition-all hover:text-maroon lg:opacity-0 lg:group-hover:opacity-100 lg:focus-visible:opacity-100",
              compared ? "bg-ink text-ivory lg:opacity-100" : "bg-ivory/90 text-ink",
            )}
          >
            <GitCompareArrows className="h-4 w-4" />
          </button>
        </div>

        {low && !soldOut && (
          <p className="pointer-events-none absolute bottom-[3.25rem] left-2.5 bg-ivory/95 px-2 py-1 text-[10px] font-semibold text-maroon lg:bottom-2.5 lg:group-hover:opacity-0">
            Only {totalStock(p)} left
          </p>
        )}

        <div className="absolute inset-x-2 bottom-2 flex gap-1.5 transition-all duration-300 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100 lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100">
          <button
            onClick={() => quickView(p)}
            className="hidden h-10 flex-1 items-center justify-center gap-1.5 bg-ivory/95 text-[11px] font-semibold tracking-[0.12em] text-ink uppercase transition-colors hover:bg-ivory sm:flex"
          >
            <Eye className="h-4 w-4" /> Quick View
          </button>
          <button
            onClick={() => addToCart(p)}
            disabled={soldOut}
            aria-label={`Add ${p.name} to bag`}
            className="flex h-10 flex-1 items-center justify-center gap-1.5 bg-ink text-[11px] font-semibold tracking-[0.12em] text-ivory uppercase transition-colors hover:bg-maroon disabled:bg-ink/60"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>{soldOut ? "Sold out" : p.sizes.length > 1 ? "Add" : "Add to Bag"}</span>
          </button>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-1.5 pt-3">
        <p className={cn("text-[10px] font-medium tracking-[0.16em] uppercase", dark ? "text-ivory/60" : "text-muted")}>{productSubtitle(p)}</p>
        <h3 className={cn("font-sans text-sm leading-snug font-medium", dark ? "text-ivory" : "text-ink")}>
          <Link href={href} className="hover:underline">
            {p.name}
          </Link>
        </h3>
        <div className="flex items-center gap-1.5">
          {p.colors.slice(0, 5).map((c) => (
            <Swatch key={c.name} hex={c.hex} name={c.name} size={12} />
          ))}
          {p.colors.length > 5 && <span className="text-[10px] text-muted">+{p.colors.length - 5}</span>}
          <span className="sr-only">Available colours: {p.colors.map((c) => c.name).join(", ")}</span>
        </div>
        <Price price={p.price} compareAt={p.compareAtPrice} className={dark ? "[&>span:first-child]:text-ivory" : ""} />
        <div className="flex items-center gap-1.5">
          <Stars rating={p.rating} size={12} />
          <span className={cn("text-[11px]", dark ? "text-ivory/60" : "text-muted")}>({p.reviewCount})</span>
        </div>
      </div>
    </article>
  );
}
