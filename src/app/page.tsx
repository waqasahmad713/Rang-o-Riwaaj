import { getProducts, sortProducts } from "@/lib/catalog";
import { hydrateCatalogFromDisk } from "@/lib/hydrate-catalog";
import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CampaignStrip } from "@/components/home/CampaignStrip";
import { ShopByCategory } from "@/components/home/ShopByCategory";
import { WomenSection } from "@/components/home/WomenSection";
import { StitchedUnstitched } from "@/components/home/StitchedUnstitched";
import { MenSection } from "@/components/home/MenSection";
import { PromoTabs } from "@/components/home/PromoTabs";
import { LimitedEdition } from "@/components/home/LimitedEdition";
import { SeasonalFeature } from "@/components/home/SeasonalFeature";
import { ShopByColor } from "@/components/home/ShopByColor";
import { Offers } from "@/components/home/Offers";
import { CustomerReviews, SeenOnYou } from "@/components/home/SocialProof";
import { StyleClub, WhyShopWithUs } from "@/components/home/TrustAndLoyalty";
import { FollowOurStyle, JournalPreview, NewsletterSection, StyleQuizCTA } from "@/components/home/ContentSections";
import { RecentlyViewed } from "@/components/product/RecentlyViewed";

export default function HomePage() {
  hydrateCatalogFromDisk();
  const groups = [
    {
      id: "new",
      label: "New Arrivals",
      tagline: "Fresh styles. New season. Your next favorite look.",
      href: "/new-arrivals",
      products: sortProducts(getProducts({ badge: "new" }), "newest").slice(0, 10),
    },
    {
      id: "best",
      label: "Best Sellers",
      tagline: "The pieces our customers come back for again and again.",
      href: "/best-sellers",
      products: sortProducts(getProducts({ badge: "bestseller" }), "best-selling").slice(0, 10),
    },
    {
      id: "trending",
      label: "Trending Now",
      tagline: "The styles everyone is looking at this week.",
      href: "/trending",
      products: sortProducts(getProducts({ badge: "trending" }), "popular").slice(0, 10),
    },
  ];

  return (
    <>
      <Hero />
      <TrustStrip />
      <CampaignStrip />
      <ShopByCategory />
      <WomenSection />
      <StitchedUnstitched />
      <MenSection />
      <PromoTabs groups={groups} />
      <LimitedEdition />
      <SeasonalFeature />
      <ShopByColor />
      <Offers />
      <StyleQuizCTA />
      <CustomerReviews />
      <SeenOnYou />
      <WhyShopWithUs />
      <StyleClub />
      <JournalPreview />
      <FollowOurStyle />
      <NewsletterSection />
      <RecentlyViewed />
    </>
  );
}
