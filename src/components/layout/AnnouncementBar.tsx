"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { announcements } from "@/data/site";
import { useHydrated } from "@/lib/hooks";
import { useBanners } from "@/store";

export function AnnouncementBar() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const override = useBanners((s) => s.items);
  const list = hydrated && override?.length ? override : announcements;
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const n = list.length;

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => setI((x) => (x + 1) % n), 4500);
    return () => clearInterval(t);
  }, [paused, n]);

  if (pathname.startsWith("/checkout")) return null;

  const a = list[i];
  if (!a) return null;
  return (
    <div
      className="bg-ink text-ivory"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      role="region"
      aria-label="Announcements"
    >
      <div className="container-x flex h-9 items-center justify-between gap-2">
        <button onClick={() => setI((i - 1 + n) % n)} className="flex h-8 w-8 items-center justify-center text-ivory/70 hover:text-ivory" aria-label="Previous announcement">
          <ChevronLeft className="h-3.5 w-3.5" />
        </button>
        <p key={i} className="animate-fade-in truncate text-center text-[11px] font-medium tracking-[0.12em] uppercase sm:text-xs" aria-live="polite">
          {a.href ? (
            <Link href={a.href} className="hover:underline">
              {a.text}
            </Link>
          ) : (
            a.text
          )}
        </p>
        <button onClick={() => setI((i + 1) % n)} className="flex h-8 w-8 items-center justify-center text-ivory/70 hover:text-ivory" aria-label="Next announcement">
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}
