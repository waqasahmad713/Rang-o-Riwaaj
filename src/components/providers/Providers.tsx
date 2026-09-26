"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { GitCompareArrows, X } from "lucide-react";
import { persistedStores, useCatalog, useCompare, useUI } from "@/store";
import { getProductsByIds } from "@/lib/catalog";
import { useHydrated } from "@/lib/hooks";
import { CartDrawer } from "@/components/cart/CartDrawer";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { SearchOverlay } from "@/components/search/SearchOverlay";
import { QuickView } from "@/components/product/QuickView";
import { Modal } from "@/components/ui/Overlay";
import { SizeGuideContent } from "@/components/product/SizeGuide";

export function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const set = useUI((s) => s.set);

  const applyCatalog = useCatalog((s) => s.apply);

  useEffect(() => {
    persistedStores.forEach((s) => s.persist.rehydrate());
    fetch("/api/catalog")
      .then((r) => r.json())
      .then((data) => applyCatalog(data))
      .catch(() => undefined);
  }, [applyCatalog]);

  useEffect(() => {
    set({ menuOpen: false, searchOpen: false, quickViewId: null });
  }, [pathname, set]);

  return (
    <>
      {children}
      <MobileMenu />
      <CartDrawer />
      <SearchOverlay />
      <QuickView />
      <SizeGuideModal />
      <CompareTray />
      <Toasts />
    </>
  );
}

function SizeGuideModal() {
  const which = useUI((s) => s.sizeGuide);
  const set = useUI((s) => s.set);
  return (
    <Modal open={Boolean(which)} onClose={() => set({ sizeGuide: null })} title="Size Guide">
      <div className="p-5 sm:p-8">{which && <SizeGuideContent which={which} />}</div>
    </Modal>
  );
}

function Toasts() {
  const toasts = useUI((s) => s.toasts);
  const dismiss = useUI((s) => s.dismiss);
  return (
    <div aria-live="polite" className="pointer-events-none fixed inset-x-0 bottom-20 z-[90] flex flex-col items-center gap-2 px-4 lg:bottom-6">
      {toasts.map((t) => (
        <div key={t.id} className="animate-fade-up pointer-events-auto flex w-full max-w-sm items-center justify-between gap-3 bg-ink px-4 py-3 text-sm text-ivory shadow-xl">
          <span>{t.message}</span>
          <span className="flex shrink-0 items-center gap-2">
            {t.action && (
              <Link href={t.action.href} onClick={() => dismiss(t.id)} className="text-xs font-semibold tracking-[0.14em] text-gold-light uppercase hover:underline">
                {t.action.label}
              </Link>
            )}
            <button onClick={() => dismiss(t.id)} aria-label="Dismiss" className="text-ivory/60 hover:text-ivory">
              <X className="h-4 w-4" />
            </button>
          </span>
        </div>
      ))}
    </div>
  );
}

function CompareTray() {
  const hydrated = useHydrated();
  const ids = useCompare((s) => s.ids);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const pathname = usePathname();
  if (!hydrated || ids.length === 0 || pathname === "/compare" || pathname.startsWith("/checkout")) return null;
  const items = getProductsByIds(ids);
  return (
    <div className="animate-fade-up fixed right-4 bottom-20 z-[60] hidden items-center gap-3 border border-line bg-ivory p-3 shadow-xl md:flex lg:bottom-6">
      <GitCompareArrows className="h-5 w-5 text-maroon" aria-hidden="true" />
      <ul className="flex gap-2">
        {items.map((p) => (
          <li key={p.id} className="relative h-14 w-11 bg-sand">
            <Image src={p.images[0].src} alt={p.name} fill sizes="44px" className="object-cover" />
            <button onClick={() => remove(p.id)} aria-label={`Remove ${p.name} from compare`} className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink text-ivory">
              <X className="h-3 w-3" />
            </button>
          </li>
        ))}
      </ul>
      <Link href="/compare" className="btn-primary px-4 py-2.5">
        Compare ({ids.length})
      </Link>
      <button onClick={clear} className="text-xs text-muted underline hover:text-ink">
        Clear
      </button>
    </div>
  );
}
