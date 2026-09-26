"use client";

import { useState } from "react";
import { Check, Link2, Share2 } from "lucide-react";
import { BrandIcon } from "@/components/brand/BrandIcons";

export function ShareButtons({ url, title, image }: { url: string; title: string; image: string }) {
  const [copied, setCopied] = useState(false);
  const e = encodeURIComponent;
  const text = `${title} — Rang-o-Riwaaj`;
  const links = [
    { name: "whatsapp" as const, label: "WhatsApp", href: `https://wa.me/?text=${e(`${text} ${url}`)}` },
    { name: "facebook" as const, label: "Facebook", href: `https://www.facebook.com/sharer/sharer.php?u=${e(url)}` },
    { name: "pinterest" as const, label: "Pinterest", href: `https://www.pinterest.com/pin/create/button/?url=${e(url)}&media=${e(image)}&description=${e(text)}` },
    { name: "x" as const, label: "X", href: `https://twitter.com/intent/tweet?url=${e(url)}&text=${e(text)}` },
  ];

  const native = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: text, url });
      } catch {}
    } else copy();
  };
  const copy = async () => {
    await navigator.clipboard?.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const btn = "flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white transition-colors hover:border-ink hover:text-maroon";
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="mr-1 text-xs font-semibold tracking-[0.14em] text-ink-soft uppercase">Share</span>
      {links.map((l) => (
        <a key={l.name} href={l.href} target="_blank" rel="noopener noreferrer" aria-label={`Share on ${l.label}`} className={btn}>
          <BrandIcon name={l.name} className="h-4 w-4" />
        </a>
      ))}
      <button onClick={copy} aria-label="Copy link" className={btn}>
        {copied ? <Check className="h-4 w-4 text-success" /> : <Link2 className="h-4 w-4" />}
      </button>
      <button onClick={native} aria-label="More sharing options" className={`${btn} sm:hidden`}>
        <Share2 className="h-4 w-4" />
      </button>
      {copied && (
        <span className="text-xs text-success" role="status">
          Link copied
        </span>
      )}
    </div>
  );
}
