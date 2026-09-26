"use client";

import { usePathname } from "next/navigation";
import { whatsappLink } from "@/data/site";
import { cn } from "@/lib/format";
import { BrandIcon } from "@/components/brand/BrandIcons";

export function WhatsAppButton() {
  const pathname = usePathname();
  if (pathname.startsWith("/checkout")) return null;
  const onProduct = pathname.startsWith("/product/");
  return (
    <a
      href={whatsappLink("Assalam-o-Alaikum Rang-o-Riwaaj! I'd like some help with ")}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className={cn(
        "fixed right-4 z-[55] flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-black/20 transition-transform hover:scale-105 lg:bottom-6",
        onProduct ? "bottom-24" : "bottom-20",
      )}
    >
      <BrandIcon name="whatsapp" className="h-6 w-6" />
    </a>
  );
}
