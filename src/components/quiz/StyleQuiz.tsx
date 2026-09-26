"use client";

import { useMemo, useState } from "react";
import { getAllProducts, sortProducts } from "@/lib/catalog";
import type { Product } from "@/lib/types";
import { PageHero } from "@/components/pages/PageHero";
import { ProductGrid } from "@/components/product/ProductRail";

const QUESTIONS = [
  {
    key: "occasion",
    title: "What's the occasion?",
    options: [
      { id: "everyday", label: "Everyday / work" },
      { id: "formal", label: "Formal dinner" },
      { id: "party", label: "Mehndi or party" },
      { id: "wedding", label: "Wedding" },
      { id: "eid", label: "Eid & festive" },
    ],
  },
  {
    key: "colors",
    title: "Which colours do you reach for?",
    options: [
      { id: "neutrals", label: "Ivory, beige, black" },
      { id: "jewel", label: "Maroon, emerald, navy" },
      { id: "soft", label: "Pink, sky, mustard" },
      { id: "any", label: "Surprise me" },
    ],
  },
  {
    key: "type",
    title: "Stitched or unstitched?",
    options: [
      { id: "stitched", label: "Ready to wear" },
      { id: "unstitched", label: "Unstitched fabric" },
      { id: "either", label: "Either is fine" },
    ],
  },
  {
    key: "style",
    title: "How do you like to dress?",
    options: [
      { id: "casual", label: "Easy & printed" },
      { id: "elegant", label: "Refined & embroidered" },
      { id: "statement", label: "Bold & festive" },
    ],
  },
  {
    key: "budget",
    title: "What's your budget?",
    options: [
      { id: "u8", label: "Under Rs. 8,000" },
      { id: "u15", label: "Rs. 8,000 – 15,000" },
      { id: "u30", label: "Rs. 15,000 – 30,000" },
      { id: "lux", label: "Rs. 30,000+" },
    ],
  },
] as const;

type Answers = Record<string, string>;

function score(p: Product, a: Answers) {
  let s = p.rating + p.sold / 500;
  if (a.occasion === "wedding" && (p.collections.includes("wedding") || p.category === "wedding-wear")) s += 8;
  if (a.occasion === "eid" && p.collections.includes("eid")) s += 7;
  if (a.occasion === "party" && (p.category === "party-wear" || p.collections.includes("festive"))) s += 6;
  if (a.occasion === "formal" && p.category === "formal-wear") s += 6;
  if (a.occasion === "everyday" && (p.category === "casual-wear" || p.category === "kurta")) s += 5;
  if (a.type === "stitched" && p.construction === "stitched") s += 5;
  if (a.type === "unstitched" && p.construction === "unstitched") s += 5;
  const names = p.colors.map((c) => c.name.toLowerCase());
  if (a.colors === "neutrals" && names.some((n) => ["white", "beige", "black", "brown"].includes(n))) s += 3;
  if (a.colors === "jewel" && names.some((n) => ["maroon", "emerald green", "navy blue", "burgundy"].includes(n))) s += 3;
  if (a.colors === "soft" && names.some((n) => ["pink", "sky blue", "mustard"].includes(n))) s += 3;
  if (a.style === "casual" && p.tags.includes("printed")) s += 3;
  if (a.style === "elegant" && p.tags.includes("embroidered")) s += 3;
  if (a.style === "statement" && (p.badges.includes("limited") || p.collections.includes("festive"))) s += 3;
  if (a.budget === "u8" && p.price < 8000) s += 4;
  if (a.budget === "u15" && p.price >= 8000 && p.price < 15000) s += 4;
  if (a.budget === "u30" && p.price >= 15000 && p.price < 30000) s += 4;
  if (a.budget === "lux" && p.price >= 30000) s += 4;
  if (p.department === "accessories") s -= 2;
  return s;
}

export function StyleQuiz() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Answers>({});
  const done = step >= QUESTIONS.length;

  const results = useMemo(() => {
    if (!done) return [];
    return sortProducts(getAllProducts(), "featured")
      .map((p) => ({ p, s: score(p, answers) }))
      .sort((a, b) => b.s - a.s)
      .slice(0, 8)
      .map(({ p }) => p);
  }, [answers, done]);

  const q = QUESTIONS[step];

  return (
    <>
      <PageHero
        eyebrow="Find Your Style"
        title={done ? "Pieces picked for you" : "Five questions. Your next look."}
        text={done ? "Based on your occasion, colours, clothing type, style and budget." : "We'll recommend products — nothing is stored unless you add it to your bag."}
        crumbs={[{ label: "Home", href: "/" }, { label: "Style Quiz" }]}
      />
      <div className="container-x py-12 lg:py-16">
        {!done && q && (
          <div className="mx-auto max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
              Question {step + 1} of {QUESTIONS.length}
            </p>
            <h2 className="mt-3 font-serif text-3xl">{q.title}</h2>
            <ul className="mt-8 grid gap-3">
              {q.options.map((o) => (
                <li key={o.id}>
                  <button
                    onClick={() => {
                      setAnswers((a) => ({ ...a, [q.key]: o.id }));
                      setStep((s) => s + 1);
                    }}
                    className="w-full border border-line bg-white px-5 py-4 text-left text-sm font-medium transition-colors hover:border-ink hover:bg-sand"
                  >
                    {o.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}
        {done && (
          <div>
            <div className="mb-8 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  setStep(0);
                  setAnswers({});
                }}
                className="btn-outline"
              >
                Retake quiz
              </button>
            </div>
            <ProductGrid products={results} />
          </div>
        )}
      </div>
    </>
  );
}
