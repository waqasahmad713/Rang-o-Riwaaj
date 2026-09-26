import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { journal } from "@/data/journal";
import { instagramGrid, site, u } from "@/data/site";
import { formatDate } from "@/lib/format";
import { BrandIcon, SocialLinks } from "@/components/brand/BrandIcons";
import { NewsletterForm } from "@/components/layout/NewsletterForm";

export function StyleQuizCTA() {
  return (
    <section aria-labelledby="quiz-title" className="container-x pb-16 lg:pb-24">
      <div className="grid overflow-hidden bg-sand md:grid-cols-[1.1fr_1fr]">
        <div className="flex flex-col justify-center p-8 sm:p-12 lg:p-16">
          <p className="eyebrow mb-3 flex items-center gap-2">
            <Sparkles className="h-3.5 w-3.5" /> Find Your Style
          </p>
          <h2 id="quiz-title" className="section-title">
            Not sure what to wear?
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
            Answer five quick questions about the occasion, colours, clothing type, style and budget — and we&apos;ll recommend pieces picked just for you.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/style-quiz" className="btn-primary">
              Take the Style Quiz
            </Link>
            <Link href="/compare" className="btn-outline">
              Compare Products
            </Link>
          </div>
        </div>
        <div className="relative min-h-[300px]">
          <Image src={u("photo-1756483509254-3cc48a5a15b2")} alt="Two women in ornate eastern gowns" fill sizes="(min-width:768px) 45vw, 100vw" className="object-cover" />
        </div>
      </div>
    </section>
  );
}

export function JournalPreview() {
  const posts = journal.slice(0, 3);
  return (
    <section aria-labelledby="journal-title" className="py-16 lg:py-24">
      <div className="container-x">
        <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow mb-3">Fashion Journal</p>
            <h2 id="journal-title" className="section-title">
              Style notes &amp; guides
            </h2>
          </div>
          <Link href="/journal" className="group inline-flex items-center gap-2 text-xs font-semibold tracking-[0.18em] uppercase">
            <span className="link-underline">Read the Journal</span> <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
        <ul className="grid gap-8 md:grid-cols-3">
          {posts.map((p) => (
            <li key={p.slug}>
              <article className="group">
                <Link href={`/journal/${p.slug}`} className="relative block aspect-[4/3] overflow-hidden bg-sand">
                  <Image src={p.image} alt="" fill sizes="(min-width:768px) 32vw, 100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                </Link>
                <p className="mt-4 text-[11px] font-semibold tracking-[0.16em] text-gold uppercase">
                  {p.category} · {p.readMinutes} min read
                </p>
                <h3 className="mt-2 font-serif text-2xl leading-snug">
                  <Link href={`/journal/${p.slug}`} className="hover:underline">
                    {p.title}
                  </Link>
                </h3>
                <p className="mt-2 text-sm text-muted">{p.excerpt}</p>
                <time dateTime={p.date} className="mt-3 block text-xs text-muted">
                  {formatDate(p.date)}
                </time>
              </article>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function FollowOurStyle() {
  return (
    <section aria-labelledby="follow-title" className="bg-sand py-16 lg:py-24">
      <div className="container-x">
        <div className="mb-10 flex flex-col items-center text-center">
          <p className="eyebrow mb-3">Social</p>
          <h2 id="follow-title" className="section-title">
            Follow Our Style
          </h2>
          <p className="mt-3 max-w-lg text-sm text-muted sm:text-base">
            New drops, styling reels and behind-the-scenes from our atelier. Follow{" "}
            <a href={site.social.instagram.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-ink underline underline-offset-4">
              {site.social.instagram.handle}
            </a>
          </p>
          <SocialLinks className="mt-6" iconClass="text-ink" />
        </div>
        <ul className="grid grid-cols-3 gap-1.5 sm:gap-3 lg:grid-cols-6">
          {instagramGrid.map((g) => (
            <li key={g.image}>
              <a href={site.social.instagram.url} target="_blank" rel="noopener noreferrer" className="group relative block aspect-square overflow-hidden bg-sand-deep" aria-label={`${g.alt} — view on Instagram`}>
                <Image src={g.image} alt={g.alt} fill sizes="(min-width:1024px) 16vw, 33vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
                <span className="absolute inset-0 flex items-center justify-center bg-ink/0 text-ivory opacity-0 transition-all group-hover:bg-ink/40 group-hover:opacity-100">
                  <BrandIcon name="instagram" className="h-6 w-6" />
                </span>
              </a>
            </li>
          ))}
        </ul>
        <div className="mt-10 text-center">
          <Link href="/style-stories" className="btn-outline">
            Explore Style Stories
          </Link>
        </div>
      </div>
    </section>
  );
}

export function NewsletterSection() {
  return (
    <section aria-labelledby="nl-title" className="py-16 lg:py-24">
      <div className="container-x">
        <div className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-3">Newsletter</p>
          <h2 id="nl-title" className="section-title">
            Be the first to know.
          </h2>
          <p className="mt-3 text-sm text-muted sm:text-base">Get new collection updates, exclusive offers and fashion inspiration directly in your inbox.</p>
          <div className="mx-auto mt-8 max-w-lg">
            <NewsletterForm id="home-newsletter" />
            <p className="mt-3 text-[11px] text-muted">
              By subscribing you agree to our{" "}
              <Link href="/privacy" className="underline">
                Privacy Policy
              </Link>
              . Unsubscribe anytime.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
