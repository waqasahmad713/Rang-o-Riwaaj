import Link from "next/link";
import { cn } from "@/lib/format";

export function LogoMark({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const stroke = tone === "dark" ? "#6b1e2e" : "#d8c29b";
  const letter = tone === "dark" ? "#1c1917" : "#faf7f2";
  return (
    <svg viewBox="0 0 44 52" className={cn("shrink-0", className)} aria-hidden="true">
      <path d="M5 50V22.5C5 12.8 13.4 6.4 22 2.5c8.6 3.9 17 10.3 17 20V50Z" fill="none" stroke={stroke} strokeWidth="1.6" />
      <path d="M9.5 50V24c0-7.3 6-12.5 12.5-15.6C28.5 11.5 34.5 16.7 34.5 24v26" fill="none" stroke="#a8834b" strokeWidth="0.9" />
      <path d="M22 0.2l1.6 1.9L22 4l-1.6-1.9z" fill="#a8834b" />
      <text
        x="22"
        y="40"
        textAnchor="middle"
        fontFamily="var(--font-cormorant), 'Cormorant Garamond', Georgia, serif"
        fontSize="22"
        fontWeight="600"
        fill={letter}
      >
        R
      </text>
    </svg>
  );
}

export function Logo({ tone = "dark", className, compact = false }: { tone?: "dark" | "light"; className?: string; compact?: boolean }) {
  return (
    <Link href="/" aria-label="Rang-o-Riwaaj — home" className={cn("group flex items-center gap-2.5", className)}>
      <LogoMark tone={tone} className={compact ? "h-9 w-8" : "h-10 w-9 sm:h-11 sm:w-10"} />
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-serif text-[22px] font-semibold tracking-tight sm:text-[26px]",
            tone === "dark" ? "text-ink" : "text-ivory",
          )}
        >
          Rang<span className="text-gold">-o-</span>Riwaaj
        </span>
        {!compact && (
          <span className={cn("mt-1 hidden text-[9px] font-medium uppercase tracking-[0.34em] sm:block", tone === "dark" ? "text-muted" : "text-ivory/70")}>
            Colour · Craft · Tradition
          </span>
        )}
      </span>
    </Link>
  );
}
