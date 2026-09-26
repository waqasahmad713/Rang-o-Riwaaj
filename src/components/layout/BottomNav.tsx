"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Heart, Home, LayoutGrid, ShoppingBag, User } from "lucide-react";
import { cn } from "@/lib/format";
import { useHydrated } from "@/lib/hooks";
import { useCart, useUI, useWishlist } from "@/store";

export function BottomNav() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const set = useUI((s) => s.set);
  const cartCount = useCart((s) => s.items.reduce((a, b) => a + b.qty, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  if (pathname.startsWith("/checkout") || pathname.startsWith("/product/")) return null;

  const item = "relative flex flex-1 flex-col items-center justify-center gap-1 text-[10px] font-medium tracking-wide";
  const badge = (n: number) =>
    hydrated && n > 0 ? <span className="absolute top-1 left-1/2 ml-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-maroon px-1 text-[9px] font-semibold text-ivory">{n}</span> : null;

  return (
    <nav aria-label="Quick navigation" className="fixed inset-x-0 bottom-0 z-50 border-t border-line bg-ivory/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md lg:hidden">
      <div className="flex h-16">
        <Link href="/" className={cn(item, pathname === "/" ? "text-maroon" : "text-ink-soft")}>
          <Home className="h-5 w-5" /> Home
        </Link>
        <button onClick={() => set({ menuOpen: true })} className={cn(item, "text-ink-soft")}>
          <LayoutGrid className="h-5 w-5" /> Shop
        </button>
        <Link href="/wishlist" className={cn(item, pathname === "/wishlist" ? "text-maroon" : "text-ink-soft")}>
          <Heart className="h-5 w-5" /> Wishlist
          {badge(wishCount)}
        </Link>
        <button onClick={() => set({ cartOpen: true })} className={cn(item, "text-ink-soft")}>
          <ShoppingBag className="h-5 w-5" /> Bag
          {badge(cartCount)}
        </button>
        <Link href="/account" className={cn(item, pathname.startsWith("/account") ? "text-maroon" : "text-ink-soft")}>
          <User className="h-5 w-5" /> Account
        </Link>
      </div>
    </nav>
  );
}
