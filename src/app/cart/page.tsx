import type { Metadata } from "next";
import { CartPage } from "@/components/cart/CartPage";

export const metadata: Metadata = {
  title: "Your Bag",
  description: "Review your Rang-o-Riwaaj bag, apply a coupon and continue to checkout.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CartPage />;
}
