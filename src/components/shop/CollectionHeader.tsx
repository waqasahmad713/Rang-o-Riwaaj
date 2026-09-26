import Image from "next/image";
import Link from "next/link";
import type { CollectionDef } from "@/lib/types";
import { cn } from "@/lib/format";
import { Breadcrumbs } from "@/components/ui/primitives";

export function CollectionHeader({
  collection: c,
  title,
  description,
  activeSub,
  count,
}: {
  collection: CollectionDef;
  title?: string;
  description?: string;
  activeSub?: string;
  count: number;
}) {
  const dark = c.theme === "dark";
  const crumbs = [{ label: "Home", href: "/" }, activeSub ? { label: c.title, href: `/${c.slug}` } : { label: c.title }];
  if (activeSub) crumbs.push({ label: title ?? activeSub });

  return (
    <header className={cn("relative overflow-hidden", dark ? "bg-charcoal text-ivory" : "bg-sand")}>
      <div className="container-x grid items-center gap-8 py-10 lg:grid-cols-[1.2fr_1fr] lg:py-14">
        <div>
          <Breadcrumbs items={crumbs} tone={dark ? "light" : "dark"} />
          <p className={cn("eyebrow mt-6 mb-3", dark && "text-gold-light")}>{c.eyebrow}</p>
          <h1 className={cn("font-serif text-4xl leading-tight font-medium sm:text-5xl lg:text-6xl", dark && "text-ivory")}>{title ?? c.title}</h1>
          <p className={cn("mt-4 max-w-xl text-sm leading-relaxed sm:text-base", dark ? "text-ivory/75" : "text-ink-soft")}>{description ?? c.description}</p>
          <p className={cn("mt-4 text-xs font-medium", dark ? "text-ivory/60" : "text-muted")}>{count} styles</p>
        </div>
        <div className="relative hidden aspect-[16/10] overflow-hidden lg:block">
          <Image src={c.image} alt="" fill priority sizes="40vw" className="object-cover" />
        </div>
      </div>
      {c.subcategories && (
        <nav aria-label={`${c.title} categories`} className={cn("border-t", dark ? "border-white/10" : "border-line")}>
          <ul className="container-x no-scrollbar flex gap-2 overflow-x-auto py-4">
            <li>
              <Link
                href={`/${c.slug}`}
                aria-current={!activeSub ? "page" : undefined}
                className={cn(
                  "block shrink-0 border px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                  !activeSub ? (dark ? "border-ivory bg-ivory text-ink" : "border-ink bg-ink text-ivory") : dark ? "border-white/20 hover:border-ivory" : "border-ink/15 bg-ivory hover:border-ink",
                )}
              >
                All {c.title}
              </Link>
            </li>
            {c.subcategories.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/${c.slug}/${s.slug}`}
                  aria-current={activeSub === s.slug ? "page" : undefined}
                  className={cn(
                    "block shrink-0 border px-4 py-2 text-xs font-medium whitespace-nowrap transition-colors",
                    activeSub === s.slug ? (dark ? "border-ivory bg-ivory text-ink" : "border-ink bg-ink text-ivory") : dark ? "border-white/20 hover:border-ivory" : "border-ink/15 bg-ivory hover:border-ink",
                  )}
                >
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
