"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { PageHero } from "@/components/pages/PageHero";
import { PaymentIcons } from "@/components/brand/BrandIcons";
import { CartLine } from "./CartLine";
import { CouponForm, FreeShippingBar, SummaryRows } from "./OrderSummary";
import { useCartLines } from "./useCartLines";

export function CartPage() {
  const { lines, totals, hydrated } = useCartLines();

  if (!hydrated) return <div className="container-x min-h-[40vh] py-20" />;

  if (lines.length === 0) {
    return (
      <>
        <PageHero eyebrow="Bag" title="Your bag is empty" text="Discover new arrivals and the pieces our customers come back for." crumbs={[{ label: "Home", href: "/" }, { label: "Bag" }]} />
        <div className="container-x flex flex-col items-center py-20 text-center">
          <ShoppingBag className="h-12 w-12 text-gold" strokeWidth={1.2} />
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link href="/new-arrivals" className="btn-primary">
              New Arrivals
            </Link>
            <Link href="/women" className="btn-outline">
              Shop Women
            </Link>
            <Link href="/men" className="btn-outline">
              Shop Men
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Bag" title="Your shopping bag" text="Review your pieces, apply a coupon, then continue to a short checkout." crumbs={[{ label: "Home", href: "/" }, { label: "Bag" }]} />
      <div className="container-x grid gap-12 py-12 lg:grid-cols-[1.4fr_0.8fr] lg:py-16">
        <div>
          <FreeShippingBar remaining={totals.freeShippingRemaining} />
          <ul className="divide-y divide-line">
            {lines.map((l) => (
              <CartLine key={l.key} line={l} />
            ))}
          </ul>
        </div>
        <aside className="h-fit border border-line bg-white p-6 lg:sticky lg:top-28">
          <h2 className="font-serif text-2xl">Order summary</h2>
          <div className="mt-5">
            <CouponForm subtotal={totals.subtotal} />
          </div>
          <div className="mt-6">
            <SummaryRows totals={totals} showShipping={false} />
          </div>
          <p className="mt-2 text-xs text-muted">Delivery is calculated at checkout. Cash on delivery is available nationwide.</p>
          <Link href="/checkout" className="btn-primary mt-6 w-full">
            Continue to checkout
          </Link>
          <Link href="/shop" className="mt-3 block text-center text-xs font-semibold tracking-[0.14em] uppercase underline">
            Keep shopping
          </Link>
          <PaymentIcons className="mt-6 justify-center" />
        </aside>
      </div>
    </>
  );
}
