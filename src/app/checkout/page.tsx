import type { Metadata } from "next";
import { CheckoutFlow } from "@/components/checkout/CheckoutFlow";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Secure checkout — guest or account, cash on delivery available.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <CheckoutFlow />;
}
