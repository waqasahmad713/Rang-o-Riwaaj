"use client";

import { usePathname } from "next/navigation";
import { Footer } from "./Footer";

export function StoreFooter() {
  const pathname = usePathname();
  return <Footer hidden={pathname.startsWith("/checkout")} />;
}
