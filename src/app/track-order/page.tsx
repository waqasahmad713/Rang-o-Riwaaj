import type { Metadata } from "next";
import { Suspense } from "react";
import { TrackOrder } from "@/components/account/TrackOrder";

export const metadata: Metadata = {
  title: "Order Tracking",
  description: "Track a Rang-o-Riwaaj order with your order number.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return (
    <Suspense fallback={<div className="min-h-[40vh]" />}>
      <TrackOrder />
    </Suspense>
  );
}
