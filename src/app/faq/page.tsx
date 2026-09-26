import type { Metadata } from "next";
import Link from "next/link";
import { PolicyPage } from "@/components/pages/PolicyPage";

export const metadata: Metadata = { title: "FAQs", description: "Sizing, delivery, unstitched fabric and payment questions." };

const faqs = [
  { q: "Do you offer cash on delivery?", a: "Yes, nationwide. You can also pay by card, JazzCash, Easypaisa or bank transfer." },
  { q: "When will my order ship?", a: "Within 24–48 hours of confirmation. Standard delivery is 3–5 working days; express is 1–2." },
  { q: "How do I choose a size?", a: "Use the size guide on each product and on the Size Guide page. Between sizes, go up for relaxed cuts." },
  { q: "What does unstitched include?", a: "Each listing shows fabric type, length, number of pieces, print or embroidery details and season." },
  { q: "Can I use more than one coupon?", a: "One coupon per order. Bundle discount (Buy 2, save 10%) stacks with a coupon where the totals allow." },
  { q: "Do you ship outside Pakistan?", a: "Not yet. We're focused on nationwide delivery first — WhatsApp us if you need a personal shopper quote." },
];

export default function Page() {
  return (
    <PolicyPage eyebrow="Help" title="FAQs">
      {faqs.map((f) => (
        <details key={f.q} className="group border-b border-line py-4">
          <summary className="cursor-pointer list-none font-semibold [&::-webkit-details-marker]:hidden">{f.q}</summary>
          <p className="mt-2 !mb-0">{f.a}</p>
        </details>
      ))}
      <p className="!mt-10">
        Still stuck?{" "}
        <Link href="/contact" className="underline">
          Contact us
        </Link>{" "}
        or read{" "}
        <Link href="/shipping" className="underline">
          shipping
        </Link>{" "}
        and{" "}
        <Link href="/returns" className="underline">
          returns
        </Link>
        .
      </p>
    </PolicyPage>
  );
}
