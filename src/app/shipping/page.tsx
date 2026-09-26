import type { Metadata } from "next";
import { site } from "@/data/site";
import { formatPrice } from "@/lib/format";
import { PolicyPage } from "@/components/pages/PolicyPage";

export const metadata: Metadata = { title: "Shipping Information", description: "Nationwide delivery times and fees for Rang-o-Riwaaj." };

export default function Page() {
  return (
    <PolicyPage eyebrow="Customer Service" title="Shipping Information" text="Dispatch within 24–48 hours. Tracking by SMS and email once the parcel leaves us.">
      <h2>Standard delivery</h2>
      <p>
        {site.shipping.standardDays[0]}–{site.shipping.standardDays[1]} working days across Pakistan. {formatPrice(site.shipping.standardFee)}, or free on orders above {formatPrice(site.shipping.freeThreshold)}.
      </p>
      <h2>Express delivery</h2>
      <p>
        {site.shipping.expressDays[0]}–{site.shipping.expressDays[1]} working days for {formatPrice(site.shipping.expressFee)}. Available at checkout.
      </p>
      <h2>Cash on delivery</h2>
      <p>COD is available nationwide. Please keep the exact amount ready for the courier.</p>
      <h2>Remote areas</h2>
      <p>A few destinations may take one extra working day. We&apos;ll message you if your city is affected.</p>
    </PolicyPage>
  );
}
