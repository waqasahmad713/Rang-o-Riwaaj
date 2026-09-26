"use client";

import Link from "next/link";
import { ShieldCheck, ShoppingBag } from "lucide-react";
import { useUI } from "@/store";
import { Drawer } from "@/components/ui/Overlay";
import { PaymentIcons } from "@/components/brand/BrandIcons";
import { bundleDiscount } from "@/data/site";
import { CartLine } from "./CartLine";
import { FreeShippingBar, SummaryRows } from "./OrderSummary";
import { useCartLines } from "./useCartLines";

export function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const set = useUI((s) => s.set);
  const { lines, totals } = useCartLines();
  const close = () => set({ cartOpen: false });

  return (
    <Drawer open={open} onClose={close} title={`Your Bag (${totals.units})`}>
      {lines.length === 0 ? (
        <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
          <ShoppingBag className="h-12 w-12 text-gold" strokeWidth={1.2} />
          <p className="font-serif text-2xl">Your bag is empty</p>
          <p className="text-sm text-muted">Discover new arrivals and customer favourites.</p>
          <div className="mt-2 flex flex-col gap-2 sm:flex-row">
            <Link href="/new-arrivals" onClick={close} className="btn-primary">
              New Arrivals
            </Link>
            <Link href="/best-sellers" onClick={close} className="btn-outline">
              Best Sellers
            </Link>
          </div>
        </div>
      ) : (
        <>
          <FreeShippingBar remaining={totals.freeShippingRemaining} />
          {totals.units < bundleDiscount.minUnits && (
            <p className="border-b border-line px-5 py-2.5 text-xs text-ink-soft">
              Add one more item to save <strong className="text-maroon">{bundleDiscount.percent}%</strong> with our Buy 2 bundle.
            </p>
          )}
          <ul className="flex-1 divide-y divide-line overflow-y-auto px-5">
            {lines.map((l) => (
              <CartLine key={l.key} line={l} compact />
            ))}
          </ul>
          <div className="space-y-4 border-t border-line bg-white px-5 py-5">
            <SummaryRows totals={totals} />
            <p className="text-[11px] text-muted">Coupons and delivery options are applied at checkout.</p>
            <div className="grid grid-cols-2 gap-2">
              <Link href="/cart" onClick={close} className="btn-outline">
                View Bag
              </Link>
              <Link href="/checkout" onClick={close} className="btn-primary">
                Checkout
              </Link>
            </div>
            <p className="flex items-center justify-center gap-1.5 text-[11px] text-muted">
              <ShieldCheck className="h-3.5 w-3.5" /> Secure checkout · COD available
            </p>
            <PaymentIcons className="justify-center [&>li]:h-6 [&>li]:px-1.5 [&>li]:text-[9px]" />
          </div>
        </>
      )}
    </Drawer>
  );
}
