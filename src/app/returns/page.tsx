import type { Metadata } from "next";
import { site } from "@/data/site";
import { PolicyPage } from "@/components/pages/PolicyPage";

export const metadata: Metadata = { title: "Returns & Exchange", description: `Easy ${site.exchangeDays}-day exchange on Rang-o-Riwaaj stitched and unstitched orders.` };

export default function Page() {
  return (
    <PolicyPage eyebrow="Customer Service" title="Returns & Exchange" text={`Size or colour not right? Exchange within ${site.exchangeDays} days of delivery.`}>
      <h2>What you can exchange</h2>
      <p>Unworn, unwashed items with tags attached, in original packaging. Unstitched fabric must be uncut.</p>
      <h2>What we cannot take back</h2>
      <ul>
        <li>Made-to-measure and altered bridal pieces</li>
        <li>Sale items — exchange only, no refund</li>
        <li>Earrings and worn khussa (hygiene)</li>
      </ul>
      <h2>How to start</h2>
      <p>WhatsApp us your order number and photos of the piece. We arrange pickup in most cities or a drop-off with the same courier.</p>
      <h2>Refunds</h2>
      <p>Where a refund applies, it is issued to the original payment method within 7–10 working days after we receive the item. COD orders are refunded by bank transfer or wallet.</p>
    </PolicyPage>
  );
}
