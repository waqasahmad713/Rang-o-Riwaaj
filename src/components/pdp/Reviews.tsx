"use client";

import { useMemo, useState } from "react";
import { BadgeCheck, Star } from "lucide-react";
import type { Product, Review } from "@/lib/types";
import { cn, formatDate } from "@/lib/format";
import { useHydrated } from "@/lib/hooks";
import { useUI, useUserReviews } from "@/store";
import { Stars } from "@/components/ui/primitives";

/** Approximate star distribution from the aggregate rating until real review data is connected. */
function distribution(rating: number, count: number) {
  const five = Math.max(0, Math.min(1, (rating - 3.6) / 1.4));
  const w = [five, (1 - five) * 0.62, (1 - five) * 0.24, (1 - five) * 0.09, (1 - five) * 0.05];
  return w.map((x) => Math.round(x * count));
}

export function Reviews({ product: p, seed }: { product: Product; seed: Review[] }) {
  const hydrated = useHydrated();
  const userReviews = useUserReviews((s) => s.reviews);
  const add = useUserReviews((s) => s.add);
  const toast = useUI((s) => s.toast);
  const [writing, setWriting] = useState(false);
  const [filter, setFilter] = useState<number | null>(null);
  const [rating, setRating] = useState(0);
  const [error, setError] = useState("");

  const all = useMemo(() => [...(hydrated ? userReviews.filter((r) => r.productId === p.id) : []), ...seed], [hydrated, userReviews, p.id, seed]);
  const shown = filter ? all.filter((r) => Math.round(r.rating) === filter) : all;
  const dist = distribution(p.rating, p.reviewCount);

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const name = String(f.get("name") ?? "").trim();
    const body = String(f.get("body") ?? "").trim();
    if (!rating) return setError("Please choose a star rating.");
    if (!name || body.length < 10) return setError("Please add your name and a review of at least 10 characters.");
    add({
      id: `u-${Date.now()}`,
      productId: p.id,
      name,
      city: String(f.get("city") ?? "").trim() || "Pakistan",
      rating,
      title: String(f.get("title") ?? "").trim() || "My review",
      body,
      date: new Date().toISOString(),
      purchased: p.name,
      verified: false,
    });
    setWriting(false);
    setRating(0);
    setError("");
    toast("Thank you! Your review has been posted.");
  };

  return (
    <section id="reviews" aria-labelledby="reviews-title" className="scroll-mt-32">
      <div className="grid gap-10 lg:grid-cols-[320px_1fr] lg:gap-16">
        <div>
          <p className="eyebrow mb-3">Reviews</p>
          <h2 id="reviews-title" className="section-title">
            Customers love this style
          </h2>
          <div className="mt-6 flex items-center gap-4">
            <span className="font-serif text-6xl leading-none">{p.rating.toFixed(1)}</span>
            <div>
              <Stars rating={p.rating} size={18} />
              <p className="mt-1 text-sm text-muted">Based on {p.reviewCount} reviews</p>
            </div>
          </div>
          <ul className="mt-6 space-y-2">
            {dist.map((n, i) => {
              const star = 5 - i;
              const pct = p.reviewCount ? (n / p.reviewCount) * 100 : 0;
              return (
                <li key={star}>
                  <button
                    onClick={() => setFilter(filter === star ? null : star)}
                    className={cn("flex w-full items-center gap-3 text-xs", filter === star ? "font-semibold" : "text-ink-soft hover:text-ink")}
                    aria-pressed={filter === star}
                    aria-label={`Show ${star} star reviews`}
                  >
                    <span className="w-8">{star} ★</span>
                    <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-sand-deep">
                      <span className="block h-full bg-gold" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="w-8 text-right tabular-nums">{n}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <button onClick={() => setWriting((w) => !w)} className="btn-outline mt-7 w-full">
            {writing ? "Cancel" : "Write a Review"}
          </button>
        </div>

        <div>
          {writing && (
            <form onSubmit={submit} className="animate-fade-up mb-10 grid gap-4 border border-line bg-white p-6 sm:grid-cols-2" noValidate>
              <fieldset className="sm:col-span-2">
                <legend className="label">Your rating</legend>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button type="button" key={i} onClick={() => setRating(i)} aria-label={`${i} star${i > 1 ? "s" : ""}`} aria-pressed={rating === i}>
                      <Star className={cn("h-7 w-7", i <= rating ? "fill-gold text-gold" : "text-gold-light")} strokeWidth={1.4} />
                    </button>
                  ))}
                </div>
              </fieldset>
              <div>
                <label htmlFor="rv-name" className="label">
                  Name
                </label>
                <input id="rv-name" name="name" className="input" autoComplete="name" required />
              </div>
              <div>
                <label htmlFor="rv-city" className="label">
                  City
                </label>
                <input id="rv-city" name="city" className="input" autoComplete="address-level2" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="rv-title" className="label">
                  Review title
                </label>
                <input id="rv-title" name="title" className="input" />
              </div>
              <div className="sm:col-span-2">
                <label htmlFor="rv-body" className="label">
                  Your review
                </label>
                <textarea id="rv-body" name="body" rows={4} className="input h-auto py-3" required />
              </div>
              {error && (
                <p className="text-sm text-danger sm:col-span-2" role="alert">
                  {error}
                </p>
              )}
              <button className="btn-primary sm:col-span-2 sm:justify-self-start">Submit Review</button>
            </form>
          )}

          {shown.length === 0 ? (
            <p className="border border-dashed border-line p-8 text-center text-sm text-muted">
              {filter ? `No ${filter}-star reviews yet.` : "Be the first to share your thoughts on this style."}
            </p>
          ) : (
            <ul className="divide-y divide-line border-y border-line">
              {shown.map((r) => (
                <li key={r.id} className="py-6">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <Stars rating={r.rating} />
                    <time className="text-xs text-muted" dateTime={r.date}>
                      {formatDate(r.date)}
                    </time>
                  </div>
                  <h3 className="mt-3 font-semibold">{r.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-ink-soft">{r.body}</p>
                  <p className="mt-3 flex items-center gap-2 text-xs text-muted">
                    <span className="font-semibold text-ink">{r.name}</span> · {r.city}
                    {r.verified && (
                      <span className="flex items-center gap-1 text-success">
                        <BadgeCheck className="h-3.5 w-3.5" /> Verified buyer
                      </span>
                    )}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  );
}
