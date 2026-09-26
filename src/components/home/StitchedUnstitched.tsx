import Image from "next/image";
import Link from "next/link";
import { Check } from "lucide-react";
import { u } from "@/data/site";

const panels = [
  {
    eyebrow: "Stitched",
    title: "Ready to Wear",
    text: "Women's pre-stitched styles designed for convenience, perfect fit and effortless everyday fashion.",
    points: ["Wear it the day it arrives", "Sizes XS–XL with a detailed size guide", "Pret, 2-piece & 3-piece sets"],
    image: u("photo-1762777777819-4d9aa5529368"),
    alt: "Model in a stitched pink floral kurta with tie-neck bow",
    href: "/stitched",
    cta: "Shop Ready to Wear",
  },
  {
    eyebrow: "Unstitched",
    title: "Your Fabric, Your Fit",
    text: "Premium lawn, cotton, linen, khaddar and embroidered fabric — tailor it exactly the way you love.",
    points: ["Generous cuts for any silhouette", "Fabric length & pieces clearly listed", "Lawn, khaddar, jamawar & more"],
    image: u("photo-1771098206750-6be5aef4f503"),
    alt: "Rolls of colourful printed unstitched fabric",
    href: "/unstitched",
    cta: "Shop Unstitched",
  },
];

export function StitchedUnstitched() {
  return (
    <section aria-labelledby="su-title" className="container-x pb-16 lg:pb-24">
      <h2 id="su-title" className="sr-only">
        Stitched or unstitched
      </h2>
      <div className="grid gap-5 md:grid-cols-2">
        {panels.map((p) => (
          <article key={p.title} className="group relative flex min-h-[520px] overflow-hidden bg-ink lg:min-h-[600px]">
            <Image src={p.image} alt={p.alt} fill sizes="(min-width:768px) 50vw, 100vw" className="object-cover opacity-80 transition-transform duration-1000 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-ink via-ink/40 to-transparent" />
            <div className="relative mt-auto p-7 sm:p-10">
              <p className="eyebrow mb-3 text-gold-light">{p.eyebrow}</p>
              <h3 className="font-serif text-4xl leading-tight text-ivory sm:text-5xl">{p.title}</h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-ivory/85">{p.text}</p>
              <ul className="mt-5 space-y-1.5">
                {p.points.map((pt) => (
                  <li key={pt} className="flex items-center gap-2 text-sm text-ivory/90">
                    <Check className="h-4 w-4 text-gold-light" /> {pt}
                  </li>
                ))}
              </ul>
              <Link href={p.href} className="btn-light mt-7">
                {p.cta}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
