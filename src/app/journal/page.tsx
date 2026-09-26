import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { journal } from "@/data/journal";
import { formatDate } from "@/lib/format";
import { PageHero } from "@/components/pages/PageHero";

export const metadata: Metadata = {
  title: "Fashion Journal",
  description: "How to style a 3-piece suit, stitched vs unstitched, wedding outfit ideas and fabric care from Rang-o-Riwaaj.",
  alternates: { canonical: "/journal" },
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Fashion Journal"
        title="Style notes & guides"
        text="Practical advice for dressing, fitting and caring for eastern wear — written for real wardrobes."
        crumbs={[{ label: "Home", href: "/" }, { label: "Journal" }]}
      />
      <div className="container-x grid gap-10 py-12 md:grid-cols-2 lg:grid-cols-3 lg:py-16">
        {journal.map((p) => (
          <article key={p.slug}>
            <Link href={`/journal/${p.slug}`} className="group block">
              <span className="relative block aspect-[4/3] overflow-hidden bg-sand">
                <Image src={p.image} alt="" fill sizes="(min-width:1024px) 30vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              </span>
              <p className="mt-4 text-[11px] font-semibold tracking-[0.16em] text-gold uppercase">
                {p.category} · {p.readMinutes} min
              </p>
              <h2 className="mt-2 font-serif text-2xl leading-snug group-hover:underline">{p.title}</h2>
              <p className="mt-2 text-sm text-muted">{p.excerpt}</p>
              <time dateTime={p.date} className="mt-3 block text-xs text-muted">
                {formatDate(p.date)}
              </time>
            </Link>
          </article>
        ))}
      </div>
    </>
  );
}
