import { siFacebook, siInstagram, siMastercard, siPinterest, siTiktok, siVisa, siWhatsapp, siX, siYoutube } from "simple-icons";
import { site } from "@/data/site";
import { cn } from "@/lib/format";

const icons = {
  instagram: siInstagram,
  facebook: siFacebook,
  tiktok: siTiktok,
  pinterest: siPinterest,
  youtube: siYoutube,
  whatsapp: siWhatsapp,
  x: siX,
  visa: siVisa,
  mastercard: siMastercard,
};
export type BrandIconName = keyof typeof icons;

export function BrandIcon({ name, className, color }: { name: BrandIconName; className?: string; color?: boolean }) {
  const icon = icons[name];
  return (
    <svg viewBox="0 0 24 24" className={cn("h-5 w-5", className)} fill={color ? `#${icon.hex}` : "currentColor"} aria-hidden="true">
      <path d={icon.path} />
    </svg>
  );
}

export const socialList = [
  { name: "instagram" as const, label: "Instagram", ...site.social.instagram },
  { name: "facebook" as const, label: "Facebook", ...site.social.facebook },
  { name: "tiktok" as const, label: "TikTok", ...site.social.tiktok },
  { name: "pinterest" as const, label: "Pinterest", ...site.social.pinterest },
  { name: "youtube" as const, label: "YouTube", ...site.social.youtube },
];

export function SocialLinks({ className, iconClass }: { className?: string; iconClass?: string }) {
  return (
    <ul className={cn("flex items-center gap-2", className)}>
      {socialList.map((s) => (
        <li key={s.name}>
          <a
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${s.label} — ${s.handle}`}
            className={cn("flex h-10 w-10 items-center justify-center rounded-full border border-current/20 transition-colors hover:bg-current/10", iconClass)}
          >
            <BrandIcon name={s.name} className="h-4 w-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}

export function PaymentIcons({ className }: { className?: string }) {
  const pill = "flex h-8 items-center justify-center rounded-sm border border-line bg-white px-2.5 text-[10px] font-bold tracking-wide text-ink";
  return (
    <ul className={cn("flex flex-wrap items-center gap-2", className)} aria-label="Accepted payment methods">
      <li className={pill} title="Visa">
        <BrandIcon name="visa" color className="h-5 w-8" />
        <span className="sr-only">Visa</span>
      </li>
      <li className={pill} title="Mastercard">
        <BrandIcon name="mastercard" color className="h-5 w-7" />
        <span className="sr-only">Mastercard</span>
      </li>
      <li className={cn(pill, "text-[#c8102e]")}>JazzCash</li>
      <li className={cn(pill, "text-[#1f9a4a]")}>easypaisa</li>
      <li className={pill}>Bank Transfer</li>
      <li className={pill}>Cash on Delivery</li>
    </ul>
  );
}
