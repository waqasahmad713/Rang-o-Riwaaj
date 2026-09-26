import Image from "next/image";
import Link from "next/link";
import { getProducts, totalStock } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";

export function LimitedEdition() {
  const items = getProducts({ badge: "limited" }).slice(0, 4);
  return (
    <section aria-labelledby="limited-title" className="relative overflow-hidden bg-maroon-dark py-16 text-ivory lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{ backgroundImage: "radial-gradient(circle at 1px 1px, #d8c29b 1px, transparent 0)", backgroundSize: "22px 22px" }}
      />
      <div className="container-x relative">
        <div className="mx-auto mb-12 max-w-2xl text-center">
          <p className="eyebrow mb-3 text-gold-light">Limited Edition · Small Batch</p>
          <h2 id="limited-title" className="section-title text-ivory">
            Once it is gone, it is gone.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-ivory/75 sm:text-base">
            Hand-finished pieces made in very small quantities by our master karigars. Stock counts below are real and updated with every order.
          </p>
        </div>
        <ul className="grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {items.map((p) => {
            const left = totalStock(p);
            return (
              <li key={p.id}>
                <Link href={`/product/${p.slug}`} className="group block">
                  <div className="relative aspect-[3/4] overflow-hidden border border-gold/30 bg-white/5">
                    <Image src={p.images[0].src} alt={p.images[0].alt} fill sizes="(min-width:1024px) 22vw, 48vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute top-3 left-3 bg-gold px-2 py-1 text-[10px] font-semibold tracking-[0.14em] text-white uppercase">Limited</span>
                  </div>
                  <p className="mt-3 font-serif text-xl leading-tight group-hover:underline">{p.name}</p>
                  <p className="mt-1 text-sm text-ivory/80">{formatPrice(p.price)}</p>
                  <p className="mt-1 text-xs font-medium text-gold-light">{left > 0 ? `${left} pieces available` : "Sold out"}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        <div className="mt-12 text-center">
          <Link href="/limited-edition" className="btn-ghost-light">
            View Limited Edition
          </Link>
        </div>
      </div>
    </section>
  );
}
