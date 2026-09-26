import Link from "next/link";
import { Suspense } from "react";
import { Ruler, Scissors } from "lucide-react";
import type { CollectionDef, Criteria } from "@/lib/types";
import { getProducts } from "@/lib/catalog";
import { hydrateCatalogFromDisk } from "@/lib/hydrate-catalog";
import { site } from "@/data/site";
import { CollectionHeader } from "./CollectionHeader";
import { CollectionView } from "./CollectionView";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";

function Intro({ slug }: { slug: string }) {
  if (slug === "stitched")
    return (
      <div className="mb-10 grid gap-4 border border-line bg-white p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8">
        <Ruler className="h-8 w-8 text-maroon" strokeWidth={1.3} aria-hidden="true" />
        <div>
          <h2 className="font-serif text-2xl">Ready to Wear</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Women's pre-stitched styles designed for convenience, perfect fit and effortless everyday fashion. Choose your size, colour and quantity on each product — and check our size guide for exact measurements.
          </p>
        </div>
        <Link href="/size-guide" className="btn-outline">
          Size Guide
        </Link>
      </div>
    );
  if (slug === "unstitched")
    return (
      <div className="mb-10 grid gap-4 border border-line bg-white p-6 sm:grid-cols-[auto_1fr_auto] sm:items-center sm:p-8">
        <Scissors className="h-8 w-8 text-maroon" strokeWidth={1.3} aria-hidden="true" />
        <div>
          <h2 className="font-serif text-2xl">Tailor-ready fabric</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Every unstitched suit lists its fabric type, print and embroidery details, fabric length, number of pieces and season — so you and your tailor know exactly what you&apos;re getting.
          </p>
        </div>
        <Link href="/journal/stitched-vs-unstitched" className="btn-outline">
          Stitched vs Unstitched
        </Link>
      </div>
    );
  if (slug === "men")
    return (
      <div className="mb-10 grid gap-4 border border-line bg-white p-6 sm:grid-cols-[auto_1fr] sm:items-center sm:p-8">
        <Scissors className="h-8 w-8 text-maroon" strokeWidth={1.3} aria-hidden="true" />
        <div>
          <h2 className="font-serif text-2xl">Unstitched menswear only</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Rang-o-Riwaaj menswear is tailor-ready fabric — shalwar kameez, kurta and sherwani lengths. Each listing shows fabric, piece count and metreage so your tailor can cut a custom fit.
          </p>
        </div>
      </div>
    );
  return null;
}

export function CollectionPage({ collection, sub }: { collection: CollectionDef; sub?: { slug: string; name: string; criteria: Criteria } }) {
  hydrateCatalogFromDisk();
  const criteria = sub ? { ...collection.criteria, ...sub.criteria } : collection.criteria;
  const products = getProducts(criteria);
  const title = sub ? `${collection.slug === "men" || collection.slug === "women" ? `${collection.title}'s ` : ""}${sub.name}` : undefined;

  const itemList = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: title ?? collection.title,
    description: collection.seoDescription,
    url: `${site.url}/${collection.slug}${sub ? `/${sub.slug}` : ""}`,
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: products.length,
      itemListElement: products.slice(0, 20).map((p, i) => ({ "@type": "ListItem", position: i + 1, url: `${site.url}/product/${p.slug}`, name: p.name })),
    },
  };

  return (
    <>
      <CollectionHeader collection={collection} title={title} activeSub={sub?.slug} count={products.length} />
      <div className="container-x py-10 lg:py-14">
        {!sub && <Intro slug={collection.slug} />}
        <Suspense fallback={<div className="h-96" />}>
          <CollectionView
            products={products}
            criteria={criteria}
            categoryOptions={sub ? undefined : collection.subcategories?.map((s) => ({ slug: s.slug, name: s.name }))}
            initialSort={collection.slug === "new-arrivals" ? "newest" : collection.slug === "best-sellers" ? "best-selling" : "featured"}
          />
        </Suspense>
      </div>
      <RecentlyViewed />
      <section className="container-x border-t border-line py-12">
        <h2 className="font-serif text-2xl">{title ?? collection.title} at Rang-o-Riwaaj</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-muted">
          {collection.seoDescription} Enjoy free delivery on orders above Rs. 5,000, cash on delivery across Pakistan and an easy 7-day exchange policy. Need styling advice? Message us on WhatsApp at {site.contact.phoneDisplay}.
        </p>
      </section>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
    </>
  );
}
