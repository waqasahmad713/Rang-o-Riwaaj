import type { Metadata } from "next";
import { CompareView } from "@/components/account/ListViews";

export const metadata: Metadata = {
  title: "Compare products",
  description: "Compare fabric, price, colour and size across Rang-o-Riwaaj pieces.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <CompareView />;
}
