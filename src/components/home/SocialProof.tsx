import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Quote } from "lucide-react";
import { reviews } from "@/data/reviews";
import { ugc } from "@/data/site";
import { getProductBySlug } from "@/lib/catalog";
import { Stars } from "@/components/ui/primitives";
import { BrandIcon } from "@/components/brand/BrandIcons";

const initials = (n: string) =>
  n
    .split(" ")
    .map((x) => x[0])
    .join("")
    .slice(0, 2);

const avatarTones = ["bg-maroon", "bg-emerald", "bg-gold", "bg-ink"];

export function CustomerReviews() {
  const list = reviews.slice(0, 6);
  const avg = reviews.reduce((s, r) => s + r.rating, 0) / reviews.length;
  return (
    <section aria-labelledby="reviews-title" className="bg-sand py-16 lg:py-24">
      <div className="container-x">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Reviews</p>
            <h2 id="reviews-title" className="section-title">
              Customers Love Our Style
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span className="font-serif text-5xl">{avg.toFixed(1)}</span>
            <span>
              <Stars rating={avg} size={16} />
              <span className="block text-xs text-muted">Average from verified buyers</span>
            </span>
          </div>
        </div>
        <ul className="no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 sm:-mx-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible lg:px-0">
          {list.map((r, i) => (
            <li key={r.id} className="w-[85%] shrink-0 snap-start sm:w-[45%] lg:w-auto">
              <figure className="flex h-full flex-col bg-ivory p-6 sm:p-7">
                <Quote className="h-7 w-7 text-gold-light" aria-hidden="true" />
                <Stars rating={r.rating} className="mt-4" />
                <blockquote className="mt-3 flex-1">
                  <p className="font-serif text-xl leading-snug">“{r.title}”</p>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
                </blockquote>
                <figcaption className="mt-6 flex items-center gap-3 border-t border-line pt-5">
                  <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-serif text-lg text-ivory ${avatarTones[i % 4]}`} aria-hidden="true">
                    {initials(r.name)}
                  </span>
                  <span className="min-w-0">
                    <span className="flex items-center gap-1.5 text-sm font-semibold">
                      {r.name}
                      {r.verified && <BadgeCheck className="h-4 w-4 text-success" aria-label="Verified buyer" />}
                    </span>
                    <span className="block truncate text-xs text-muted">
                      {r.city} · Bought {r.purchased}
                    </span>
                  </span>
                </figcaption>
              </figure>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function SeenOnYou() {
  return (
    <section aria-labelledby="seen-title" className="py-16 lg:py-24">
      <div className="container-x">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-3">#RangORiwaaj</p>
          <h2 id="seen-title" className="section-title">
            Seen on You
          </h2>
          <p className="mt-3 text-sm text-muted sm:text-base">Tag @Rang-o-Riwaaj on Instagram for a chance to be featured.</p>
        </div>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3">
          {ugc.map((g, i) => {
            const p = getProductBySlug(g.product);
            return (
              <li key={g.image} className={i === 0 || i === 5 ? "sm:row-span-2" : ""}>
                <Link href={p ? `/product/${p.slug}` : "/shop"} className="group relative block h-full min-h-48 overflow-hidden bg-sand sm:min-h-64">
                  <Image
                    src={g.image}
                    alt={`${g.handle} wearing ${p?.name ?? "Rang-o-Riwaaj"}`}
                    fill
                    sizes="(min-width:640px) 25vw, 50vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-ink/75 via-transparent to-transparent p-3 opacity-100 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    <span className="flex items-center gap-1.5 text-xs font-semibold text-ivory">
                      <BrandIcon name="instagram" className="h-3.5 w-3.5" /> {g.handle}
                    </span>
                    {p && <span className="mt-0.5 text-[11px] text-ivory/80">Wearing {p.name}</span>}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
