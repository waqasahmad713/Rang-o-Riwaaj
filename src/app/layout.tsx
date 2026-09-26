import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Montserrat } from "next/font/google";
import "./globals.css";
import { site } from "@/data/site";
import { socialList } from "@/components/brand/BrandIcons";
import { Providers } from "@/components/providers/Providers";
import { AnnouncementBar } from "@/components/layout/AnnouncementBar";
import { Header } from "@/components/layout/Header";
import { StoreFooter } from "@/components/layout/StoreChrome";
import { BottomNav } from "@/components/layout/BottomNav";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — Women's Pret & Unstitched | Men's Unstitched Eastern Wear`,
    template: `%s | ${site.name}`,
  },
  description: site.description,
  keywords: ["Pakistani clothing", "women pret", "unstitched lawn", "embroidered suits", "men kurta", "shalwar kameez", "sherwani", "wedding wear", "Eid collection"],
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: "en_PK",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [{ url: "https://images.unsplash.com/photo-1747847471528-7b95ea7a4c39?w=1200&h=630&fit=crop&q=75", width: 1200, height: 630, alt: site.name }],
  },
  twitter: { card: "summary_large_image", title: site.name, description: site.description },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#faf7f2",
  width: "device-width",
  initialScale: 1,
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "ClothingStore",
  name: site.name,
  url: site.url,
  description: site.description,
  logo: `${site.url}/icon.svg`,
  telephone: "+92-319-5430110",
  email: site.contact.email,
  areaServed: "PK",
  currenciesAccepted: "PKR",
  paymentAccepted: "Cash, Credit Card, Bank Transfer, JazzCash, Easypaisa",
  sameAs: socialList.map((s) => s.url),
  contactPoint: [{ "@type": "ContactPoint", telephone: "+92-319-5430110", contactType: "customer service", availableLanguage: ["English", "Urdu"] }],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${cormorant.variable} ${montserrat.variable}`}>
      <body className="min-h-dvh">
        <a href="#main" className="sr-only z-[100] bg-ink px-4 py-2 text-ivory focus:not-sr-only focus:fixed focus:top-2 focus:left-2">
          Skip to content
        </a>
        <Providers>
          <AnnouncementBar />
          <Header />
          <main id="main">{children}</main>
          <StoreFooter />
          <BottomNav />
          <WhatsAppButton />
        </Providers>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </body>
    </html>
  );
}
