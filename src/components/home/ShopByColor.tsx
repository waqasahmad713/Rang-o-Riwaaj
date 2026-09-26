import Link from "next/link";
import { shopColors } from "@/data/site";
import { getAllProducts } from "@/lib/catalog";

export function ShopByColor() {
  const all = getAllProducts();
  const colors = shopColors
    .map((c) => ({ ...c, count: all.filter((p) => p.colors.some((pc) => pc.name === c.name)).length }))
    .filter((c) => c.count > 0);

  return (
    <section aria-labelledby="color-title" className="bg-sand py-16 lg:py-24">
      <div className="container-x">
        <div className="mb-10 text-center">
          <p className="eyebrow mb-3">Shop by Colour</p>
          <h2 id="color-title" className="section-title">
            Every shade of you
          </h2>
          <p className="mt-3 text-sm text-muted sm:text-base">Start with the colour you love — we&apos;ll show you everything in it.</p>
        </div>
        <ul className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6 lg:gap-5">
          {colors.map((c) => (
            <li key={c.name}>
              <Link href={`/shop?color=${encodeURIComponent(c.name)}`} className="group block bg-ivory p-3 transition-shadow hover:shadow-lg sm:p-4">
                <span
                  className="relative block aspect-square overflow-hidden rounded-full ring-1 ring-black/5 transition-transform duration-500 ring-inset group-hover:scale-[1.04]"
                  style={{ background: `radial-gradient(circle at 30% 25%, rgba(255,255,255,0.35), transparent 55%), ${c.hex}` }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute inset-0 opacity-25 mix-blend-overlay"
                    style={{ backgroundImage: "repeating-linear-gradient(45deg, rgba(255,255,255,.5) 0 1px, transparent 1px 6px)" }}
                  />
                </span>
                <span className="mt-3 block text-center text-sm font-medium">{c.name}</span>
                <span className="block text-center text-[11px] text-muted">{c.count} styles</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
