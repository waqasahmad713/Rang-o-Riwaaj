import Link from "next/link";
import { ArrowRight, Gift, Percent, ShoppingBag, Tag, Truck } from "lucide-react";
import { offers } from "@/data/site";
import { cn } from "@/lib/format";

const tones = {
  maroon: "bg-maroon text-ivory",
  sand: "bg-sand-deep text-ink",
  ink: "bg-ink text-ivory",
  gold: "bg-gold-light text-ink",
  emerald: "bg-emerald text-ivory",
} as const;
const icons = [ShoppingBag, Truck, Percent, Gift, Tag];

export function Offers() {
  return (
    <section aria-labelledby="offers-title" className="container-x py-16 lg:py-24">
      <div className="mb-10">
        <p className="eyebrow mb-3">Special Offers</p>
        <h2 id="offers-title" className="section-title">
          More reasons to shop today
        </h2>
        <p className="mt-3 text-sm text-muted sm:text-base">Honest offers with clear terms — no fake countdowns, ever.</p>
      </div>
      <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {offers.map((o, i) => {
          const Icon = icons[i];
          const light = o.tone === "sand" || o.tone === "gold";
          return (
            <li key={o.title} className={cn(i === 0 && "sm:col-span-2 lg:col-span-1")}>
              <Link href={o.href} className={cn("group flex h-full min-h-56 flex-col p-6 transition-transform duration-300 hover:-translate-y-1", tones[o.tone])}>
                <Icon className={cn("h-7 w-7", light ? "text-maroon" : "text-gold-light")} strokeWidth={1.4} aria-hidden="true" />
                <h3 className={cn("mt-5 font-serif text-2xl leading-tight", light ? "text-ink" : "text-ivory")}>{o.title}</h3>
                <p className={cn("mt-2 text-sm leading-relaxed", light ? "text-ink-soft" : "text-ivory/80")}>{o.text}</p>
                <span className="mt-auto flex items-center gap-1.5 pt-5 text-[11px] font-semibold tracking-[0.16em] uppercase">
                  {o.cta} <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
