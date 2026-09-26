"use client";

import { useMemo } from "react";
import { getProductById } from "@/lib/catalog";
import { computeTotals } from "@/lib/pricing";
import type { DeliveryMethod, Product } from "@/lib/types";
import { useHydrated } from "@/lib/hooks";
import { useCart } from "@/store";

export function useCartLines(delivery?: DeliveryMethod) {
  const hydrated = useHydrated();
  const items = useCart((s) => s.items);
  const coupon = useCart((s) => s.coupon);
  return useMemo(() => {
    const lines = (hydrated ? items : [])
      .map((i) => {
        const product = getProductById(i.productId);
        return product ? { ...i, product, price: product.price } : null;
      })
      .filter((l): l is NonNullable<typeof l> & { product: Product } => Boolean(l));
    const totals = computeTotals(lines, { couponCode: coupon, delivery });
    return { lines, totals, coupon, hydrated };
  }, [items, coupon, delivery, hydrated]);
}
