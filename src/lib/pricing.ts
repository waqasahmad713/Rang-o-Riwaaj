import { bundleDiscount, coupons, site, type Coupon } from "@/data/site";
import type { DeliveryMethod } from "./types";

export interface Totals {
  subtotal: number;
  units: number;
  bundle: number;
  couponDiscount: number;
  discount: number;
  shipping: number;
  total: number;
  coupon?: Coupon;
  couponError?: string;
  freeShippingRemaining: number;
}

export const findCoupon = (code?: string) =>
  code ? coupons.find((c) => c.code.toLowerCase() === code.trim().toLowerCase()) : undefined;

export const validateCoupon = (code: string, subtotal: number): { coupon?: Coupon; error?: string } => {
  const coupon = findCoupon(code);
  if (!coupon) return { error: "This code isn't valid." };
  if (coupon.minSubtotal && subtotal < coupon.minSubtotal)
    return { error: `Add Rs. ${(coupon.minSubtotal - subtotal).toLocaleString("en-PK")} more to use ${coupon.code}.` };
  return { coupon };
};

export const computeTotals = (
  lines: { price: number; qty: number }[],
  opts: { couponCode?: string; delivery?: DeliveryMethod } = {},
): Totals => {
  const subtotal = lines.reduce((s, l) => s + l.price * l.qty, 0);
  const units = lines.reduce((s, l) => s + l.qty, 0);
  const bundle = units >= bundleDiscount.minUnits ? Math.round((subtotal * bundleDiscount.percent) / 100) : 0;

  let couponDiscount = 0;
  let coupon: Coupon | undefined;
  let couponError: string | undefined;
  if (opts.couponCode) {
    const v = validateCoupon(opts.couponCode, subtotal);
    coupon = v.coupon;
    couponError = v.error;
    if (coupon?.type === "percent") couponDiscount = Math.round(((subtotal - bundle) * coupon.value) / 100);
    if (coupon?.type === "fixed") couponDiscount = coupon.value;
  }

  const discount = Math.min(subtotal, bundle + couponDiscount);
  const afterDiscount = subtotal - discount;
  const freeByThreshold = afterDiscount >= site.shipping.freeThreshold;
  const freeByCoupon = coupon?.type === "shipping";
  let shipping = 0;
  if (units > 0) {
    if (opts.delivery === "express") shipping = site.shipping.expressFee;
    else shipping = freeByThreshold || freeByCoupon ? 0 : site.shipping.standardFee;
  }

  return {
    subtotal,
    units,
    bundle,
    couponDiscount,
    discount,
    shipping,
    total: afterDiscount + shipping,
    coupon,
    couponError,
    freeShippingRemaining: Math.max(0, site.shipping.freeThreshold - afterDiscount),
  };
};
