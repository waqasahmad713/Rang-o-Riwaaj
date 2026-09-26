"use client";

import { useCallback } from "react";
import { COMPARE_MAX, useCart, useCompare, useUI, useWishlist } from "@/store";
import type { Product } from "@/lib/types";
import { sizeStock } from "@/lib/catalog";

export function useProductActions() {
  const add = useCart((s) => s.add);
  const toggleWish = useWishlist((s) => s.toggle);
  const toggleCompare = useCompare((s) => s.toggle);
  const setUI = useUI((s) => s.set);
  const toast = useUI((s) => s.toast);

  const addToCart = useCallback(
    (p: Product, opts: { color?: string; size?: string; qty?: number; openCart?: boolean } = {}) => {
      const size = opts.size ?? (p.sizes.length === 1 ? p.sizes[0] : undefined);
      if (!size) {
        setUI({ quickViewId: p.id });
        return false;
      }
      if (sizeStock(p, size) <= 0) {
        toast("Sorry, that size is out of stock.");
        return false;
      }
      add({ productId: p.id, color: opts.color ?? p.colors[0]?.name ?? "Default", size, qty: opts.qty ?? 1 });
      if (opts.openCart !== false) setUI({ cartOpen: true, quickViewId: null });
      else toast(`${p.name} added to your bag`, { label: "View bag", href: "/cart" });
      return true;
    },
    [add, setUI, toast],
  );

  const wishlist = useCallback(
    (p: Product) => {
      const added = toggleWish(p.id);
      toast(added ? "Saved to your wishlist" : "Removed from wishlist", added ? { label: "View", href: "/wishlist" } : undefined);
    },
    [toggleWish, toast],
  );

  const compare = useCallback(
    (p: Product) => {
      const ids = useCompare.getState().ids;
      const wasIn = ids.includes(p.id);
      if (!wasIn && ids.length >= COMPARE_MAX) {
        toast(`You can compare up to ${COMPARE_MAX} products.`, { label: "Compare", href: "/compare" });
        return;
      }
      toggleCompare(p.id);
      toast(wasIn ? "Removed from compare" : "Added to compare", wasIn ? undefined : { label: "Compare now", href: "/compare" });
    },
    [toggleCompare, toast],
  );

  const quickView = useCallback((p: Product) => setUI({ quickViewId: p.id }), [setUI]);

  return { addToCart, wishlist, compare, quickView };
}
