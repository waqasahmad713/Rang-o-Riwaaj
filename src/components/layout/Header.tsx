"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { mainNav } from "@/data/site";
import { cn } from "@/lib/format";
import { useHydrated } from "@/lib/hooks";
import { useCart, useUI, useWishlist } from "@/store";
import { Logo } from "@/components/brand/Logo";

export function Header() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const set = useUI((s) => s.set);
  const cartCount = useCart((s) => s.items.reduce((a, b) => a + b.qty, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 8);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);

  if (pathname.startsWith("/checkout")) return null;

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`));
  const iconBtn = "relative flex h-11 w-11 items-center justify-center text-ink transition-colors hover:text-maroon";
  const count = (n: number) =>
    hydrated && n > 0 ? (
      <span className="absolute top-1.5 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-maroon px-1 text-[10px] font-semibold text-ivory">{n}</span>
    ) : null;

  return (
    <header className={cn("sticky top-0 z-50 border-b bg-ivory/95 backdrop-blur-md transition-shadow", scrolled ? "border-line shadow-[0_4px_20px_-12px_rgba(28,25,23,0.25)]" : "border-transparent")}>
      <div className="container-x">
        <div className="flex h-16 items-center justify-between gap-2 lg:h-20">
          <div className="flex flex-1 items-center gap-1">
            <button className={cn(iconBtn, "-ml-2.5 lg:hidden")} onClick={() => set({ menuOpen: true })} aria-label="Open menu">
              <Menu className="h-6 w-6" />
            </button>
            <button
              onClick={() => set({ searchOpen: true })}
              className="hidden h-10 w-64 items-center gap-2 border border-line bg-white px-3 text-left text-sm text-muted transition-colors hover:border-ink lg:flex"
              aria-label="Search products"
            >
              <Search className="h-4 w-4" /> Search for kurta, lawn…
            </button>
          </div>

          <Logo className="shrink-0" />

          <div className="flex flex-1 items-center justify-end">
            <button className={cn(iconBtn, "lg:hidden")} onClick={() => set({ searchOpen: true })} aria-label="Search">
              <Search className="h-5 w-5" />
            </button>
            <Link href="/account" className={cn(iconBtn, "hidden sm:flex")} aria-label="My account">
              <User className="h-5 w-5" />
            </Link>
            <Link href="/wishlist" className={cn(iconBtn, "hidden sm:flex")} aria-label={`Wishlist${hydrated ? `, ${wishCount} items` : ""}`}>
              <Heart className="h-5 w-5" />
              {count(wishCount)}
            </Link>
            <button className={cn(iconBtn, "-mr-2.5")} onClick={() => set({ cartOpen: true })} aria-label={`Shopping bag${hydrated ? `, ${cartCount} items` : ""}`}>
              <ShoppingBag className="h-5 w-5" />
              {count(cartCount)}
            </button>
          </div>
        </div>

        <nav aria-label="Main" className="hidden lg:block">
          <ul className="flex items-center justify-center gap-x-5 xl:gap-x-8">
            {mainNav.map((item) => (
              <li key={item.label} className="group/nav static">
                <Link
                  href={item.href}
                  className={cn(
                    "relative flex h-11 items-center text-[11px] font-semibold tracking-[0.16em] uppercase transition-colors hover:text-maroon xl:text-xs",
                    item.label === "Sale" && "text-maroon",
                    isActive(item.href) && "after:absolute after:inset-x-0 after:bottom-2 after:h-px after:bg-current",
                  )}
                  aria-haspopup={item.columns ? "true" : undefined}
                >
                  {item.label}
                </Link>
                {item.columns && (
                  <div className="invisible absolute inset-x-0 top-full border-t border-line bg-ivory opacity-0 shadow-[0_24px_40px_-24px_rgba(28,25,23,0.3)] transition-all duration-200 group-hover/nav:visible group-hover/nav:opacity-100 group-focus-within/nav:visible group-focus-within/nav:opacity-100">
                    <div className="container-x grid grid-cols-[1fr_auto] gap-10 py-9">
                      <div className="flex gap-16">
                        {item.columns.map((col) => (
                          <div key={col.title}>
                            <p className="eyebrow mb-4">{col.title}</p>
                            <ul className="space-y-2.5">
                              {col.links.map((l) => (
                                <li key={l.href + l.label}>
                                  <Link href={l.href} className="link-underline text-sm text-ink-soft hover:text-ink">
                                    {l.label}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ))}
                        <div>
                          <p className="eyebrow mb-4">Explore</p>
                          <ul className="space-y-2.5">
                            <li>
                              <Link href={item.href} className="link-underline text-sm font-semibold">
                                Shop all {item.label}
                              </Link>
                            </li>
                            <li>
                              <Link href="/new-arrivals" className="link-underline text-sm text-ink-soft hover:text-ink">
                                New Arrivals
                              </Link>
                            </li>
                            <li>
                              <Link href="/style-quiz" className="link-underline text-sm text-ink-soft hover:text-ink">
                                Find Your Style
                              </Link>
                            </li>
                          </ul>
                        </div>
                      </div>
                      {item.feature && (
                        <Link href={item.feature.href} className="group/feat relative block h-56 w-80 overflow-hidden bg-sand">
                          <Image src={item.feature.image} alt="" fill sizes="320px" className="object-cover transition-transform duration-700 group-hover/feat:scale-105" />
                          <span className="absolute inset-0 bg-gradient-to-t from-ink/70 to-transparent" />
                          <span className="absolute bottom-4 left-4 font-serif text-2xl text-ivory">{item.feature.title}</span>
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
