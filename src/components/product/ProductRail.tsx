"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/format";
import { ProductCard } from "./ProductCard";

export function ProductRail({ products, tone = "light", label }: { products: Product[]; tone?: "light" | "dark"; label: string }) {
  const ref = useRef<HTMLUListElement>(null);
  const scroll = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" });
  };
  const btn = cn(
    "absolute top-[38%] z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full shadow-md transition-colors md:flex",
    tone === "dark" ? "bg-ivory text-ink hover:bg-gold-light" : "bg-ivory text-ink hover:bg-ink hover:text-ivory",
  );
  return (
    <div className="relative">
      <button onClick={() => scroll(-1)} className={cn(btn, "-left-4")} aria-label={`Scroll ${label} left`}>
        <ChevronLeft className="h-5 w-5" />
      </button>
      <ul
        ref={ref}
        aria-label={label}
        className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:gap-6 lg:px-0"
      >
        {products.map((p) => (
          <li key={p.id} className="w-[46%] shrink-0 snap-start sm:w-[31%] lg:w-[23%]">
            <ProductCard product={p} tone={tone} />
          </li>
        ))}
      </ul>
      <button onClick={() => scroll(1)} className={cn(btn, "-right-4")} aria-label={`Scroll ${label} right`}>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}

export function ProductGrid({ products, className }: { products: Product[]; className?: string }) {
  return (
    <ul className={cn("grid grid-cols-2 gap-x-4 gap-y-9 md:grid-cols-3 xl:grid-cols-4 lg:gap-x-6", className)}>
      {products.map((p, i) => (
        <li key={p.id}>
          <ProductCard product={p} priority={i < 4} />
        </li>
      ))}
    </ul>
  );
}
