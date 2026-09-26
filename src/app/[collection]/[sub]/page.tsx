import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { collections, getCollection } from "@/data/collections";
import { CollectionPage } from "@/components/shop/CollectionPage";

export const dynamicParams = false;

export function generateStaticParams() {
  return collections.flatMap((c) => (c.subcategories ?? []).map((s) => ({ collection: c.slug, sub: s.slug })));
}

const resolve = (collection: string, sub: string) => {
  const c = getCollection(collection);
  const s = c?.subcategories?.find((x) => x.slug === sub);
  return c && s ? { c, s } : null;
};

export async function generateMetadata({ params }: { params: Promise<{ collection: string; sub: string }> }): Promise<Metadata> {
  const { collection, sub } = await params;
  const r = resolve(collection, sub);
  if (!r) return {};
  const title = `${r.c.title === "Women" || r.c.title === "Men" ? `${r.c.title}'s ` : ""}${r.s.name}`;
  const description = `Shop ${title.toLowerCase()} at Rang-o-Riwaaj. ${r.c.seoDescription}`;
  return { title, description, alternates: { canonical: `/${r.c.slug}/${r.s.slug}` }, openGraph: { title, description } };
}

export default async function Page({ params }: { params: Promise<{ collection: string; sub: string }> }) {
  const { collection, sub } = await params;
  const r = resolve(collection, sub);
  if (!r) notFound();
  return <CollectionPage collection={r.c} sub={r.s} />;
}
