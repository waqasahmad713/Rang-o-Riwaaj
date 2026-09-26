"use client";

import { useState } from "react";
import { Tag, X } from "lucide-react";
import type { Totals } from "@/lib/pricing";
import { validateCoupon } from "@/lib/pricing";
import { bundleDiscount, site } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { useCart } from "@/store";

export function FreeShippingBar({ remaining }: { remaining: number }) {
  const pct = Math.min(100, 100 - (remaining / site.shipping.freeThreshold) * 100);
  return (
    <div className="bg-sand px-4 py-3">
      <p className="text-xs text-ink-soft">
        {remaining > 0 ? (
          <>
            You&apos;re <strong className="text-ink">{formatPrice(remaining)}</strong> away from <strong className="text-ink">free delivery</strong>
          </>
        ) : (
          <strong className="text-success">You&apos;ve unlocked free standard delivery</strong>
        )}
      </p>
      <div className="mt-2 h-1 w-full bg-line" role="progressbar" aria-valuenow={Math.round(pct)} aria-valuemin={0} aria-valuemax={100} aria-label="Progress to free delivery">
        <div className="h-full bg-maroon transition-all duration-500" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

export function CouponForm({ subtotal }: { subtotal: number }) {
  const coupon = useCart((s) => s.coupon);
  const setCoupon = useCart((s) => s.setCoupon);
  const [code, setCode] = useState("");
  const [error, setError] = useState<string>();

  if (coupon)
    return (
      <div className="flex items-center justify-between border border-dashed border-success/50 bg-success/5 px-3 py-2.5 text-sm">
        <span className="flex items-center gap-2 font-medium text-success">
          <Tag className="h-4 w-4" /> {coupon.toUpperCase()} applied
        </span>
        <button onClick={() => setCoupon(undefined)} className="text-muted hover:text-danger" aria-label="Remove coupon">
          <X className="h-4 w-4" />
        </button>
      </div>
    );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!code.trim()) return;
        const v = validateCoupon(code, subtotal);
        if (v.error) return setError(v.error);
        setError(undefined);
        setCoupon(v.coupon!.code);
        setCode("");
      }}
    >
      <label htmlFor="coupon" className="label">
        Coupon or discount code
      </label>
      <div className="flex">
        <input id="coupon" value={code} onChange={(e) => setCode(e.target.value)} placeholder="e.g. WELCOME10" className="input uppercase" autoComplete="off" />
        <button className="btn-primary shrink-0 px-5">Apply</button>
      </div>
      {error && (
        <p className="mt-1.5 text-xs text-danger" role="alert">
          {error}
        </p>
      )}
    </form>
  );
}

export function SummaryRows({ totals, showShipping = true }: { totals: Totals; showShipping?: boolean }) {
  return (
    <dl className="space-y-2.5 text-sm">
      <div className="flex justify-between">
        <dt className="text-ink-soft">Subtotal ({totals.units} {totals.units === 1 ? "item" : "items"})</dt>
        <dd>{formatPrice(totals.subtotal)}</dd>
      </div>
      {totals.bundle > 0 && (
        <div className="flex justify-between text-success">
          <dt>Buy {bundleDiscount.minUnits}+ bundle ({bundleDiscount.percent}%)</dt>
          <dd>−{formatPrice(totals.bundle)}</dd>
        </div>
      )}
      {totals.couponDiscount > 0 && (
        <div className="flex justify-between text-success">
          <dt>Coupon {totals.coupon?.code}</dt>
          <dd>−{formatPrice(totals.couponDiscount)}</dd>
        </div>
      )}
      {showShipping && (
        <div className="flex justify-between">
          <dt className="text-ink-soft">Delivery</dt>
          <dd>{totals.shipping === 0 ? <span className="text-success">Free</span> : formatPrice(totals.shipping)}</dd>
        </div>
      )}
      <div className="flex justify-between border-t border-line pt-3 text-base font-semibold">
        <dt>Total</dt>
        <dd>{formatPrice(totals.total)}</dd>
      </div>
      {totals.couponError && <p className="text-xs text-danger">{totals.couponError}</p>}
    </dl>
  );
}
