import Image from "next/image";
import Link from "next/link";
import { getProducts, sortProducts } from "@/lib/catalog";
import { u } from "@/data/site";
import { ProductRail } from "@/components/product/ProductRail";

const chips = [
  { label: "Casual", href: "/women/casual-wear" },
  { label: "Formal", href: "/women/formal-wear" },
  { label: "Party", href: "/women/party-wear" },
  { label: "Wedding", href: "/women/wedding-wear" },
  { label: "Embroidered", href: "/women/embroidered" },
  { label: "Unstitched", href: "/unstitched" },
];

export function WomenSection() {
  const list = sortProducts(getProducts({ department: "women", construction: "stitched" }), "featured").slice(0, 10);
  return (
    <section aria-labelledby="women-title" className="py-16 lg:py-24">
      <div className="container-x grid gap-10 lg:grid-cols-[minmax(0,380px)_1fr] lg:gap-14">
        <div className="relative hidden overflow-hidden bg-sand lg:block">
          <Image src={u("photo-1756483560049-e7b2208f99a0")} alt="Model in festive jewel-toned eastern wear with traditional jewellery" fill sizes="380px" className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
          <div className="absolute inset-x-0 bottom-0 p-8">
            <p className="eyebrow mb-2 text-gold-light">Womenswear</p>
            <p className="font-serif text-4xl leading-tight text-ivory">The Women&apos;s Edit</p>
            <Link href="/women" className="btn-light mt-5">
              Shop Women
            </Link>
          </div>
        </div>
        <div className="min-w-0">
          <div className="mb-8">
            <p className="eyebrow mb-3">Women&apos;s Collection</p>
            <h2 id="women-title" className="section-title">
              Designed for her every moment
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted sm:text-base">
              Everyday lawn, elegant formals and heirloom wedding wear — our largest collection, crafted with hand-finished detail.
            </p>
            <ul className="mt-6 flex flex-wrap gap-2">
              {chips.map((c) => (
                <li key={c.href}>
                  <Link href={c.href} className="block border border-line bg-white px-4 py-2 text-xs font-medium transition-colors hover:border-ink">
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <ProductRail products={list} label="Women's collection" />
          <Link href="/women" className="btn-outline mt-8 lg:hidden">
            Shop all Women
          </Link>
        </div>
      </div>
    </section>
  );
}
