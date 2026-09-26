import Link from "next/link";
import { ChevronRight, Star } from "lucide-react";
import { cn, formatPrice } from "@/lib/format";

export function Stars({ rating, size = 14, className }: { rating: number; size?: number; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-0.5 text-gold", className)} aria-label={`Rated ${rating.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fill = Math.max(0, Math.min(1, rating - (i - 1)));
        return (
          <span key={i} className="relative inline-block" style={{ width: size, height: size }} aria-hidden="true">
            <Star className="absolute inset-0 text-gold-light" style={{ width: size, height: size }} strokeWidth={1.5} />
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${fill * 100}%` }}>
              <Star className="fill-gold text-gold" style={{ width: size, height: size }} strokeWidth={1.5} />
            </span>
          </span>
        );
      })}
    </span>
  );
}

export function Price({ price, compareAt, className, size = "md" }: { price: number; compareAt?: number; className?: string; size?: "sm" | "md" | "lg" }) {
  const onSale = compareAt && compareAt > price;
  const pct = onSale ? Math.round(((compareAt - price) / compareAt) * 100) : 0;
  return (
    <span className={cn("flex flex-wrap items-baseline gap-x-2 gap-y-0.5", className)}>
      <span className={cn("font-semibold", onSale ? "text-maroon" : "text-ink", size === "lg" ? "text-2xl" : size === "sm" ? "text-sm" : "text-[15px]")}>
        {formatPrice(price)}
      </span>
      {onSale && (
        <>
          <s className={cn("text-muted", size === "lg" ? "text-base" : "text-xs")}>
            <span className="sr-only">Original price </span>
            {formatPrice(compareAt)}
          </s>
          <span className={cn("font-semibold text-maroon", size === "lg" ? "text-sm" : "text-[11px]")}>−{pct}%</span>
        </>
      )}
    </span>
  );
}

export function Swatch({ hex, name, size = 16, selected, className }: { hex: string; name: string; size?: number; selected?: boolean; className?: string }) {
  const isGradient = hex.startsWith("linear");
  const light = !isGradient && ["#f7f4ee", "#faf7f2", "#ffffff", "#d9c7a7"].includes(hex.toLowerCase());
  return (
    <span
      title={name}
      className={cn("inline-block shrink-0 rounded-full", light && "ring-1 ring-line ring-inset", selected && "outline-2 outline-offset-2 outline-ink", className)}
      style={{ width: size, height: size, background: hex }}
    />
  );
}

export function Breadcrumbs({ items, tone = "dark" }: { items: { label: string; href?: string }[]; tone?: "dark" | "light" }) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-xs", tone === "dark" ? "text-muted" : "text-ivory/80")}>
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((it, i) => (
          <li key={i} className="flex items-center gap-1">
            {i > 0 && <ChevronRight className="h-3 w-3 opacity-60" aria-hidden="true" />}
            {it.href ? (
              <Link href={it.href} className="hover:underline">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className={tone === "dark" ? "text-ink" : "text-ivory"}>
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function SectionHeader({
  eyebrow,
  title,
  text,
  action,
  align = "left",
  tone = "dark",
  as: Tag = "h2",
}: {
  eyebrow?: string;
  title: string;
  text?: string;
  action?: { label: string; href: string };
  align?: "left" | "center";
  tone?: "dark" | "light";
  as?: "h1" | "h2";
}) {
  return (
    <div className={cn("mb-8 flex flex-col gap-4 sm:mb-10", align === "center" ? "items-center text-center" : "sm:flex-row sm:items-end sm:justify-between")}>
      <div className={cn("max-w-2xl", align === "center" && "mx-auto")}>
        {eyebrow && <p className={cn("eyebrow mb-3", tone === "light" && "text-gold-light")}>{eyebrow}</p>}
        <Tag className={cn("section-title", tone === "light" && "text-ivory")}>{title}</Tag>
        {text && <p className={cn("mt-3 text-sm leading-relaxed sm:text-base", tone === "light" ? "text-ivory/75" : "text-muted")}>{text}</p>}
      </div>
      {action && (
        <Link
          href={action.href}
          className={cn(
            "group inline-flex shrink-0 items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em]",
            tone === "light" ? "text-ivory" : "text-ink",
          )}
        >
          <span className="link-underline">{action.label}</span>
          <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </Link>
      )}
    </div>
  );
}

export function Badge({ children, tone = "ink", className }: { children: React.ReactNode; tone?: "ink" | "maroon" | "gold" | "ivory" | "emerald"; className?: string }) {
  const tones = {
    ink: "bg-ink text-ivory",
    maroon: "bg-maroon text-ivory",
    gold: "bg-gold text-white",
    ivory: "bg-ivory text-ink",
    emerald: "bg-emerald text-ivory",
  };
  return <span className={cn("inline-block px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]", tones[tone], className)}>{children}</span>;
}
