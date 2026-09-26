"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { heroSlides } from "@/data/site";
import { cn } from "@/lib/format";

export function Hero() {
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = heroSlides.length;

  useEffect(() => {
    if (paused) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 7000);
    return () => clearInterval(t);
  }, [paused, n]);

  const s = heroSlides[i];

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured collections"
      className="relative bg-sand"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="grid lg:min-h-[min(84vh,780px)] lg:grid-cols-[1fr_1.1fr]">
        <div className="relative order-2 flex items-center px-5 py-12 sm:px-10 lg:order-1 lg:px-16 xl:px-24">
          <div key={i} className="animate-fade-up max-w-xl">
            <p className="eyebrow mb-5">{s.eyebrow}</p>
            {i === 0 ? (
              <h1 className="font-serif text-[2.75rem] leading-[1.02] font-medium sm:text-6xl xl:text-7xl">{s.title}</h1>
            ) : (
              <p className="font-serif text-[2.75rem] leading-[1.02] font-medium text-ink sm:text-6xl xl:text-7xl">{s.title}</p>
            )}
            <p className="mt-6 max-w-md text-base leading-relaxed text-ink-soft">{s.text}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href={s.primary.href} className="btn-primary">
                {s.primary.label}
              </Link>
              <Link href={s.secondary.href} className="btn-outline">
                {s.secondary.label}
              </Link>
            </div>
            <dl className="mt-12 hidden grid-cols-3 gap-6 border-t border-ink/10 pt-6 text-xs sm:grid">
              <div>
                <dt className="text-muted">Delivery</dt>
                <dd className="mt-1 font-semibold">Free over Rs. 5,000</dd>
              </div>
              <div>
                <dt className="text-muted">Exchange</dt>
                <dd className="mt-1 font-semibold">Easy 7-day policy</dd>
              </div>
              <div>
                <dt className="text-muted">Payment</dt>
                <dd className="mt-1 font-semibold">Cash on delivery</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="relative order-1 aspect-[4/5] overflow-hidden sm:aspect-[16/11] lg:order-2 lg:aspect-auto">
          {heroSlides.map((sl, idx) => (
            <Image
              key={sl.image}
              src={sl.image}
              alt={sl.imageAlt}
              fill
              priority={idx === 0}
              sizes="(min-width:1024px) 55vw, 100vw"
              className={cn("object-cover object-[50%_30%] transition-opacity duration-1000", idx === i ? "opacity-100" : "opacity-0")}
              aria-hidden={idx !== i}
            />
          ))}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/30 via-transparent to-transparent" />
          <div className="absolute bottom-5 left-5 flex gap-2 lg:bottom-8 lg:left-8" role="tablist" aria-label="Choose slide">
            {heroSlides.map((sl, idx) => (
              <button
                key={sl.title}
                role="tab"
                aria-selected={idx === i}
                aria-label={`Slide ${idx + 1}: ${sl.title}`}
                onClick={() => setI(idx)}
                className="flex h-8 items-center"
              >
                <span className={cn("block h-[3px] transition-all duration-500", idx === i ? "w-10 bg-ivory" : "w-5 bg-ivory/50")} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
