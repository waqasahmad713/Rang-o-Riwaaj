"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem, Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { sizeStock } from "@/lib/catalog";
import { useCart, useUI } from "@/store";

export function CartLine({ line, compact = false }: { line: CartItem & { product: Product }; compact?: boolean }) {
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const setUI = useUI((s) => s.set);
  const p = line.product;
  const imgIndex = p.colors.find((c) => c.name === line.color)?.imageIndex ?? 0;
  const img = p.images[imgIndex] ?? p.images[0];
  const max = Math.min(10, sizeStock(p, line.size));

  return (
    <li className="flex gap-4 py-5">
      <Link href={`/product/${p.slug}`} onClick={() => setUI({ cartOpen: false })} className="relative aspect-[3/4] w-20 shrink-0 bg-sand sm:w-24">
        <Image src={img.src} alt={img.alt} fill sizes="96px" className="object-cover" />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link href={`/product/${p.slug}`} onClick={() => setUI({ cartOpen: false })} className="line-clamp-2 text-sm font-medium hover:underline">
              {p.name}
            </Link>
            <p className="mt-1 text-xs text-muted">
              {line.color}
              {line.size !== "One Size" && ` · ${line.size}`}
            </p>
          </div>
          <p className="shrink-0 text-sm font-semibold">{formatPrice(p.price * line.qty)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <div className="flex items-center border border-line bg-white" role="group" aria-label={`Quantity for ${p.name}`}>
            <button onClick={() => setQty(line.key, line.qty - 1)} disabled={line.qty <= 1} className="flex h-8 w-8 items-center justify-center disabled:opacity-40" aria-label="Decrease quantity">
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="w-7 text-center text-xs font-semibold">{line.qty}</span>
            <button onClick={() => setQty(line.key, line.qty + 1)} disabled={line.qty >= max} className="flex h-8 w-8 items-center justify-center disabled:opacity-40" aria-label="Increase quantity">
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <button onClick={() => remove(line.key)} className="flex items-center gap-1 text-xs text-muted hover:text-danger" aria-label={`Remove ${p.name}`}>
            <Trash2 className="h-3.5 w-3.5" />
            {!compact && <span>Remove</span>}
          </button>
        </div>
      </div>
    </li>
  );
}
