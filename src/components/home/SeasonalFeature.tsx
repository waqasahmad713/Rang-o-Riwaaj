import Image from "next/image";
import Link from "next/link";
import { seasonalFeature } from "@/data/site";
import { getProducts, sortProducts } from "@/lib/catalog";
import { ProductCard } from "@/components/product/ProductCard";

export function SeasonalFeature() {
  const s = seasonalFeature;
  const items = sortProducts(getProducts({ collection: s.activeSeason }), "featured").slice(0, 4);
  return (
    <section aria-labelledby="season-title" className="py-16 lg:py-24">
      <div className="container-x">
        <div className="relative mb-10 flex min-h-[420px] items-end overflow-hidden bg-ink lg:min-h-[520px]">
          <Image src={s.image} alt="Three women in traditional festive clothing in a sunlit courtyard" fill sizes="100vw" className="object-cover object-[50%_40%]" />
          <div className="absolute inset-0 bg-gradient-to-r from-ink/85 via-ink/40 to-transparent" />
          <div className="relative max-w-xl p-7 sm:p-12 lg:p-16">
            <p className="eyebrow mb-3 text-gold-light">{s.eyebrow}</p>
            <h2 id="season-title" className="font-serif text-4xl leading-tight text-ivory sm:text-6xl">
              {s.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ivory/85 sm:text-base">{s.description}</p>
            <Link href={s.href} className="btn-light mt-7">
              Shop the Collection
            </Link>
          </div>
        </div>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-9 lg:grid-cols-4 lg:gap-x-6">
          {items.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
