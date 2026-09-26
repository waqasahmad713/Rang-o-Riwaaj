"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { GitCompareArrows, Heart, PackageCheck, RefreshCcw, ShieldCheck, Truck } from "lucide-react";
import type { Product } from "@/lib/types";
import { discountPercent, isLowStock, productSubtitle, totalStock } from "@/lib/catalog";
import { cn, deliveryWindow, formatPrice } from "@/lib/format";
import { site, whatsappLink } from "@/data/site";
import { useHydrated } from "@/lib/hooks";
import { useCompare, useRecent, useWishlist } from "@/store";
import { Badge, Price, Stars, Swatch } from "@/components/ui/primitives";
import { BrandIcon } from "@/components/brand/BrandIcons";
import { VariantPicker } from "@/components/product/VariantPicker";
import { useProductActions } from "@/components/product/useProductActions";
import { Gallery } from "./Gallery";
import { ShareButtons } from "./ShareButtons";

export function ProductDetail({ product: p, url }: { product: Product; url: string }) {
  const router = useRouter();
  const hydrated = useHydrated();
  const push = useRecent((s) => s.push);
  const wished = useWishlist((s) => s.ids.includes(p.id)) && hydrated;
  const compared = useCompare((s) => s.ids.includes(p.id)) && hydrated;
  const { addToCart, wishlist, compare } = useProductActions();

  const [color, setColor] = useState(p.colors[0]?.name ?? "");
  const [size, setSize] = useState<string | undefined>(p.sizes.length === 1 ? p.sizes[0] : undefined);
  const [qty, setQty] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const [sizeErr, setSizeErr] = useState(false);
  const [showBar, setShowBar] = useState(false);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    push(p.id);
  }, [p.id, push]);

  useEffect(() => {
    const el = ctaRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setShowBar(!e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const soldOut = totalStock(p) === 0;
  const pct = discountPercent(p);

  const selectColor = (name: string) => {
    setColor(name);
    const idx = p.colors.find((c) => c.name === name)?.imageIndex;
    if (idx !== undefined) setImgIndex(idx);
  };

  const submit = (buyNow: boolean) => {
    if (!size) {
      setSizeErr(true);
      ctaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    const ok = addToCart(p, { color, size, qty, openCart: !buyNow });
    if (ok && buyNow) router.push("/checkout");
  };

  const isUnstitched = p.construction === "unstitched";
  const standard = deliveryWindow(site.shipping.standardDays);
  const express = deliveryWindow(site.shipping.expressDays);

  return (
    <>
      <div className="grid gap-8 lg:grid-cols-[1.15fr_1fr] lg:gap-14 xl:gap-20">
        <Gallery product={p} index={imgIndex} onIndex={setImgIndex} />

        <div className="lg:sticky lg:top-32 lg:self-start">
          <div className="flex flex-wrap gap-1.5">
            {p.badges.includes("new") && <Badge tone="ivory" className="border border-line">New</Badge>}
            {p.badges.includes("bestseller") && <Badge>Best Seller</Badge>}
            {p.badges.includes("limited") && <Badge tone="gold">Limited Edition</Badge>}
            {pct > 0 && <Badge tone="maroon">Save {pct}%</Badge>}
          </div>
          <p className="mt-4 text-[11px] font-medium tracking-[0.16em] text-muted uppercase">{productSubtitle(p)}</p>
          <h1 className="mt-2 font-serif text-3xl leading-tight font-medium sm:text-4xl lg:text-[2.6rem]">{p.name}</h1>
          <a href="#reviews" className="mt-3 inline-flex items-center gap-2 text-sm hover:underline">
            <Stars rating={p.rating} />
            <span className="text-muted">
              {p.rating.toFixed(1)} · {p.reviewCount} reviews
            </span>
          </a>
          <div className="mt-5">
            <Price price={p.price} compareAt={p.compareAtPrice} size="lg" />
            <p className="mt-1 text-xs text-muted">Inclusive of all taxes. {p.price >= site.shipping.freeThreshold ? "Free delivery." : `Free delivery over ${formatPrice(site.shipping.freeThreshold)}.`}</p>
          </div>
          <p className="mt-5 text-sm leading-relaxed text-ink-soft">{p.shortDescription}</p>

          {isUnstitched && (
            <dl className="mt-6 grid grid-cols-2 gap-px border border-line bg-line text-sm">
              {[
                ["Fabric", p.fabric],
                ["Pieces", `${p.pieces}-Piece`],
                ["Fabric length", p.fabricLength ?? "—"],
                ["Season", p.season],
              ].map(([k, v]) => (
                <div key={k} className="bg-white p-3">
                  <dt className="text-[10px] font-semibold tracking-[0.14em] text-muted uppercase">{k}</dt>
                  <dd className="mt-0.5 font-medium">{v}</dd>
                </div>
              ))}
            </dl>
          )}

          <div ref={ctaRef} className="mt-7">
            <VariantPicker
              product={p}
              color={color}
              size={size}
              qty={qty}
              onColor={selectColor}
              onSize={(s) => {
                setSize(s);
                setSizeErr(false);
              }}
              onQty={setQty}
              sizeError={sizeErr}
            />
          </div>

          {isLowStock(p) && !soldOut && (
            <p className="mt-5 flex items-center gap-2 bg-maroon/5 px-3 py-2 text-xs font-medium text-maroon">
              <span className="h-2 w-2 rounded-full bg-maroon" aria-hidden="true" /> Low stock — only {totalStock(p)} pieces left across all sizes.
            </p>
          )}

          <div className="mt-6 grid grid-cols-[1fr_auto_auto] gap-2">
            <button onClick={() => submit(false)} disabled={soldOut} className="btn-primary">
              {soldOut ? "Sold Out" : "Add to Bag"}
            </button>
            <button onClick={() => wishlist(p)} className="btn-outline px-4" aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={wished}>
              <Heart className={cn("h-4 w-4", wished && "fill-maroon text-maroon")} />
            </button>
            <button onClick={() => compare(p)} className={cn("btn-outline px-4", compared && "bg-ink text-ivory")} aria-label={compared ? "Remove from compare" : "Add to compare"} aria-pressed={compared}>
              <GitCompareArrows className="h-4 w-4" />
            </button>
          </div>
          <button onClick={() => submit(true)} disabled={soldOut} className="btn-accent mt-2 w-full">
            Buy Now
          </button>
          <a
            href={whatsappLink(`Hi! I'm interested in ${p.name} (${p.sku}) in ${color}${size ? `, size ${size}` : ""}. ${url}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 flex h-12 w-full items-center justify-center gap-2 border border-[#25D366] text-xs font-semibold tracking-[0.14em] text-[#128C7E] uppercase transition-colors hover:bg-[#25D366]/10"
          >
            <BrandIcon name="whatsapp" className="h-4 w-4" /> Order or ask on WhatsApp
          </a>

          <ul className="mt-7 grid gap-3 border-y border-line py-5 text-sm">
            <li className="flex gap-3">
              <Truck className="h-5 w-5 shrink-0 text-maroon" strokeWidth={1.5} aria-hidden="true" />
              <span>
                <strong className="font-semibold">Estimated delivery:</strong> <span suppressHydrationWarning>{standard}</span>
                <span className="block text-xs text-muted" suppressHydrationWarning>
                  Express: {express} (+{formatPrice(site.shipping.expressFee)})
                </span>
              </span>
            </li>
            <li className="flex gap-3">
              <RefreshCcw className="h-5 w-5 shrink-0 text-maroon" strokeWidth={1.5} aria-hidden="true" />
              <span>
                <strong className="font-semibold">Easy {site.exchangeDays}-day exchange</strong> on size and colour.{" "}
                <Link href="/returns" className="underline">
                  Details
                </Link>
              </span>
            </li>
            <li className="flex gap-3">
              <ShieldCheck className="h-5 w-5 shrink-0 text-maroon" strokeWidth={1.5} aria-hidden="true" />
              <span>Secure checkout · Cash on delivery available</span>
            </li>
          </ul>

          <div className="mt-5">
            <ShareButtons url={url} title={p.name} image={`${p.images[0].src}?w=1000&q=75`} />
          </div>
          <p className="mt-4 text-xs text-muted">SKU: {p.sku}</p>
        </div>
      </div>

      <section aria-labelledby="details-title" className="mt-16 grid gap-10 lg:mt-24 lg:grid-cols-[1fr_1.4fr] lg:gap-20">
        <div>
          <p className="eyebrow mb-3">The Details</p>
          <h2 id="details-title" className="section-title">
            Everything you need to know
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ink-soft">
            Questions about fit, fabric or delivery? Our team replies quickly on{" "}
            <a href={whatsappLink(`Question about ${p.name}`)} className="font-semibold underline" target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>
            .
          </p>
        </div>
        <div className="border-t border-line">
          <Detail title="Product Description" open>
            <p>{p.description}</p>
            {p.details.length > 0 && (
              <ul className="mt-3 list-disc space-y-1 pl-5">
                {p.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
            )}
          </Detail>
          <Detail title="Fabric & Material">
            <dl className="grid grid-cols-[140px_1fr] gap-y-2">
              <dt className="text-muted">Fabric</dt>
              <dd>{p.fabric}</dd>
              {p.pieces && (
                <>
                  <dt className="text-muted">Pieces</dt>
                  <dd>{p.pieces}-Piece</dd>
                </>
              )}
              {p.fabricLength && (
                <>
                  <dt className="text-muted">Fabric length</dt>
                  <dd>{p.fabricLength}</dd>
                </>
              )}
              <dt className="text-muted">Season</dt>
              <dd>{p.season}</dd>
              <dt className="text-muted">Work</dt>
              <dd>{p.details[0]}</dd>
            </dl>
          </Detail>
          <Detail title="Colour">
            <ul className="flex flex-wrap gap-4">
              {p.colors.map((c) => (
                <li key={c.name}>
                  <button onClick={() => selectColor(c.name)} className="flex items-center gap-2 hover:underline" aria-pressed={color === c.name}>
                    <Swatch hex={c.hex} name={c.name} size={22} selected={color === c.name} /> {c.name}
                  </button>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-muted">Colours may vary slightly due to screen settings and natural dye variations.</p>
          </Detail>
          <Detail title="Size & Fit">
            <p>{p.fit}</p>
            {p.sizes.length > 1 && <p className="mt-2">Available sizes: {p.sizes.join(", ")}.</p>}
            {p.construction === "stitched" && (
              <Link href="/size-guide" className="mt-2 inline-block font-semibold underline">
                View full size guide
              </Link>
            )}
          </Detail>
          <Detail title="What's Included">
            <ul className="grid gap-2 sm:grid-cols-2">
              {p.includes.map((i) => (
                <li key={i} className="flex items-center gap-2">
                  <PackageCheck className="h-4 w-4 text-success" aria-hidden="true" /> {i}
                </li>
              ))}
            </ul>
          </Detail>
          <Detail title="Care Instructions">
            <ul className="list-disc space-y-1 pl-5">
              {p.care.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
          </Detail>
          <Detail title="Delivery Information">
            <p suppressHydrationWarning>
              Standard delivery ({site.shipping.standardDays[0]}–{site.shipping.standardDays[1]} working days): {standard}. {formatPrice(site.shipping.standardFee)}, free on orders above{" "}
              {formatPrice(site.shipping.freeThreshold)}.
            </p>
            <p className="mt-2" suppressHydrationWarning>
              Express delivery ({site.shipping.expressDays[0]}–{site.shipping.expressDays[1]} working days): {express}. {formatPrice(site.shipping.expressFee)}.
            </p>
            <p className="mt-2">Orders are dispatched within 24–48 hours. You&apos;ll receive a tracking number by SMS and email.</p>
          </Detail>
          <Detail title="Return & Exchange">
            <p>
              Exchange for a different size or colour within {site.exchangeDays} days of delivery. Items must be unworn, unwashed and in original packaging with tags attached. Unstitched fabric
              must be uncut. Sale items are exchange-only. Made-to-measure and altered bridal pieces are final sale.
            </p>
            <Link href="/returns" className="mt-2 inline-block font-semibold underline">
              Read the full policy
            </Link>
          </Detail>
        </div>
      </section>

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ivory/95 p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-md transition-transform duration-300 lg:hidden",
          showBar ? "translate-y-0" : "translate-y-full",
        )}
        aria-hidden={!showBar}
      >
        <div className="flex items-center gap-3">
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{p.name}</p>
            <p className="text-xs text-muted">
              {formatPrice(p.price)} · {color}
              {size && size !== "Unstitched" && size !== "One Size" ? ` · ${size}` : ""}
            </p>
          </div>
          <button onClick={() => submit(false)} disabled={soldOut} tabIndex={showBar ? 0 : -1} className="btn-primary shrink-0 px-5">
            {size ? "Add to Bag" : "Select Size"}
          </button>
        </div>
      </div>
    </>
  );
}

function Detail({ title, children, open = false }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-line">
      <summary className="flex list-none items-center justify-between py-5 text-sm font-semibold tracking-[0.1em] uppercase [&::-webkit-details-marker]:hidden">
        {title}
        <span className="text-xl leading-none text-muted transition-transform duration-200 group-open:rotate-45" aria-hidden="true">
          +
        </span>
      </summary>
      <div className="pb-6 text-sm leading-relaxed text-ink-soft">{children}</div>
    </details>
  );
}
