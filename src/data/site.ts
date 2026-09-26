import type { CollectionTag } from "@/lib/types";

export const u = (id: string) => `https://images.unsplash.com/${id}`;

export const site = {
  name: "Rang-o-Riwaaj",
  tagline: "Colour, Craft & Tradition",
  description:
    "Rang-o-Riwaaj is a Pakistani fashion house offering women's pret, unstitched lawn and embroidered suits, and men's unstitched kurtas, shalwar kameez and sherwani fabrics — designed with heritage craft and made for modern life.",
  shortAbout:
    "Heritage-inspired women's pret and premium unstitched fabrics for women and men, crafted with care in Pakistan.",
  url: "https://www.rangoriwaaj.pk",
  currency: "PKR",
  locale: "en-PK",
  contact: {
    whatsapp: "923195430110",
    phoneDisplay: "0319 5430110",
    phoneHref: "tel:+923195430110",
    email: "hello@rangoriwaaj.pk",
    hours: "Mon – Sat, 10:00 am – 8:00 pm",
    address: "Pakistan · Nationwide delivery",
  },
  social: {
    instagram: { handle: "@Rang-o-Riwaaj", url: "https://www.instagram.com/Rang-o-Riwaaj" },
    facebook: { handle: "Rang-o-Riwaaj", url: "https://www.facebook.com/Rang-o-Riwaaj" },
    // Profiles below were not provided yet — replace with the real URLs.
    tiktok: { handle: "@rangoriwaaj", url: "https://www.tiktok.com/@rangoriwaaj" },
    pinterest: { handle: "rangoriwaaj", url: "https://www.pinterest.com/rangoriwaaj" },
    youtube: { handle: "@rangoriwaaj", url: "https://www.youtube.com/@rangoriwaaj" },
  },
  shipping: {
    freeThreshold: 5000,
    standardFee: 250,
    expressFee: 450,
    standardDays: [3, 5] as [number, number],
    expressDays: [1, 2] as [number, number],
  },
  exchangeDays: 7,
} as const;

export const whatsappLink = (message?: string) =>
  `https://wa.me/${site.contact.whatsapp}${message ? `?text=${encodeURIComponent(message)}` : ""}`;

/** Edit these to change the rotating announcement bar. */
export const announcements: { text: string; href?: string }[] = [
  { text: "Free delivery on orders above Rs. 5,000 — nationwide", href: "/shipping" },
  { text: "The Eid Edit is here — explore the new festive collection", href: "/eid-collection" },
  { text: "Weekend Sale: up to 30% off selected pret", href: "/sale" },
  { text: "Easy 7-day exchange on all stitched & unstitched orders", href: "/returns" },
];

