import Link from "next/link";
import { getProducts } from "@/lib/catalog";
import { sortProducts } from "@/lib/catalog";
import { ProductGrid } from "@/components/product/ProductRail";

export default function NotFound() {
  const picks = sortProducts(getProducts({ badge: "bestseller" }), "best-selling").slice(0, 4);
  return (
    <div className="container-x py-16 lg:py-24">
      <p className="eyebrow">404</p>
      <h1 className="mt-3 font-serif text-4xl sm:text-5xl">This page has been tailored away</h1>
      <p className="mt-4 max-w-xl text-ink-soft">The link may be out of season. Try the shop, or start with a customer favourite.</p>
      <div className="mt-8 flex flex-wrap gap-3">
        <Link href="/" className="btn-primary">
          Home
        </Link>
        <Link href="/women" className="btn-outline">
          Women
        </Link>
        <Link href="/men" className="btn-outline">
          Men
        </Link>
      </div>
      <div className="mt-16">
        <h2 className="mb-8 font-serif text-2xl">Best sellers</h2>
        <ProductGrid products={picks} />
      </div>
    </div>
  );
}
