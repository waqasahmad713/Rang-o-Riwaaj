"use client";

import { Minus, Plus, Ruler } from "lucide-react";
import type { Product } from "@/lib/types";
import { sizeStock, LOW_STOCK } from "@/lib/catalog";
import { cn } from "@/lib/format";
import { useUI } from "@/store";
import { Swatch } from "@/components/ui/primitives";

interface Props {
  product: Product;
  color: string;
  size?: string;
  qty: number;
  onColor: (name: string) => void;
  onSize: (s: string) => void;
  onQty: (q: number) => void;
  sizeError?: boolean;
}

export function VariantPicker({ product: p, color, size, qty, onColor, onSize, onQty, sizeError }: Props) {
  const openGuide = useUI((s) => s.set);
  const showSizes = !(p.sizes.length === 1 && ["Unstitched", "One Size"].includes(p.sizes[0]));
  const selectedStock = size ? sizeStock(p, size) : undefined;
  const maxQty = Math.min(10, selectedStock ?? 10);
  const guideFor = p.department === "men" ? "men" : "women";
  const hasGuide = p.construction === "stitched";

  return (
    <div className="space-y-6">
      <fieldset>
        <legend className="mb-3 text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">
          Colour: <span className="font-medium text-ink normal-case tracking-normal">{color}</span>
        </legend>
        <div className="flex flex-wrap gap-3">
          {p.colors.map((c) => (
            <label key={c.name} className="cursor-pointer">
              <input type="radio" name={`color-${p.id}`} value={c.name} checked={color === c.name} onChange={() => onColor(c.name)} className="peer sr-only" />
              <span className="flex h-10 w-10 items-center justify-center rounded-full ring-1 ring-transparent transition peer-checked:ring-ink peer-focus-visible:outline-2 peer-focus-visible:outline-maroon hover:ring-line">
                <Swatch hex={c.hex} name={c.name} size={30} />
              </span>
              <span className="sr-only">{c.name}</span>
            </label>
          ))}
        </div>
      </fieldset>

      {showSizes && (
        <fieldset>
          <div className="mb-3 flex items-center justify-between">
            <legend className={cn("text-xs font-semibold tracking-[0.14em] uppercase", sizeError ? "text-danger" : "text-ink-soft")}>
              Size{size ? <span className="font-medium text-ink normal-case tracking-normal">: {size}</span> : sizeError ? " — please select a size" : ""}
            </legend>
            {hasGuide && (
              <button type="button" onClick={() => openGuide({ sizeGuide: guideFor })} className="flex items-center gap-1.5 text-xs font-medium underline underline-offset-4 hover:text-maroon">
                <Ruler className="h-3.5 w-3.5" /> Size guide
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {p.sizes.map((s) => {
              const st = sizeStock(p, s);
              const out = st <= 0;
              return (
                <label key={s} className={cn(out ? "cursor-not-allowed" : "cursor-pointer")}>
                  <input type="radio" name={`size-${p.id}`} value={s} disabled={out} checked={size === s} onChange={() => onSize(s)} className="peer sr-only" />
                  <span
                    className={cn(
                      "relative flex h-11 min-w-12 items-center justify-center border px-3 text-sm font-medium transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-maroon",
                      out
                        ? "border-line text-muted/60 line-through"
                        : "border-line bg-white hover:border-ink peer-checked:border-ink peer-checked:bg-ink peer-checked:text-ivory",
                    )}
                  >
                    {s}
                  </span>
                  <span className="sr-only">{out ? " (out of stock)" : ""}</span>
                </label>
              );
            })}
          </div>
        </fieldset>
      )}

      <div className="flex flex-wrap items-center gap-4">
        <div className="flex items-center border border-line bg-white" role="group" aria-label="Quantity">
          <button type="button" onClick={() => onQty(Math.max(1, qty - 1))} disabled={qty <= 1} className="flex h-11 w-11 items-center justify-center hover:text-maroon disabled:opacity-40" aria-label="Decrease quantity">
            <Minus className="h-4 w-4" />
          </button>
          <output className="w-10 text-center text-sm font-semibold" aria-live="polite">
            {qty}
          </output>
          <button type="button" onClick={() => onQty(Math.min(maxQty, qty + 1))} disabled={qty >= maxQty} className="flex h-11 w-11 items-center justify-center hover:text-maroon disabled:opacity-40" aria-label="Increase quantity">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        {selectedStock !== undefined && (
          <p className={cn("text-xs font-medium", selectedStock <= LOW_STOCK ? "text-maroon" : "text-success")}>
            {selectedStock <= 0 ? "Out of stock" : selectedStock <= LOW_STOCK ? `Only ${selectedStock} left in stock` : "In stock — ready to ship"}
          </p>
        )}
      </div>
    </div>
  );
}
