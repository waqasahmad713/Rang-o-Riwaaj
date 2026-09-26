import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { instagramGrid, u } from "@/data/site";
import { PageHero } from "@/components/pages/PageHero";
import { BrandIcon } from "@/components/brand/BrandIcons";

export const metadata: Metadata = {
  title: "Style Stories",
  description: "Campaign-ready looks for Instagram, TikTok and Pinterest — new arrivals, styling and behind the scenes.",
};

const boards = [
  {
    channel: "Instagram Reels",
    items: ["New arrivals unbox", "Outfit styling in 15 seconds", "Embroidery close-ups", "Behind the atelier"],
    href: "/new-arrivals",
    image: u("photo-1773439878514-65d4aeb43046"),
  },
  {
    channel: "Stories",
    items: ["Weekend sale cards", "New collection announcements", "Colour polls", "Customer reviews"],
    href: "/sale",
    image: u("photo-1759840278381-bf7d5e332050"),
  },
  {
    channel: "TikTok",
    items: ["3 ways to wear a 3-piece", "Fashion transitions", "Eid morning look", "Groom's sherwani reveal"],
    href: "/eid-collection",
    image: u("photo-1760080838961-4208536db385"),
  },
  {
    channel: "Pinterest",
    items: ["Wedding look boards", "Seasonal colour combinations", "Lawn vs khaddar", "Guest vs bridal"],
    href: "/wedding-collection",
    image: u("photo-1747847471528-7b95ea7a4c39"),
  },
];

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Follow Our Style"
        title="Style Stories"
        text="Looks built to share — Reels, Stories, TikTok and Pinterest boards you can post as-is."
        crumbs={[{ label: "Home", href: "/" }, { label: "Style Stories" }]}
      />
      <div className="container-x grid gap-8 py-12 md:grid-cols-2 lg:py-16">
        {boards.map((b) => (
          <article key={b.channel} className="border border-line bg-white">
            <div className="relative aspect-[16/10] bg-sand">
              <Image src={b.image} alt="" fill sizes="50vw" className="object-cover" />
            </div>
            <div className="p-6">
              <h2 className="font-serif text-2xl">{b.channel}</h2>
              <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-ink-soft">
                {b.items.map((i) => (
                  <li key={i}>{i}</li>
                ))}
              </ul>
              <Link href={b.href} className="btn-outline mt-6">
                Shop this story
              </Link>
            </div>
          </article>
        ))}
      </div>
      <section className="container-x pb-16">
        <h2 className="font-serif text-3xl">Seen on you</h2>
        <ul className="mt-8 grid grid-cols-2 gap-3 md:grid-cols-3">
          {instagramGrid.map((g) => (
            <li key={g.image} className="relative aspect-square bg-sand">
              <Image src={g.image} alt={g.alt} fill sizes="33vw" className="object-cover" />
            </li>
          ))}
        </ul>
        <p className="mt-6 flex items-center gap-2 text-sm text-muted">
          <BrandIcon name="instagram" className="h-4 w-4" /> Tag @Rang-o-Riwaaj to be featured.
        </p>
      </section>
    </>
  );
}
