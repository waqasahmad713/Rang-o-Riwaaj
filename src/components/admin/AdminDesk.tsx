"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { announcements, coupons } from "@/data/site";
import { getAllProducts, totalStock } from "@/lib/catalog";
import { formatPrice } from "@/lib/format";
import { useHydrated } from "@/lib/hooks";
import { useBanners, useCatalog, useInquiries, useOrders, type Banner } from "@/store";
import { PageHero } from "@/components/pages/PageHero";
import { ProductForm } from "./ProductForm";

export function AdminDesk() {
  const router = useRouter();
  const hydrated = useHydrated();
  const override = useBanners((s) => s.items);
  const setItems = useBanners((s) => s.setItems);
  const reset = useBanners((s) => s.reset);
  const orders = useOrders((s) => s.orders);
  const inquiries = useInquiries((s) => s.items);
  const applyCatalog = useCatalog((s) => s.apply);
  const custom = useCatalog((s) => s.custom);
  const overrides = useCatalog((s) => s.overrides);
  const products = useMemo(() => getAllProducts(), [custom, overrides]);
  const [draft, setDraft] = useState<Banner[]>([...announcements]);
  const [tab, setTab] = useState<"add" | "products" | "banners" | "orders" | "inbox">("add");

  useEffect(() => {
    if (override?.length) setDraft(override);
  }, [override]);

  const sales = useMemo(() => orders.reduce((s, o) => s + o.total, 0), [orders]);

  if (!hydrated) return <div className="min-h-[40vh]" />;

  return (
    <>
      <PageHero
        eyebrow="Studio"
        title="Store desk"
        text="This is where you upload new clothing — photos, name and price. Published items appear in the shop immediately."
        crumbs={[{ label: "Home", href: "/" }, { label: "Studio" }]}
      />
      <div className="container-x py-10 lg:py-14">
        <div className="mb-6 flex justify-end">
          <button
            type="button"
            className="text-xs font-semibold tracking-[0.14em] text-muted uppercase underline hover:text-ink"
            onClick={async () => {
              await fetch("/api/admin/logout", { method: "POST" });
              window.location.href = "/admin/login";
            }}
          >
            Sign out
          </button>
        </div>
        <dl className="mb-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            ["Products", String(products.length)],
            ["Orders (this device)", String(orders.length)],
            ["Sales recorded", formatPrice(sales)],
            ["Inquiries", String(inquiries.length)],
          ].map(([k, v]) => (
            <div key={k} className="border border-line bg-white p-4">
              <dt className="text-[11px] font-semibold tracking-wider text-muted uppercase">{k}</dt>
              <dd className="mt-1 font-serif text-2xl">{v}</dd>
            </div>
          ))}
        </dl>

        <div className="mb-6 flex flex-wrap gap-2">
          {(["add", "products", "banners", "orders", "inbox"] as const).map((t) => (
            <button key={t} onClick={() => setTab(t)} className={tab === t ? "btn-primary py-2" : "btn-outline py-2"}>
              {t === "add" ? "Add item" : t}
            </button>
          ))}
        </div>

        {tab === "add" && <ProductForm onDone={() => setTab("products")} />}

        {tab === "banners" && (
          <div className="border border-line bg-white p-6">
            <h2 className="font-serif text-2xl">Announcement bar</h2>
            <p className="mt-2 text-sm text-muted">These messages rotate at the top of every page. Saved in this browser until you connect a CMS.</p>
            <ul className="mt-6 space-y-4">
              {draft.map((b, i) => (
                <li key={i} className="grid gap-2 sm:grid-cols-[1fr_200px_auto]">
                  <input className="input" value={b.text} onChange={(e) => setDraft((d) => d.map((x, j) => (j === i ? { ...x, text: e.target.value } : x)))} />
                  <input className="input" value={b.href ?? ""} placeholder="/sale" onChange={(e) => setDraft((d) => d.map((x, j) => (j === i ? { ...x, href: e.target.value || undefined } : x)))} />
                  <button onClick={() => setDraft((d) => d.filter((_, j) => j !== i))} className="text-xs text-danger underline">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-3">
              <button onClick={() => setDraft((d) => [...d, { text: "New announcement" }])} className="btn-outline">
                Add line
              </button>
              <button onClick={() => setItems(draft.filter((d) => d.text.trim()))} className="btn-primary">
                Publish on this device
              </button>
              <button
                onClick={() => {
                  reset();
                  setDraft([...announcements]);
                }}
                className="text-xs underline"
              >
                Reset to defaults
              </button>
            </div>
            <h3 className="mt-10 font-serif text-xl">Active coupons</h3>
            <ul className="mt-3 text-sm text-ink-soft">
              {coupons.map((c) => (
                <li key={c.code}>
                  <strong>{c.code}</strong> — {c.label}
                </li>
              ))}
            </ul>
          </div>
        )}

        {tab === "products" && (
          <div className="overflow-x-auto border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line p-4">
              <p className="text-sm text-muted">Change a price and click Save. Items you uploaded can also be removed.</p>
              <button onClick={() => setTab("add")} className="btn-primary py-2">
                Add item
              </button>
            </div>
            <table className="w-full min-w-[820px] text-left text-sm">
              <thead>
                <tr className="border-b border-ink text-xs uppercase tracking-wider">
                  <th className="p-3">Photo</th>
                  <th className="p-3">SKU</th>
                  <th className="p-3">Name</th>
                  <th className="p-3">Price (Rs.)</th>
                  <th className="p-3">Stock</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {products.map((p) => (
                  <ProductRow
                    key={p.id}
                    product={p}
                    custom={p.id.startsWith("c-")}
                    onSaved={applyCatalog}
                  />
                ))}
              </tbody>
            </table>
          </div>
        )}

        {tab === "orders" && (
          <ul className="space-y-3">
            {orders.length === 0 && <p className="text-sm text-muted">No orders on this device yet.</p>}
            {orders.map((o) => (
              <li key={o.id} className="border border-line bg-white p-4 text-sm">
                <strong>{o.id}</strong> · {formatPrice(o.total)} · {o.address.fullName} · {o.payment}
              </li>
            ))}
          </ul>
        )}

        {tab === "inbox" && (
          <ul className="space-y-3">
            {inquiries.length === 0 && <p className="text-sm text-muted">No contact form messages yet.</p>}
            {inquiries.map((i) => (
              <li key={i.id} className="border border-line bg-white p-4 text-sm">
                <strong>{i.name}</strong> · {i.topic}
                <p className="mt-2 text-ink-soft">{i.message}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

function ProductRow({
  product: p,
  custom,
  onSaved,
}: {
  product: ReturnType<typeof getAllProducts>[number];
  custom: boolean;
  onSaved: (data: { custom: ReturnType<typeof getAllProducts>; overrides: Record<string, { price?: number }> }) => void;
}) {
  const [price, setPrice] = useState(p.price);
  const [saving, setSaving] = useState(false);

  const savePrice = async () => {
    setSaving(true);
    const res = await fetch("/api/catalog", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ overrides: { [p.id]: { price } } }),
    });
    const data = await res.json();
    onSaved(data);
    setSaving(false);
  };

  const remove = async () => {
    if (!confirm(`Remove ${p.name} from the shop?`)) return;
    const res = await fetch(`/api/catalog?id=${p.id}`, { method: "DELETE" });
    onSaved(await res.json());
  };

  return (
    <tr className="border-t border-line">
      <td className="p-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={p.images[0]?.src} alt="" className="h-14 w-11 object-cover" />
      </td>
      <td className="p-3 font-mono text-xs">{p.sku}</td>
      <td className="p-3">
        <a href={`/product/${p.slug}`} className="hover:underline">
          {p.name}
        </a>
        {custom && <span className="ml-2 text-[10px] font-semibold tracking-wider text-maroon uppercase">Yours</span>}
      </td>
      <td className="p-3">
        <div className="flex items-center gap-2">
          <input type="number" className="input w-28 py-1.5" value={price} onChange={(e) => setPrice(Number(e.target.value))} />
          <button onClick={savePrice} disabled={saving || price === p.price} className="text-xs font-semibold underline disabled:opacity-40">
            Save
          </button>
        </div>
      </td>
      <td className="p-3">{totalStock(p)}</td>
      <td className="p-3 text-right">
        {custom && (
          <button onClick={remove} className="text-xs text-danger underline">
            Remove
          </button>
        )}
      </td>
    </tr>
  );
}
