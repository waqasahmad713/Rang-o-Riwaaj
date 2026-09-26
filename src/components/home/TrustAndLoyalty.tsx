import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, Cake, Crown, Gem, Headset, Mail, Package, Phone, RefreshCcw, ShieldCheck, Sparkles, Star, Truck, Zap } from "lucide-react";
import { site, trustPoints, u, whatsappLink } from "@/data/site";
import { BrandIcon, PaymentIcons } from "@/components/brand/BrandIcons";

export const iconMap = { BadgeCheck, ShieldCheck, Sparkles, RefreshCcw, Truck, Headset, Gem, Package };

export function WhyShopWithUs() {
  return (
    <section aria-labelledby="why-title" className="py-16 lg:py-24">
      <div className="container-x">
        <div className="mb-12 text-center">
          <p className="eyebrow mb-3">Our Promise</p>
          <h2 id="why-title" className="section-title">
            Why Shop With Us?
          </h2>
        </div>
        <ul className="grid gap-px overflow-hidden border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
          {trustPoints.map((t) => {
            const Icon = iconMap[t.icon];
            return (
              <li key={t.title} className="flex gap-4 bg-ivory p-7">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-sand text-maroon">
                  <Icon className="h-5 w-5" strokeWidth={1.5} aria-hidden="true" />
                </span>
                <span>
                  <h3 className="font-sans text-sm font-semibold tracking-wide">{t.title}</h3>
                  <p className="mt-1 text-sm text-muted">{t.text}</p>
                </span>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 grid gap-8 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-ink-soft uppercase">Secure payments</p>
            <PaymentIcons />
          </div>
          <div>
            <p className="mb-3 text-xs font-semibold tracking-[0.16em] text-ink-soft uppercase">Need help? We&apos;re here</p>
            <ul className="flex flex-wrap gap-2">
              <li>
                <a href={whatsappLink()} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-line bg-white px-4 py-2.5 text-sm hover:border-ink">
                  <BrandIcon name="whatsapp" className="h-4 w-4 text-[#25D366]" /> WhatsApp
                </a>
              </li>
              <li>
                <a href={site.contact.phoneHref} className="flex items-center gap-2 border border-line bg-white px-4 py-2.5 text-sm hover:border-ink">
                  <Phone className="h-4 w-4 text-maroon" /> Call us
                </a>
              </li>
              <li>
                <a href={`mailto:${site.contact.email}`} className="flex items-center gap-2 border border-line bg-white px-4 py-2.5 text-sm hover:border-ink">
                  <Mail className="h-4 w-4 text-maroon" /> Email
                </a>
              </li>
              <li>
                <Link href="/contact" className="flex items-center gap-2 border border-line bg-white px-4 py-2.5 text-sm hover:border-ink">
                  <Headset className="h-4 w-4 text-maroon" /> Contact form
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

const perks = [
  { Icon: Zap, title: "Early access", text: "Shop new collections 48 hours before everyone else." },
  { Icon: Star, title: "Special discounts", text: "Member-only offers throughout the year." },
  { Icon: Cake, title: "Birthday offers", text: "A little gift from us on your special day." },
  { Icon: Crown, title: "Exclusive launches", text: "Invitations to limited drops and previews." },
];

export function StyleClub() {
  return (
    <section aria-labelledby="club-title" className="bg-ink text-ivory">
      <div className="grid lg:grid-cols-2">
        <div className="relative min-h-[320px] lg:min-h-[560px]">
          <Image src={u("photo-1756483571456-6fa86cb1ae53")} alt="Smiling woman in traditional wedding attire" fill sizes="(min-width:1024px) 50vw, 100vw" className="object-cover object-top" />
        </div>
        <div className="flex items-center px-6 py-14 sm:px-12 lg:px-16">
          <div className="max-w-lg">
            <p className="eyebrow mb-3 text-gold-light">Loyalty Programme</p>
            <h2 id="club-title" className="section-title text-ivory">
              Join the Style Club
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-ivory/75 sm:text-base">Free to join. Create an account and switch on Style Club to enjoy:</p>
            <ul className="mt-8 grid gap-6 sm:grid-cols-2">
              {perks.map(({ Icon, title, text }) => (
                <li key={title} className="flex gap-3">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-gold-light" strokeWidth={1.5} aria-hidden="true" />
                  <span>
                    <span className="block text-sm font-semibold">{title}</span>
                    <span className="mt-0.5 block text-sm text-ivory/70">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
            <Link href="/account?join=club" className="btn-light mt-10">
              Join the Style Club
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
