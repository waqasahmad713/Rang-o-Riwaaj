import type { Metadata } from "next";
import { PolicyPage } from "@/components/pages/PolicyPage";

export const metadata: Metadata = { title: "Terms & Conditions", description: "Terms of sale for Rang-o-Riwaaj." };

export default function Page() {
  return (
    <PolicyPage eyebrow="Legal" title="Terms & Conditions">
      <p>By placing an order you confirm you are buying authentic Rang-o-Riwaaj products for personal use, subject to our shipping and exchange policies.</p>
      <h2>Prices</h2>
      <p>Prices are in Pakistani rupees and include applicable taxes. We show the original price whenever an item is discounted.</p>
      <h2>Availability</h2>
      <p>Stock is limited. If an item sells out after you order, we will refund that line or offer an alternative.</p>
      <h2>Intellectual property</h2>
      <p>Photographs, embroidery designs and the Rang-o-Riwaaj name are ours. Please do not copy them for resale.</p>
    </PolicyPage>
  );
}
