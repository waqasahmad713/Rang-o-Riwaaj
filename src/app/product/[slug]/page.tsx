import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllProducts, getCompleteTheLook, getProductBySlug, getRelated } from "@/lib/catalog";
import { hydrateCatalogFromDisk } from "@/lib/hydrate-catalog";
import { reviewsFor } from "@/data/reviews";
import { site } from "@/data/site";
import { Breadcrumbs, SectionHeader } from "@/components/ui/primitives";
import { ProductDetail } from "@/components/pdp/ProductDetail";
import { Reviews } from "@/components/pdp/Reviews";
import { ProductRail } from "@/components/product/ProductRail";
import { RecentlyViewed, RecommendedForYou } from "@/components/product/RecentlyViewed";

export const dynamicParams = true;

export function generateStaticParams() {
  hydrateCatalogFromDisk();
  return getAllProducts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  hydrateCatalogFromDisk();
  const p = getProductBySlug(slug);
  if (!p) return {};
  return {
    title: p.name,
    description: p.shortDescription,
    alternates: { canonical: `/product/${p.slug}` },
    openGraph: {
      title: p.name,
      description: p.shortDescription,
      type: "website",
      images: [{ url: `${p.images[0].src}?w=1200&h=630&fit=crop&q=75`, alt: p.images[0].alt }],
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  hydrateCatalogFromDisk();
  const p = getProductBySlug(slug);
  if (!p) notFound();

  const look = getCompleteTheLook(p);
  const related = getRelated(p, 8);
  const seed = reviewsFor(p.id);
  const url = `${site.url}/product/${p.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.name,
    sku: p.sku,
    description: p.shortDescription,
    image: p.images.map((i) => `${i.src}?w=1200&q=75`),
    brand: { "@type": "Brand", name: site.name },
    color: p.colors.map((c) => c.name),
    material: p.fabric,
    category: p.category,
    aggregateRating: { "@type": "AggregateRating", ratingValue: p.rating, reviewCount: p.reviewCount },
    offers: {
      "@type": "Offer",
      priceCurrency: "PKR",
      price: p.price,
      availability: Object.values(p.stock).some((n) => n > 0) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url,
    },
  };

  const crumbs = [
    { label: "Home", href: "/" },
    { label: p.department === "women" ? "Women" : p.department === "men" ? "Men" : "Accessories", href: `/${p.department}` },
    { label: p.construction === "unstitched" ? "Unstitched" : p.construction === "stitched" ? "Ready to Wear" : "Shop", href: p.construction === "accessory" ? "/accessories" : `/${p.construction}` },
    { label: p.name },
  ];

  return (
    <>
      <div className="container-x pt-6 pb-16 lg:pb-24">
        <div className="mb-6">
          <Breadcrumbs items={crumbs} />
        </div>
        <ProductDetail product={p} url={url} />
      </div>

      {look.length > 0 && (
        <section aria-labelledby="look-title" className="border-t border-line bg-sand py-16 lg:py-20">
          <div className="container-x">
            <SectionHeader eyebrow="Complete the Look" title="Pair it with" text="Khussa, jewellery and finishing pieces chosen to sit with this outfit." />
            <ProductRail products={look} label="Complete the look" />
          </div>
        </section>
      )}

      <div className="container-x py-16 lg:py-24">
        <Reviews product={p} seed={seed} />
      </div>

      <section aria-labelledby="related-title" className="border-t border-line py-16 lg:py-20">
        <div className="container-x">
          <SectionHeader eyebrow="You May Also Like" title="More from this wardrobe" as="h2" />
          <div id="related-title" className="sr-only">
            Related products
          </div>
          <ProductRail products={related} label="Related products" />
        </div>
      </section>

      <RecentlyViewed excludeId={p.id} />
      <RecommendedForYou excludeId={p.id} title="Recommended for You" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </>
  );
}
