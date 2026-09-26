"use client";

import Link from "next/link";
import Image from "next/image";
import { CheckCircle2 } from "lucide-react";
import { formatDate, formatPrice } from "@/lib/format";
import { STATUSES, statusIndex, statusOf } from "@/lib/order";
import { site, whatsappLink } from "@/data/site";
import { cn } from "@/lib/format";
import { useHydrated } from "@/lib/hooks";
import { useOrders } from "@/store";
import { PageHero } from "@/components/pages/PageHero";

const payLabel = { cod: "Cash on delivery", card: "Card", bank: "Bank transfer", wallet: "Mobile wallet" } as const;

export function OrderConfirmation({ id }: { id: string }) {
  const hydrated = useHydrated();
  const order = useOrders((s) => s.orders.find((o) => o.id.toLowerCase() === id.toLowerCase()));

  if (!hydrated) return <div className="min-h-[40vh]" />;

  if (!order) {
    return (
      <>
        <PageHero title="Order not found" text="This confirmation lives in this browser. If you placed the order on another device, use track order with your order number." crumbs={[{ label: "Home", href: "/" }, { label: "Order" }]} />
        <div className="container-x py-16">
          <Link href="/track-order" className="btn-primary">
            Track an order
          </Link>
        </div>
      </>
    );
  }

  const status = statusOf(order);
  const idx = statusIndex(status);

  return (
    <>
      <PageHero
        eyebrow="Thank you"
        title={`Order ${order.id}`}
        text="We've received your order. A confirmation will also arrive by SMS and email when the store is connected to live fulfilment."
        crumbs={[{ label: "Home", href: "/" }, { label: "Account", href: "/account" }, { label: order.id }]}
      />
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[1.2fr_0.8fr] lg:py-16">
        <div>
          <div className="flex items-start gap-3 border border-line bg-white p-6">
            <CheckCircle2 className="h-7 w-7 shrink-0 text-success" />
            <div>
              <h2 className="font-serif text-2xl">Your order is confirmed</h2>
              <p className="mt-2 text-sm text-ink-soft">
                Placed {formatDate(order.createdAt, { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}.{" "}
                {order.payment === "cod" ? "Pay the courier when it arrives." : `Payment method: ${payLabel[order.payment]}.`}
              </p>
            </div>
          </div>

          <h3 className="mt-10 font-serif text-2xl">Tracking</h3>
          <ol className="mt-5 grid gap-0 sm:grid-cols-6">
            {STATUSES.map((s, i) => (
              <li key={s.id} className="relative pb-6 sm:pb-0">
                <span className={cn("block h-1 w-full", i <= idx ? "bg-maroon" : "bg-line")} />
                <p className={cn("mt-2 text-[11px] font-semibold tracking-wide uppercase", i <= idx ? "text-ink" : "text-muted")}>{s.label}</p>
              </li>
            ))}
          </ol>

          <h3 className="mt-10 font-serif text-2xl">Items</h3>
          <ul className="mt-4 divide-y divide-line border border-line bg-white">
            {order.items.map((it) => (
              <li key={it.key} className="flex gap-4 p-4">
                <Link href={`/product/${it.slug}`} className="relative aspect-[3/4] w-16 shrink-0 bg-sand">
                  <Image src={it.image} alt={it.name} fill sizes="64px" className="object-cover" />
                </Link>
                <div className="min-w-0 flex-1">
                  <Link href={`/product/${it.slug}`} className="font-medium hover:underline">
                    {it.name}
                  </Link>
                  <p className="text-xs text-muted">
                    {it.color} · {it.size} · Qty {it.qty}
                  </p>
                </div>
                <p className="text-sm font-semibold">{formatPrice(it.price * it.qty)}</p>
              </li>
            ))}
          </ul>
        </div>

        <aside className="h-fit border border-line bg-white p-6">
          <h2 className="font-serif text-2xl">Delivery to</h2>
          <address className="mt-3 space-y-1 text-sm leading-relaxed not-italic text-ink-soft">
            <span className="block">{order.address.fullName}</span>
            <span className="block">{order.address.address}</span>
            <span className="block">
              {order.address.city}, {order.address.province}
            </span>
            <span className="block">{order.address.phone}</span>
            <span className="block">{order.address.email}</span>
          </address>
          <dl className="mt-6 space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted">Subtotal</dt>
              <dd>{formatPrice(order.subtotal)}</dd>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-success">
                <dt>Discounts</dt>
                <dd>−{formatPrice(order.discount)}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-muted">Delivery ({order.delivery})</dt>
              <dd>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</dd>
            </div>
            <div className="flex justify-between border-t border-line pt-3 font-semibold">
              <dt>Total</dt>
              <dd>{formatPrice(order.total)}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-col gap-2">
            <Link href={`/track-order?id=${order.id}`} className="btn-primary">
              Track this order
            </Link>
            <a href={whatsappLink(`Hi, I have a question about order ${order.id}.`)} className="btn-outline" target="_blank" rel="noopener noreferrer">
              WhatsApp support
            </a>
            <Link href="/shop" className="text-center text-xs font-semibold tracking-[0.14em] uppercase underline">
              Continue shopping
            </Link>
          </div>
          <p className="mt-6 text-xs text-muted">{site.contact.hours}. Easy {site.exchangeDays}-day exchange on eligible items.</p>
        </aside>
      </div>
    </>
  );
}
