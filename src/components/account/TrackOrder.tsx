"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { formatDate, formatPrice } from "@/lib/format";
import { STATUSES, statusIndex, statusOf } from "@/lib/order";
import { cn } from "@/lib/format";
import { useHydrated } from "@/lib/hooks";
import { useOrders } from "@/store";
import { PageHero } from "@/components/pages/PageHero";

export function TrackOrder() {
  const params = useSearchParams();
  const hydrated = useHydrated();
  const [q, setQ] = useState(params.get("id") ?? "");
  const [lookup, setLookup] = useState(params.get("id") ?? "");
  const order = useOrders((s) => s.orders.find((o) => o.id.toLowerCase() === lookup.trim().toLowerCase()));

  return (
    <>
      <PageHero
        eyebrow="Orders"
        title="Track your order"
        text="Enter the order number from your confirmation (for example RR-184293)."
        crumbs={[{ label: "Home", href: "/" }, { label: "Track order" }]}
      />
      <div className="container-x max-w-2xl py-12">
        <form
          className="flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            setLookup(q);
          }}
        >
          <label htmlFor="oid" className="sr-only">
            Order number
          </label>
          <input id="oid" value={q} onChange={(e) => setQ(e.target.value)} className="input uppercase" placeholder="RR-000000" />
          <button className="btn-primary shrink-0">Track</button>
        </form>

        {hydrated && lookup && !order && <p className="mt-6 text-sm text-danger">We couldn&apos;t find that order in this browser. Check the number or sign in on the device you used to checkout.</p>}

        {hydrated && order && (
          <div className="mt-10 border border-line bg-white p-6">
            <div className="flex flex-wrap justify-between gap-2">
              <h2 className="font-serif text-2xl">{order.id}</h2>
              <Link href={`/order/${order.id}`} className="text-xs font-semibold tracking-wider uppercase underline">
                Full confirmation
              </Link>
            </div>
            <p className="mt-1 text-sm text-muted">
              {formatDate(order.createdAt)} · {formatPrice(order.total)}
            </p>
            <ol className="mt-8 space-y-3">
              {STATUSES.map((s, i) => {
                const active = i <= statusIndex(statusOf(order));
                return (
                  <li key={s.id} className={cn("flex items-center gap-3 text-sm", active ? "text-ink font-medium" : "text-muted")}>
                    <span className={cn("h-2.5 w-2.5 rounded-full", active ? "bg-maroon" : "bg-line")} />
                    {s.label}
                  </li>
                );
              })}
            </ol>
          </div>
        )}
      </div>
    </>
  );
}
