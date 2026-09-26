import { Headset, RefreshCcw, Truck, Wallet } from "lucide-react";

const items = [
  { Icon: Truck, title: "Free Delivery", text: "On orders above Rs. 5,000" },
  { Icon: RefreshCcw, title: "Easy Exchange", text: "Within 7 days of delivery" },
  { Icon: Wallet, title: "Cash on Delivery", text: "Plus cards & wallets" },
  { Icon: Headset, title: "WhatsApp Support", text: "Real people, quick replies" },
];

export function TrustStrip() {
  return (
    <section aria-label="Shopping benefits" className="border-y border-line bg-ivory">
      <ul className="container-x grid grid-cols-2 gap-y-6 py-7 lg:grid-cols-4">
        {items.map(({ Icon, title, text }) => (
          <li key={title} className="flex items-center gap-3 lg:justify-center">
            <Icon className="h-6 w-6 shrink-0 text-maroon" strokeWidth={1.4} aria-hidden="true" />
            <span>
              <span className="block text-xs font-semibold tracking-[0.12em] uppercase">{title}</span>
              <span className="block text-xs text-muted">{text}</span>
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
