import type { JournalPost } from "@/lib/types";
import { u } from "./site";

export const journal: JournalPost[] = [
  {
    slug: "how-to-style-a-3-piece-suit",
    title: "How to Style a 3-Piece Suit",
    excerpt: "Five ways to wear your shirt, trouser and dupatta — from office-ready to wedding-worthy.",
    image: u("photo-1759840278381-bf7d5e332050"),
    category: "Styling",
    readMinutes: 5,
    date: "2026-09-10",
    body: [
      {
        paragraphs: [
          "A 3-piece suit is the backbone of every eastern wardrobe. With a few small changes to how you drape, pair and accessorise it, one suit can take you from a Monday meeting to a Saturday mehndi.",
        ],
      },
      {
        heading: "1. The classic drape",
        paragraphs: ["Pin the dupatta on one shoulder and let it fall straight at the back. It's elegant, practical and flatters every silhouette."],
      },
      {
        heading: "2. Office-ready",
        paragraphs: ["Swap the matching trouser for a straight cigarette pant in a neutral, fold the dupatta neatly around your neck and add minimal studs."],
      },
      {
        heading: "3. Festive layering",
        paragraphs: ["For dholkis and dinners, drape the dupatta across both arms and pair with statement jhumkas, a potli bag and embroidered khussa."],
        bullets: ["Choose one statement accessory", "Match metal tones to embroidery", "Keep makeup soft if the suit is heavily printed"],
      },
      {
        heading: "4. Mix and match",
        paragraphs: ["Pair the shirt with a contrasting dupatta from another suit — a printed shirt with a solid chiffon dupatta instantly looks new."],
      },
    ],
    relatedLinks: [
      { label: "Shop 3-piece suits", href: "/women/3-piece" },
      { label: "Shop accessories", href: "/accessories" },
    ],
  },
  {
    slug: "best-colors-for-this-season",
    title: "Best Colours for This Season",
    excerpt: "Emerald, maroon, mustard and soft pinks — the palette defining this festive season.",
    image: u("photo-1733731405209-d454771a8297"),
    category: "Trends",
    readMinutes: 4,
    date: "2026-09-02",
    body: [
      {
        paragraphs: [
          "This season is all about jewel tones balanced with soft neutrals. Here are the shades we can't stop designing with — and how to wear them.",
        ],
      },
      { heading: "Emerald green", paragraphs: ["Rich and regal, emerald flatters every skin tone and glows under evening lights. Pair it with antique gold."] },
      { heading: "Maroon & burgundy", paragraphs: ["The eternal wedding colour. Go tonal with a maroon dupatta, or contrast with ivory for a modern take."] },
      { heading: "Mustard", paragraphs: ["The mayun and mehndi hero. Balance it with green or pink accents for a joyful, traditional palette."] },
      { heading: "Blush pink", paragraphs: ["Soft, romantic and perfect for daytime events and Eid mornings."] },
    ],
    relatedLinks: [{ label: "Shop by colour", href: "/shop" }],
  },
  {
    slug: "stitched-vs-unstitched",
    title: "Stitched vs Unstitched: Which One Should You Choose?",
    excerpt: "Convenience or customisation? A simple guide to choosing between ready-to-wear and unstitched.",
    image: u("photo-1771098206724-8cf3018e2d90"),
    category: "Guides",
    readMinutes: 6,
    date: "2026-08-22",
    body: [
      {
        paragraphs: [
          "Both stitched and unstitched clothing have a place in your wardrobe. The right choice depends on your timeline, your fit preferences and how much you enjoy the tailoring process.",
        ],
      },
      {
        heading: "Choose stitched (ready-to-wear) if…",
        paragraphs: ["You need an outfit quickly, you're a standard size, or you love designer silhouettes exactly as imagined."],
        bullets: ["Wear it the day it arrives", "Designer cuts and finishing", "No tailor visits"],
      },
      {
        heading: "Choose unstitched if…",
        paragraphs: ["You want a perfect personal fit, love choosing your own neckline and sleeves, or have a trusted tailor."],
        bullets: ["Fully customised fit and design", "Great value per metre", "Extra fabric for alterations"],
      },
      { heading: "Our tip", paragraphs: ["Keep a few pret pieces for last-minute plans, and stitch unstitched suits ahead of big seasons like Eid and wedding season."] },
    ],
    relatedLinks: [
      { label: "Shop Ready to Wear", href: "/stitched" },
      { label: "Shop Unstitched", href: "/unstitched" },
    ],
  },
  {
    slug: "how-to-choose-the-right-size",
    title: "How to Choose the Right Size",
    excerpt: "Measure once, order with confidence. A step-by-step guide to finding your size.",
    image: u("photo-1762777777819-4d9aa5529368"),
    category: "Guides",
    readMinutes: 4,
    date: "2026-08-10",
    body: [
      { paragraphs: ["The easiest way to find your perfect size is to measure a garment you already love, then compare it to our size chart."] },
      {
        heading: "What to measure",
        paragraphs: ["Use a soft measuring tape and keep it snug but not tight."],
        bullets: ["Bust/chest: fullest part", "Waist: natural waistline", "Hips: fullest part", "Shirt length: shoulder to hem"],
      },
      { heading: "Between sizes?", paragraphs: ["Choose the larger size for relaxed silhouettes and the smaller size for fitted cuts. Still unsure? WhatsApp us your measurements."] },
    ],
    relatedLinks: [{ label: "View size guide", href: "/size-guide" }],
  },
  {
    slug: "wedding-outfit-ideas",
    title: "Wedding Outfit Ideas for Every Function",
    excerpt: "Mayun, mehndi, baraat and walima — what to wear, whether you're the bride, groom or guest.",
    image: u("photo-1630526720753-aa4e71acf67d"),
    category: "Weddings",
    readMinutes: 7,
    date: "2026-07-28",
    body: [
      { paragraphs: ["Pakistani weddings are a week of celebrations, each with its own mood. Here's how to dress for every event."] },
      { heading: "Mayun", paragraphs: ["Yellows and mustards, simple cuts and fresh flowers. Keep it light and comfortable."] },
      { heading: "Mehndi", paragraphs: ["Vibrant greens, pinks and oranges with gota and mirror work. Shararas and ghararas are made for dancing."] },
      { heading: "Baraat", paragraphs: ["The grandest look — reds, maroons and heavy embroidery for the bride, formal jewel tones for guests, sherwanis for the groom."] },
      { heading: "Walima", paragraphs: ["Softer, elegant palettes: ivory, pastels, champagne and silver."] },
    ],
    relatedLinks: [
      { label: "Wedding collection", href: "/wedding-collection" },
      { label: "Men's wedding wear", href: "/men/wedding-wear" },
    ],
  },
  {
    slug: "how-to-care-for-your-clothes",
    title: "How to Care for Your Clothes",
    excerpt: "Keep your lawn vivid and your embroidery pristine with these simple care habits.",
    image: u("photo-1717585679395-bbe39b5fb6bc"),
    category: "Care",
    readMinutes: 4,
    date: "2026-07-12",
    body: [
      { paragraphs: ["A little care goes a long way. These habits keep your favourite pieces looking new for years."] },
      { heading: "Lawn & cotton", paragraphs: ["Wash in cold water, inside out, and dry in shade. Wash darks separately for the first few washes."] },
      { heading: "Embroidered & formal wear", paragraphs: ["Dry clean when possible. Steam instead of ironing, and never iron directly on embellishment."] },
      { heading: "Storage", paragraphs: ["Store formals folded in muslin, away from sunlight. Avoid plastic covers — fabric needs to breathe."] },
    ],
    relatedLinks: [{ label: "Returns & exchange", href: "/returns" }],
  },
];

export const getPost = (slug: string) => journal.find((p) => p.slug === slug);
