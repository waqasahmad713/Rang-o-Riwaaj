"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Expand, Play, X } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/format";
import { useEscape, useLockBody } from "@/lib/hooks";

const viewLabel = { front: "Front", back: "Back", detail: "Detail", styled: "Styled" } as const;

export function Gallery({ product: p, index, onIndex }: { product: Product; index: number; onIndex: (i: number) => void }) {
  const [zoom, setZoom] = useState<{ x: number; y: number } | null>(null);
  const [lightbox, setLightbox] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const scroller = useRef<HTMLDivElement>(null);
  const n = p.images.length;

  useEffect(() => {
    const el = scroller.current;
    if (!el) return;
    const target = el.children[index] as HTMLElement | undefined;
    if (target && Math.abs(el.scrollLeft - target.offsetLeft) > 4) el.scrollTo({ left: target.offsetLeft, behavior: "smooth" });
  }, [index]);

  const onScroll = () => {
    const el = scroller.current;
    if (!el) return;
    const i = Math.round(el.scrollLeft / el.clientWidth);
    if (i !== index) onIndex(i);
  };

  const img = p.images[index] ?? p.images[0];

  return (
    <div className="lg:grid lg:grid-cols-[84px_1fr] lg:gap-4">
      <ul className="hidden max-h-[760px] flex-col gap-3 overflow-y-auto lg:flex" aria-label="Product images">
        {p.images.map((im, i) => (
          <li key={im.src}>
            <button
              onClick={() => {
                setShowVideo(false);
                onIndex(i);
              }}
              aria-label={`Show ${viewLabel[im.view]} view`}
              aria-current={i === index && !showVideo}
              className={cn("relative block aspect-[3/4] w-full overflow-hidden bg-sand ring-1 transition", i === index && !showVideo ? "ring-ink" : "ring-transparent hover:ring-line")}
            >
              <Image src={im.src} alt="" fill sizes="84px" className="object-cover" />
            </button>
          </li>
        ))}
        {p.video && (
          <li>
            <button onClick={() => setShowVideo(true)} aria-label="Play product video" className={cn("relative flex aspect-[3/4] w-full items-center justify-center bg-ink text-ivory ring-1", showVideo ? "ring-ink" : "ring-transparent")}>
              <Play className="h-6 w-6" />
            </button>
          </li>
        )}
      </ul>

      <div className="relative">
        <div
          ref={scroller}
          onScroll={onScroll}
          className="no-scrollbar -mx-4 flex snap-x snap-mandatory overflow-x-auto sm:-mx-6 lg:hidden"
          aria-label="Product images, swipe to browse"
        >
          {p.images.map((im, i) => (
            <button key={im.src} onClick={() => { onIndex(i); setLightbox(true); }} className="relative aspect-[3/4] w-full shrink-0 snap-center bg-sand" aria-label={`Open ${viewLabel[im.view]} view full screen`}>
              <Image src={im.src} alt={im.alt} fill priority={i === 0} sizes="100vw" className="object-cover" />
            </button>
          ))}
        </div>

        <div className="hidden lg:block">
          {showVideo && p.video ? (
            <video src={p.video.src} poster={p.video.poster} controls autoPlay muted playsInline className="aspect-[3/4] w-full bg-ink object-cover" />
          ) : (
            <div
              className="relative aspect-[3/4] cursor-zoom-in overflow-hidden bg-sand"
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                setZoom({ x: ((e.clientX - r.left) / r.width) * 100, y: ((e.clientY - r.top) / r.height) * 100 });
              }}
              onMouseLeave={() => setZoom(null)}
              onClick={() => setLightbox(true)}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority
                quality={75}
                sizes="(min-width:1024px) 50vw, 100vw"
                className="object-cover transition-transform duration-200 ease-out"
                style={zoom ? { transform: "scale(2)", transformOrigin: `${zoom.x}% ${zoom.y}%` } : undefined}
              />
              <span className="pointer-events-none absolute bottom-4 left-4 bg-ivory/90 px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] uppercase">{viewLabel[img.view]} view</span>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setLightbox(true);
                }}
                aria-label="View full screen"
                className="absolute right-4 bottom-4 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 hover:bg-ivory"
              >
                <Expand className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>

        <div className="mt-3 flex justify-center gap-1.5 lg:hidden" aria-hidden="true">
          {p.images.map((im, i) => (
            <span key={im.src} className={cn("h-1.5 rounded-full transition-all", i === index ? "w-6 bg-ink" : "w-1.5 bg-ink/25")} />
          ))}
        </div>
      </div>

      {lightbox && <Lightbox product={p} index={index} onIndex={onIndex} onClose={() => setLightbox(false)} n={n} />}
    </div>
  );
}

function Lightbox({ product: p, index, onIndex, onClose, n }: { product: Product; index: number; onIndex: (i: number) => void; onClose: () => void; n: number }) {
  useLockBody(true);
  useEscape(onClose);
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") onIndex((index + 1) % n);
      if (e.key === "ArrowLeft") onIndex((index - 1 + n) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [index, n, onIndex]);
  const img = p.images[index];
  return (
    <div className="animate-fade-in fixed inset-0 z-[90] bg-ink/95" role="dialog" aria-modal="true" aria-label={`${p.name} images`}>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-ivory text-ink" aria-label="Close" data-autofocus>
        <X className="h-5 w-5" />
      </button>
      <div className={cn("absolute inset-0 overflow-auto", zoomed ? "cursor-zoom-out" : "cursor-zoom-in")} onClick={() => setZoomed((z) => !z)}>
        <div className={cn("relative mx-auto h-full transition-all", zoomed ? "w-[200%] max-w-none sm:w-[140%]" : "w-full max-w-3xl")}>
          <Image src={img.src} alt={img.alt} fill sizes="100vw" className="object-contain" />
        </div>
      </div>
      {n > 1 && (
        <>
          <button onClick={() => onIndex((index - 1 + n) % n)} className="absolute top-1/2 left-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory text-ink" aria-label="Previous image">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button onClick={() => onIndex((index + 1) % n)} className="absolute top-1/2 right-3 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-ivory text-ink" aria-label="Next image">
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}
      <p className="absolute bottom-5 left-1/2 -translate-x-1/2 text-xs text-ivory/80">
        {index + 1} / {n} · Tap to {zoomed ? "zoom out" : "zoom in"}
      </p>
    </div>
  );
}