export const mainNav: {
  label: string;
  href: string;
  columns?: { title: string; links: { label: string; href: string }[] }[];
  feature?: { title: string; image: string; href: string };
}[] = [
  { label: "Home", href: "/" },
  {
    label: "Women",
    href: "/women",
    columns: [
      {
        title: "By Occasion",
        links: [
          { label: "Casual Wear", href: "/women/casual-wear" },
          { label: "Formal Wear", href: "/women/formal-wear" },
          { label: "Party Wear", href: "/women/party-wear" },
          { label: "Wedding Wear", href: "/women/wedding-wear" },
        ],
      },
      {
        title: "By Style",
        links: [
          { label: "Embroidered", href: "/women/embroidered" },
          { label: "Printed", href: "/women/printed" },
          { label: "2 Piece", href: "/women/2-piece" },
          { label: "3 Piece", href: "/women/3-piece" },
        ],
      },
      {
        title: "Accessories",
        links: [
          { label: "Khussa & Footwear", href: "/accessories" },
          { label: "Jewellery", href: "/accessories" },
          { label: "Clutches & Potlis", href: "/accessories" },
        ],
      },
    ],
    feature: { title: "The Eid Edit", image: u("photo-1756483560049-e7b2208f99a0"), href: "/eid-collection" },
  },
  {
    label: "Men",
    href: "/men",
    columns: [
      {
        title: "Unstitched Menswear",
        links: [
          { label: "Shalwar Kameez", href: "/men/shalwar-kameez" },
          { label: "Kurta", href: "/men/kurta" },
          { label: "Casual Wear", href: "/men/casual-wear" },
          { label: "Formal Wear", href: "/men/formal-wear" },
        ],
      },
      {
        title: "Occasion",
        links: [
          { label: "Wedding Wear", href: "/men/wedding-wear" },
          { label: "New Arrivals", href: "/men/new-arrivals" },
        ],
      },
    ],
    feature: { title: "Groom's Edit", image: u("photo-1760080838961-4208536db385"), href: "/men/wedding-wear" },
  },
  {
    label: "Stitched",
    href: "/stitched",
    columns: [
      {
        title: "Ready to Wear",
        links: [
          { label: "Ready-to-Wear", href: "/stitched/ready-to-wear" },
          { label: "Ready-Made Suits", href: "/stitched/ready-made-suits" },
          { label: "Pret Wear", href: "/stitched/pret-wear" },
          { label: "Stitched 2 Piece", href: "/stitched/stitched-2-piece" },
          { label: "Stitched 3 Piece", href: "/stitched/stitched-3-piece" },
        ],
      },
    ],
  },
  {
    label: "Unstitched",
    href: "/unstitched",
    columns: [
      {
        title: "By Pieces",
        links: [
          { label: "2 Piece", href: "/unstitched/2-piece" },
          { label: "3 Piece", href: "/unstitched/3-piece" },
        ],
      },
      {
        title: "By Fabric",
        links: [
          { label: "Lawn", href: "/unstitched/lawn" },
          { label: "Cotton", href: "/unstitched/cotton" },
          { label: "Linen", href: "/unstitched/linen" },
          { label: "Khaddar", href: "/unstitched/khaddar" },
          { label: "Embroidered Fabric", href: "/unstitched/embroidered-fabric" },
        ],
      },
    ],
  },
  { label: "New Arrivals", href: "/new-arrivals" },
  { label: "Best Sellers", href: "/best-sellers" },
  { label: "Sale", href: "/sale" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export interface Campaign {
  slug: string;
  tag: CollectionTag;
  title: string;
  subtitle: string;
  image: string;
  href: string;
}

export const campaigns: Campaign[] = [
  {
    slug: "eid",
    tag: "eid",
    title: "Eid Collection",
    subtitle: "Festive embroidery in jewel tones",
    image: u("photo-1756483560049-e7b2208f99a0"),
    href: "/eid-collection",
  },
  {
    slug: "wedding",
    tag: "wedding",
    title: "Wedding Collection",
    subtitle: "Bridal, baraat & walima edits",
    image: u("photo-1747847471528-7b95ea7a4c39"),
    href: "/wedding-collection",
  },
  {
    slug: "summer",
    tag: "summer",
    title: "Summer Collection",
    subtitle: "Breathable lawn & cotton",
    image: u("photo-1745313452052-0e4e341f326c"),
    href: "/summer-collection",
  },
  {
    slug: "winter",
    tag: "winter",
    title: "Winter Collection",
    subtitle: "Khaddar, linen & warm hues",
    image: u("photo-1733731402878-09226b46c4f1"),
    href: "/winter-collection",
  },
  {
    slug: "festive",
    tag: "festive",
    title: "Festive Collection",
    subtitle: "Mehndi, dholki & celebrations",
    image: u("photo-1759840278381-bf7d5e332050"),
    href: "/festive-collection",
  },
];

/** Change `activeSeason` to switch the homepage seasonal feature. */
export const seasonalFeature = {
  activeSeason: "eid" as CollectionTag,
  eyebrow: "Seasonal Collection",
  title: "The Eid Edit",
  description:
    "Hand-finished embroidery, jewel-toned chiffon and breezy festive lawn — curated pieces for Chaand Raat, Eid mornings and every celebration after.",
  image: u("photo-1786596552158-fb0aa2d260ba"),
  href: "/eid-collection",
};

export const heroSlides = [
  {
    eyebrow: "New Season · Eid Edit",
    title: "Style That Defines You",
    text: "Discover thoughtfully designed eastern wear for every occasion — from everyday pret to heirloom-worthy wedding wear.",
    image: u("photo-1747847471528-7b95ea7a4c39"),
    imageAlt: "Model in an intricately embroidered red and gold bridal outfit by Rang-o-Riwaaj",
    primary: { label: "Shop Now", href: "/women" },
    secondary: { label: "Explore Collection", href: "/eid-collection" },
  },
  {
    eyebrow: "Menswear",
    title: "Tailored in Tradition",
    text: "Crisp unstitched shalwar kameez and hand-embroidered sherwani fabrics — tailor for a confident fit.",
    image: u("photo-1760080838961-4208536db385"),
    imageAlt: "White embroidered sherwani styled with a red turban",
    primary: { label: "Shop Men", href: "/men" },
    secondary: { label: "Groom's Edit", href: "/men/wedding-wear" },
  },
  {
    eyebrow: "Unstitched",
    title: "Your Fabric, Your Fit",
    text: "Premium lawn, khaddar and embroidered fabrics — tailor-ready and made to be made yours.",
    image: u("photo-1771098206724-8cf3018e2d90"),
    imageAlt: "Stacks of colourful printed unstitched fabrics",
    primary: { label: "Shop Unstitched", href: "/unstitched" },
    secondary: { label: "Lawn Collection", href: "/unstitched/lawn" },
  },
];

export const offers = [
  {
    title: "Buy 2, Save 10%",
    text: "Add any two items to your bag and a 10% bundle discount applies automatically.",
    cta: "Build your bundle",
    href: "/shop",
    tone: "maroon",
  },
  {
    title: "Free Delivery",
    text: "Complimentary nationwide delivery on every order above Rs. 5,000.",
    cta: "Start shopping",
    href: "/new-arrivals",
    tone: "sand",
  },
  {
    title: "Weekend Sale",
    text: "Selected pret and unstitched styles at up to 30% off, while stock lasts.",
    cta: "Shop the sale",
    href: "/sale",
    tone: "ink",
  },
  {
    title: "First Order: 10% Off",
    text: "New here? Use code WELCOME10 at checkout on your first order.",
    cta: "Use WELCOME10",
    href: "/shop",
    tone: "gold",
  },
  {
    title: "Limited-Time Offers",
    text: "Seasonal markdowns refreshed regularly — the real price, clearly shown.",
    cta: "See offers",
    href: "/sale",
    tone: "emerald",
  },
] as const;

export interface Coupon {
  code: string;
  label: string;
  type: "percent" | "fixed" | "shipping";
  value: number;
  minSubtotal?: number;
}

export const coupons: Coupon[] = [
  { code: "WELCOME10", label: "10% off your first order", type: "percent", value: 10 },
  { code: "RANG15", label: "15% off orders above Rs. 12,000", type: "percent", value: 15, minSubtotal: 12000 },
  { code: "EID500", label: "Rs. 500 off orders above Rs. 6,000", type: "fixed", value: 500, minSubtotal: 6000 },
  { code: "FREESHIP", label: "Free delivery on any order", type: "shipping", value: 0 },
];

export const bundleDiscount = { minUnits: 2, percent: 10 };

export const trustPoints = [
  { icon: "BadgeCheck", title: "Authentic Products", text: "Original Rang-o-Riwaaj designs, never replicas." },
  { icon: "ShieldCheck", title: "Secure Payments", text: "Encrypted checkout, COD, cards & wallets." },
  { icon: "Sparkles", title: "Quality Checked", text: "Every piece inspected by hand before dispatch." },
  { icon: "RefreshCcw", title: "Easy Exchange", text: "7-day hassle-free size & colour exchange." },
  { icon: "Truck", title: "Fast Delivery", text: "3–5 working days nationwide, express available." },
  { icon: "Headset", title: "Responsive Support", text: "Real people on WhatsApp, phone & email." },
] as const;

export const benefits = [
  { icon: "Gem", title: "Premium Quality", text: "Carefully sourced lawn, chiffon, khaddar and silk." },
  { icon: "RefreshCcw", title: "Easy Exchange", text: "Wrong size? Exchange within 7 days." },
  { icon: "ShieldCheck", title: "Secure Payments", text: "Cash on delivery or pay securely online." },
  { icon: "Truck", title: "Fast Delivery", text: "Dispatched within 24–48 hours." },
  { icon: "Headset", title: "Customer Support", text: "WhatsApp us — we reply fast." },
  { icon: "Package", title: "Carefully Packed", text: "Wrapped in tissue in a reusable keepsake box." },
] as const;

export const shopColors = [
  { name: "Black", hex: "#1c1917" },
  { name: "White", hex: "#f7f4ee" },
  { name: "Beige", hex: "#d9c7a7" },
  { name: "Maroon", hex: "#6b1e2e" },
  { name: "Emerald Green", hex: "#1f6b4f" },
  { name: "Navy Blue", hex: "#1e2a4a" },
  { name: "Mustard", hex: "#c9a227" },
  { name: "Pink", hex: "#e8a0b4" },
  { name: "Sky Blue", hex: "#8ec5e8" },
  { name: "Brown", hex: "#7a5236" },
  { name: "Burgundy", hex: "#800020" },
  { name: "Red", hex: "#b3261e" },
];

export const ugc = [
  { image: u("photo-1780247723311-2dae151784d1"), handle: "@ayesha.k", product: "firoza-embroidered-pret" },
  { image: u("photo-1780504863283-3157e6d141e1"), handle: "@hira_styles", product: "gulabi-embroidered-pret" },
  { image: u("photo-1764928947261-f5687e0faa4a"), handle: "@mahnoor.m", product: "noor-printed-kurta-set" },
  { image: u("photo-1768033976371-0e4ef195dfa2"), handle: "@sana.writes", product: "gulbahar-floral-kurta-trouser" },
  { image: u("photo-1785613590014-23875bff09f2"), handle: "@hamza.fits", product: "safed-classic-shalwar-kameez" },
  { image: u("photo-1767785829347-cc13bd969514"), handle: "@zoya.edits", product: "kaleidoscope-printed-kurta" },
  { image: u("photo-1684814070823-97e0b9e99c69"), handle: "@mehndi.diaries", product: "sabz-bahar-party-wear" },
  { image: u("photo-1786596552096-c782a23e00b3"), handle: "@thesisters.pk", product: "surkh-jora-festive-3-piece" },
];

export const instagramGrid = [
  { image: u("photo-1756483560049-e7b2208f99a0"), alt: "Festive look with traditional jewellery" },
  { image: u("photo-1724856605022-106d6dd6e842"), alt: "Close-up of red and gold bridal embroidery" },
  { image: u("photo-1774437791807-362e58f09a2c"), alt: "Two men in traditional kurtas" },
  { image: u("photo-1771098206750-6be5aef4f503"), alt: "Rolls of printed unstitched fabric" },
  { image: u("photo-1777980157996-6f689bb393ab"), alt: "Embroidered red velvet khussa" },
  { image: u("photo-1741847639057-b51a25d42892"), alt: "Pink floral kurta and trouser" },
];
