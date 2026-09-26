"use client";

import Link from "next/link";
import { ChevronDown, Heart, Package, Sparkles, User } from "lucide-react";
import { mainNav, site, whatsappLink } from "@/data/site";
import { useUI } from "@/store";
import { Drawer } from "@/components/ui/Overlay";
import { BrandIcon, SocialLinks } from "@/components/brand/BrandIcons";

export function MobileMenu() {
  const open = useUI((s) => s.menuOpen);
  const set = useUI((s) => s.set);
  const close = () => set({ menuOpen: false });

  return (
    <Drawer open={open} onClose={close} title="Menu" side="left">
      <nav aria-label="Mobile" className="flex-1 overflow-y-auto">
        <ul className="divide-y divide-line">
          {mainNav.map((item) =>
            item.columns ? (
              <li key={item.label}>
                <details className="group">
                  <summary className="flex h-14 list-none items-center justify-between px-5 text-sm font-semibold tracking-[0.14em] uppercase [&::-webkit-details-marker]:hidden">
                    {item.label}
                    <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="space-y-5 bg-sand/60 px-5 py-5">
                    <Link href={item.href} onClick={close} className="block text-sm font-semibold underline underline-offset-4">
                      Shop all {item.label}
                    </Link>
                    {item.columns.map((col) => (
                      <div key={col.title}>
                        <p className="eyebrow mb-2">{col.title}</p>
                        <ul className="grid grid-cols-2 gap-x-3 gap-y-2.5">
                          {col.links.map((l) => (
                            <li key={l.href + l.label}>
                              <Link href={l.href} onClick={close} className="text-sm text-ink-soft">
                                {l.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              </li>
            ) : (
              <li key={item.label}>
                <Link href={item.href} onClick={close} className={`flex h-14 items-center px-5 text-sm font-semibold tracking-[0.14em] uppercase ${item.label === "Sale" ? "text-maroon" : ""}`}>
                  {item.label}
                </Link>
              </li>
            ),
          )}
        </ul>
        <ul className="grid grid-cols-2 gap-2 p-5 text-sm">
          {[
            { href: "/account", label: "My Account", Icon: User },
            { href: "/wishlist", label: "Wishlist", Icon: Heart },
            { href: "/track-order", label: "Track Order", Icon: Package },
            { href: "/style-quiz", label: "Style Quiz", Icon: Sparkles },
          ].map(({ href, label, Icon }) => (
            <li key={href}>
              <Link href={href} onClick={close} className="flex items-center gap-2 border border-line bg-white px-3 py-3">
                <Icon className="h-4 w-4 text-maroon" /> {label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="space-y-4 border-t border-line p-5">
        <a href={whatsappLink("Hi Rang-o-Riwaaj! I need help with an order.")} target="_blank" rel="noopener noreferrer" className="btn w-full bg-[#25D366] text-white hover:bg-[#1ebe5b]">
          <BrandIcon name="whatsapp" className="h-4 w-4" /> WhatsApp {site.contact.phoneDisplay}
        </a>
        <SocialLinks className="justify-center" />
      </div>
    </Drawer>
  );
}
