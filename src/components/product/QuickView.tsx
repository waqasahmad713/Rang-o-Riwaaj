"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Heart } from "lucide-react";
import { getProductById, productSubtitle } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/format";
import { useUI, useWishlist } from "@/store";
import { Modal } from "@/components/ui/Overlay";
import { Price, Stars } from "@/components/ui/primitives";
import { VariantPicker } from "./VariantPicker";
import { useProductActions } from "./useProductActions";

export function QuickView() {
  const id = useUI((s) => s.quickViewId);
  const set = useUI((s) => s.set);
  const product = id ? getProductById(id) : undefined;
  return (
    <Modal open={Boolean(product)} onClose={() => set({ quickViewId: null })} title={product ? `Quick view: ${product.name}` : "Quick view"} hideTitle className="sm:max-w-4xl">
      {product && <QuickViewBody key={product.id} product={product} />}
    </Modal>
  );
}

function QuickViewBody({ product: p }: { product: Product }) {
  const [color, setColor] = useState(p.colors[0]?.name ?? "");
  const [size, setSize] = useState<string | undefined>(p.sizes.length === 1 ? p.sizes[0] : undefined);
  const [qty, setQty] = useState(1);
  const [err, setErr] = useState(false);
  const wished = useWishlist((s) => s.ids.includes(p.id));
  const { addToCart, wishlist } = useProductActions();
  const set = useUI((s) => s.set);
  const imgIndex = p.colors.find((c) => c.name === color)?.imageIndex ?? 0;
  const image = p.images[imgIndex] ?? p.images[0];

  return (
    <div className="grid sm:grid-cols-2">
      <div className="relative aspect-[3/4] bg-sand sm:aspect-auto sm:min-h-[560px]">
        <Image src={image.src} alt={image.alt} fill sizes="(min-width:640px) 45vw, 100vw" className="object-cover" />
      </div>
      <div className="flex flex-col gap-5 p-6 sm:p-8">
        <div>
          <p className="text-[10px] font-medium tracking-[0.16em] text-muted uppercase">{productSubtitle(p)}</p>
          <h3 className="mt-2 font-serif text-3xl leading-tight font-medium">{p.name}</h3>
          <div className="mt-2 flex items-center gap-2">
            <Stars rating={p.rating} />
            <span className="text-xs text-muted">{p.reviewCount} reviews</span>
          </div>
        </div>
        <Price price={p.price} compareAt={p.compareAtPrice} size="lg" />
        <p className="text-sm leading-relaxed text-ink-soft">{p.shortDescription}</p>
        <VariantPicker
          product={p}
          color={color}
          size={size}
          qty={qty}
          onColor={setColor}
          onSize={(s) => {
            setSize(s);
            setErr(false);
          }}
          onQty={setQty}
          sizeError={err}
        />
        <div className="flex gap-2">
          <button
            className="btn-primary flex-1"
            onClick={() => {
              if (!size) return setErr(true);
              addToCart(p, { color, size, qty });
            }}
          >
            Add to Bag
          </button>
          <button onClick={() => wishlist(p)} className="btn-outline px-4" aria-label={wished ? "Remove from wishlist" : "Add to wishlist"} aria-pressed={wished}>
            <Heart className={cn("h-4 w-4", wished && "fill-maroon text-maroon")} />
          </button>
        </div>
        <Link href={`/product/${p.slug}`} onClick={() => set({ quickViewId: null })} className="text-xs font-semibold tracking-[0.16em] uppercase underline underline-offset-4 hover:text-maroon">
          View full details
        </Link>
      </div>
    </div>
  );
}
