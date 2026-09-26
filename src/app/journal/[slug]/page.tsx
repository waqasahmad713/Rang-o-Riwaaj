import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost, journal } from "@/data/journal";
import { formatDate } from "@/lib/format";
import { site } from "@/data/site";
import { Breadcrumbs } from "@/components/ui/primitives";

export function generateStaticParams() {
  return journal.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) return {};
  return {
    title: p.title,
    description: p.excerpt,
    alternates: { canonical: `/journal/${p.slug}` },
    openGraph: { title: p.title, description: p.excerpt, images: [{ url: `${p.image}?w=1200&h=630&fit=crop&q=75` }] },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = getPost(slug);
  if (!p) notFound();
  const more = journal.filter((x) => x.slug !== p.slug).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: p.title,
    datePublished: p.date,
    author: { "@type": "Organization", name: site.name },
    image: `${p.image}?w=1200&q=75`,
    description: p.excerpt,
  };

  return (
    <article className="pb-16">
      <header className="border-b border-line bg-sand">
        <div className="container-x max-w-3xl py-10 sm:py-14">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Journal", href: "/journal" }, { label: p.title }]} />
          <p className="eyebrow mt-6">
            {p.category} · {p.readMinutes} min read
          </p>
          <h1 className="mt-3 font-serif text-4xl font-medium sm:text-5xl">{p.title}</h1>
          <p className="mt-4 text-ink-soft">{p.excerpt}</p>
          <time dateTime={p.date} className="mt-4 block text-xs text-muted">
            {formatDate(p.date)}
          </time>
        </div>
      </header>
      <div className="container-x max-w-3xl">
        <div className="relative my-10 aspect-[16/9] overflow-hidden bg-sand">
          <Image src={p.image} alt="" fill sizes="800px" className="object-cover" priority />
        </div>
        <div className="prose-rr">
          {p.body.map((block, i) => (
            <section key={i}>
              {block.heading && <h2>{block.heading}</h2>}
              {block.paragraphs.map((para) => (
                <p key={para}>{para}</p>
              ))}
              {block.bullets && (
                <ul>
                  {block.bullets.map((b) => (
                    <li key={b}>{b}</li>
                  ))}
                </ul>
              )}
            </section>
          ))}
        </div>
        {p.relatedLinks && (
          <div className="mt-10 flex flex-wrap gap-3">
            {p.relatedLinks.map((l) => (
              <Link key={l.href} href={l.href} className="btn-outline">
                {l.label}
              </Link>
            ))}
          </div>
        )}
      </div>
      <aside className="container-x mt-16 border-t border-line pt-12">
        <h2 className="font-serif text-2xl">Keep reading</h2>
        <ul className="mt-6 grid gap-6 md:grid-cols-3">
          {more.map((x) => (
            <li key={x.slug}>
              <Link href={`/journal/${x.slug}`} className="hover:underline">
                {x.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
    </article>
  );
}
