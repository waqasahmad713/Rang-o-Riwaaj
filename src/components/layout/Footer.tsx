import Link from "next/link";
import { Clock, Mail, Phone } from "lucide-react";
import { site, whatsappLink } from "@/data/site";
import { Logo } from "@/components/brand/Logo";
import { BrandIcon, PaymentIcons, socialList } from "@/components/brand/BrandIcons";
import { NewsletterForm } from "./NewsletterForm";

const columns = [
  {
    title: "Customer Service",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "Shipping Information", href: "/shipping" },
      { label: "Returns & Exchange", href: "/returns" },
      { label: "Size Guide", href: "/size-guide" },
      { label: "FAQs", href: "/faq" },
      { label: "Order Tracking", href: "/track-order" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Women", href: "/women" },
      { label: "Men", href: "/men" },
      { label: "Stitched", href: "/stitched" },
      { label: "Unstitched", href: "/unstitched" },
      { label: "New Arrivals", href: "/new-arrivals" },
      { label: "Sale", href: "/sale" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/about#our-story" },
      { label: "Our Quality", href: "/about#our-quality" },
      { label: "Fashion Journal", href: "/journal" },
      { label: "Style Stories", href: "/style-stories" },
      { label: "Careers", href: "/careers" },
      { label: "Add products", href: "/admin" },
    ],
  },
];

export function Footer({ hidden }: { hidden?: boolean }) {
  if (hidden) return null;
  return (
    <footer className="bg-charcoal pb-20 text-ivory lg:pb-0">
      <div className="container-x grid gap-12 py-16 lg:grid-cols-[1.3fr_2fr] lg:gap-20 lg:py-20">
        <div className="space-y-6">
          <Logo tone="light" />
          <p className="max-w-sm text-sm leading-relaxed text-ivory/70">{site.shortAbout}</p>
          <div>
            <p className="mb-3 font-serif text-2xl">Be the first to know.</p>
            <NewsletterForm tone="light" id="footer-newsletter" />
          </div>
          <ul className="space-y-2.5 text-sm text-ivory/80">
            <li>
              <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 hover:text-ivory">
                <BrandIcon name="whatsapp" className="h-4 w-4 text-[#25D366]" /> WhatsApp: {site.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={site.contact.phoneHref} className="flex items-center gap-2.5 hover:text-ivory">
                <Phone className="h-4 w-4 text-gold-light" /> {site.contact.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2.5 hover:text-ivory">
                <Mail className="h-4 w-4 text-gold-light" /> {site.contact.email}
              </a>
            </li>
            <li className="flex items-center gap-2.5">
              <Clock className="h-4 w-4 text-gold-light" /> {site.contact.hours}
            </li>
          </ul>
        </div>

        <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
          {columns.map((c) => (
            <nav key={c.title} aria-label={c.title}>
              <h2 className="mb-5 font-sans text-[11px] font-semibold tracking-[0.22em] text-gold-light uppercase">{c.title}</h2>
              <ul className="space-y-3">
                {c.links.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-sm text-ivory/75 transition-colors hover:text-ivory">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label="Connect">
            <h2 className="mb-5 font-sans text-[11px] font-semibold tracking-[0.22em] text-gold-light uppercase">Connect</h2>
            <ul className="space-y-3">
              {socialList.map((s) => (
                <li key={s.name}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 text-sm text-ivory/75 transition-colors hover:text-ivory">
                    <BrandIcon name={s.name} className="h-4 w-4" /> {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-x flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between">
          <PaymentIcons />
          <div className="flex flex-col gap-2 text-xs text-ivory/60 sm:flex-row sm:items-center sm:gap-5">
            <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
            <div className="flex gap-4">
              <Link href="/privacy" className="hover:text-ivory">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-ivory">
                Terms &amp; Conditions
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
