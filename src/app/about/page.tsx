import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { site, u } from "@/data/site";
import { PageHero } from "@/components/pages/PageHero";

export const metadata: Metadata = {
  title: "About Us",
  description: site.shortAbout,
  alternates: { canonical: "/about" },
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Our Story"
        title="Colour, craft and riwaaj"
        text="Rang-o-Riwaaj is a Pakistani fashion house for women and men who want eastern wear that feels heirloom-worthy and easy to live in."
        crumbs={[{ label: "Home", href: "/" }, { label: "About" }]}
      />
      <div className="container-x grid gap-12 py-14 lg:grid-cols-2 lg:items-center lg:py-20">
        <div className="relative aspect-[4/5] bg-sand">
          <Image src={u("photo-1756483560049-e7b2208f99a0")} alt="Festive embroidered outfit from Rang-o-Riwaaj" fill sizes="50vw" className="object-cover" />
        </div>
        <div id="our-story" className="prose-rr max-w-xl">
          <h2>Who we dress</h2>
          <p>
            We design for the woman choosing a lawn 3-piece for Eid morning, the bride who wants zardozi that will be photographed for a lifetime, and the man who wants unstitched shalwar kameez fabric that stays crisp once tailored.
          </p>
          <p>
            Rang (colour) and riwaaj (tradition) sit in every collection — jewel tones, breathable lawn, khaddar for winter, and ready-to-wear cuts for days when you cannot wait on a tailor.
          </p>
          <h2 id="our-quality">Our quality</h2>
          <p>Every piece is checked by hand before dispatch. Embroidered work is finished by karigars; lawn and cotton are chosen for breathability and print clarity. We show the real price, including any markdown.</p>
          <p>
            WhatsApp us on {site.contact.phoneDisplay} if you need a size, fabric or styling recommendation — a real person replies.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/women" className="btn-primary">
              Shop Women
            </Link>
            <Link href="/men" className="btn-outline">
              Shop Men
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
