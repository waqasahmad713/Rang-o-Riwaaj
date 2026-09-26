import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { campaigns } from "@/data/site";

export function CampaignStrip() {
  return (
    <section aria-labelledby="campaigns-title" className="container-x py-16 lg:py-24">
      <div className="mb-8 flex items-end justify-between gap-4">
        <div>
          <p className="eyebrow mb-3">Seasonal Campaigns</p>
          <h2 id="campaigns-title" className="section-title">
            Collections for every celebration
          </h2>
        </div>
      </div>
      <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-5 lg:overflow-visible lg:px-0">
        {campaigns.map((c) => (
          <li key={c.slug} className="w-[68%] shrink-0 snap-start sm:w-[40%] lg:w-auto">
            <Link href={c.href} className="group relative block aspect-[3/4] overflow-hidden bg-sand">
              <Image src={c.image} alt="" fill sizes="(min-width:1024px) 20vw, 60vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <span className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/10 to-transparent" />
              <span className="absolute inset-x-0 bottom-0 p-5">
                <span className="block font-serif text-2xl leading-tight text-ivory">{c.title}</span>
                <span className="mt-1 block text-xs text-ivory/80">{c.subtitle}</span>
                <span className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold tracking-[0.16em] text-gold-light uppercase">
                  Explore <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
