import type { Metadata } from "next";
import { PageHero } from "@/components/pages/PageHero";
import { SizeGuideContent } from "@/components/product/SizeGuide";

export const metadata: Metadata = {
  title: "Size Guide",
  description: "Women's ready-to-wear size chart and a men's tailoring reference for Rang-o-Riwaaj unstitched menswear.",
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Fit"
        title="Size guide"
        text="Measure a garment you already love, then compare it to the charts. Still unsure? WhatsApp your measurements."
        crumbs={[{ label: "Home", href: "/" }, { label: "Size Guide" }]}
      />
      <div className="container-x max-w-4xl py-12 lg:py-16">
        <SizeGuideContent which="both" />
      </div>
    </>
  );
}
