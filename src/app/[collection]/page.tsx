import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, getCollection } from "@/data/collections";
import { CollectionPage } from "@/components/shop/CollectionPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.map((c) => ({ collection: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
  const { collection } = await params;
  const c = getCollection(collection);
  if (!c) return {};
  return {
    title: c.title === "Women" || c.title === "Men" ? `${c.title}'s Clothing` : c.title,
    description: c.seoDescription,
    alternates: { canonical: `/${c.slug}` },
    openGraph: { title: c.title, description: c.seoDescription, images: [{ url: `${c.image}?w=1200&h=630&fit=crop&q=75` }] },
  };
}

export default async function Page({ params }: { params: Promise<{ collection: string }> }) {
  const { collection } = await params;
  const c = getCollection(collection);
  if (!c) notFound();
  return <CollectionPage collection={c} />;
}
