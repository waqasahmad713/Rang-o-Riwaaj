import type { Metadata } from "next";
import { WishlistView } from "@/components/account/ListViews";

export const metadata: Metadata = {
  title: "Wishlist",
  description: "Pieces you've saved at Rang-o-Riwaaj.",
  robots: { index: false, follow: true },
};

export default function Page() {
  return <WishlistView />;
}
