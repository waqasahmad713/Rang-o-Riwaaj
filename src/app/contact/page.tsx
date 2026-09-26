import type { Metadata } from "next";
import { site, whatsappLink } from "@/data/site";
import { PageHero } from "@/components/pages/PageHero";
import { ContactForm } from "@/components/pages/ContactForm";
import { BrandIcon } from "@/components/brand/BrandIcons";
import { Clock, Mail, Phone } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `WhatsApp, phone and email support for Rang-o-Riwaaj — ${site.contact.phoneDisplay}.`,
  alternates: { canonical: "/contact" },
};

export default function Page() {
  return (
    <>
      <PageHero
        eyebrow="Customer Service"
        title="We're here"
        text="Size questions, order updates or styling advice — the fastest reply is WhatsApp."
        crumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
      />
      <div className="container-x grid gap-12 py-12 lg:grid-cols-2 lg:py-16">
        <ul className="space-y-5 text-sm">
          <li>
            <a href={whatsappLink("Assalamualaikum, I have a question.")} className="flex items-start gap-3 hover:underline" target="_blank" rel="noopener noreferrer">
              <BrandIcon name="whatsapp" className="mt-0.5 h-5 w-5 text-[#25D366]" />
              <span>
                <strong className="block">WhatsApp</strong>
                {site.contact.phoneDisplay}
              </span>
            </a>
          </li>
          <li>
            <a href={site.contact.phoneHref} className="flex items-start gap-3 hover:underline">
              <Phone className="mt-0.5 h-5 w-5 text-maroon" />
              <span>
                <strong className="block">Phone</strong>
                {site.contact.phoneDisplay}
              </span>
            </a>
          </li>
          <li>
            <a href={`mailto:${site.contact.email}`} className="flex items-start gap-3 hover:underline">
              <Mail className="mt-0.5 h-5 w-5 text-maroon" />
              <span>
                <strong className="block">Email</strong>
                {site.contact.email}
              </span>
            </a>
          </li>
          <li className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 text-maroon" />
            <span>
              <strong className="block">Hours</strong>
              {site.contact.hours}
              <span className="mt-1 block text-muted">{site.contact.address}</span>
            </span>
          </li>
        </ul>
        <ContactForm />
      </div>
    </>
  );
}
