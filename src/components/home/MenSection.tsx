import Image from "next/image";
import Link from "next/link";
import { getProducts, sortProducts } from "@/lib/catalog";
import { u } from "@/data/site";
import { ProductRail } from "@/components/product/ProductRail";

const cats = [
  { label: "Shalwar Kameez", href: "/men/shalwar-kameez" },
  { label: "Kurta", href: "/men/kurta" },
  { label: "Formal", href: "/men/formal-wear" },
  { label: "Wedding", href: "/men/wedding-wear" },
];

export function MenSection() {
  const list = sortProducts(getProducts({ department: "men", construction: "unstitched" }), "featured").slice(0, 10);
  return (
    <section aria-labelledby="men-title" className="bg-charcoal py-16 text-ivory lg:py-24">
      <div className="container-x">
        <div className="grid items-end gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image src={u("photo-1774437791807-362e58f09a2c")} alt="Two men in traditional kurtas" fill sizes="(min-width:1024px) 55vw, 100vw" className="object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-charcoal/50 to-transparent" />
          </div>
          <div>
            <p className="eyebrow mb-3 text-gold-light">Menswear · Unstitched</p>
            <h2 id="men-title" className="section-title text-ivory">
              Tailor-ready tradition
            </h2>
            <p className="mt-4 max-w-md text-sm leading-relaxed text-ivory/70 sm:text-base">
              Unstitched shalwar kameez, kurta and sherwani fabrics — generous lengths so your tailor can cut a confident, custom fit.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {cats.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="block border border-ivory/25 px-4 py-2 text-xs font-medium text-ivory/90 transition-colors hover:border-gold-light hover:text-gold-light">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
            <Link href="/men" className="btn-light mt-8">
              Shop Men
            </Link>
          </div>
        </div>
        <div className="mt-14">
          <ProductRail products={list} tone="dark" label="Men's collection" />
        </div>
      </div>
    </section>
  );
}
