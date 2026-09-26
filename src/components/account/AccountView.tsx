"use client";

import Link from "next/link";
import { useState } from "react";
import { formatDate, formatPrice } from "@/lib/format";
import { statusOf } from "@/lib/order";
import { useHydrated } from "@/lib/hooks";
import { useAccount, useOrders } from "@/store";
import { PageHero } from "@/components/pages/PageHero";

export function AccountView() {
  const hydrated = useHydrated();
  const user = useAccount((s) => s.user);
  const login = useAccount((s) => s.login);
  const update = useAccount((s) => s.update);
  const logout = useAccount((s) => s.logout);
  const orders = useOrders((s) => s.orders);
  const [error, setError] = useState("");

  if (!hydrated) return <div className="min-h-[40vh]" />;

  if (!user) {
    return (
      <>
        <PageHero eyebrow="Account" title="Welcome back" text="Sign in to see your orders, wishlist and Style Club. New here? Create an account in a moment — guest checkout is always available." crumbs={[{ label: "Home", href: "/" }, { label: "Account" }]} />
        <div className="container-x max-w-lg py-12">
          <form
            className="border border-line bg-white p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              const name = String(f.get("name") ?? "").trim();
              const email = String(f.get("email") ?? "").trim();
              const phone = String(f.get("phone") ?? "").trim();
              if (!name || !email) return setError("Please add your name and email.");
              login({ name, email, phone });
            }}
          >
            <h2 className="font-serif text-2xl">Sign in or create account</h2>
            <p className="mt-2 text-sm text-muted">No password for this demo store — your details stay in this browser.</p>
            <div className="mt-6 space-y-4">
              <div>
                <label htmlFor="name" className="label">
                  Full name
                </label>
                <input id="name" name="name" className="input" autoComplete="name" required />
              </div>
              <div>
                <label htmlFor="email" className="label">
                  Email
                </label>
                <input id="email" name="email" type="email" className="input" autoComplete="email" required />
              </div>
              <div>
                <label htmlFor="phone" className="label">
                  Phone
                </label>
                <input id="phone" name="phone" type="tel" className="input" autoComplete="tel" />
              </div>
            </div>
            {error && <p className="mt-3 text-sm text-danger">{error}</p>}
            <button className="btn-primary mt-6 w-full">Continue</button>
          </form>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero eyebrow="Account" title={`Hello, ${user.name.split(" ")[0]}`} text="Manage your profile, Style Club and order history." crumbs={[{ label: "Home", href: "/" }, { label: "Account" }]} />
      <div className="container-x grid gap-10 py-12 lg:grid-cols-[0.85fr_1.15fr] lg:py-16">
        <div className="space-y-6">
          <form
            className="border border-line bg-white p-6"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              update({
                name: String(f.get("name") ?? user.name),
                email: String(f.get("email") ?? user.email),
                phone: String(f.get("phone") ?? ""),
                birthday: String(f.get("birthday") ?? ""),
              });
            }}
          >
            <h2 className="font-serif text-2xl">Profile</h2>
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="pname" className="label">
                  Name
                </label>
                <input id="pname" name="name" className="input" defaultValue={user.name} />
              </div>
              <div>
                <label htmlFor="pemail" className="label">
                  Email
                </label>
                <input id="pemail" name="email" type="email" className="input" defaultValue={user.email} />
              </div>
              <div>
                <label htmlFor="pphone" className="label">
                  Phone
                </label>
                <input id="pphone" name="phone" className="input" defaultValue={user.phone ?? ""} />
              </div>
              <div>
                <label htmlFor="bday" className="label">
                  Birthday (Style Club gift)
                </label>
                <input id="bday" name="birthday" type="date" className="input" defaultValue={user.birthday ?? ""} />
              </div>
            </div>
            <button className="btn-outline mt-5">Save profile</button>
          </form>

          <div className="border border-line bg-sand p-6">
            <h2 className="font-serif text-2xl">Style Club</h2>
            <p className="mt-2 text-sm text-ink-soft">Early access to new collections, special discounts, birthday offers and exclusive launches.</p>
            {user.styleClub ? (
              <p className="mt-4 text-sm font-semibold text-success">You&apos;re a member. Watch your inbox for early edits.</p>
            ) : (
              <button onClick={() => update({ styleClub: true })} className="btn-primary mt-5">
                Join the Style Club
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link href="/wishlist" className="btn-outline">
              Wishlist
            </Link>
            <Link href="/track-order" className="btn-outline">
              Track order
            </Link>
            <button onClick={logout} className="btn-outline">
              Sign out
            </button>
          </div>
        </div>

        <div>
          <h2 className="font-serif text-3xl">Order history</h2>
          {orders.length === 0 ? (
            <p className="mt-4 text-sm text-muted">
              No orders yet.{" "}
              <Link href="/shop" className="underline">
                Start shopping
              </Link>
              .
            </p>
          ) : (
            <ul className="mt-6 space-y-4">
              {orders.map((o) => (
                <li key={o.id} className="border border-line bg-white p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <Link href={`/order/${o.id}`} className="font-semibold hover:underline">
                      {o.id}
                    </Link>
                    <span className="text-xs uppercase tracking-wider text-maroon">{statusOf(o).replace(/-/g, " ")}</span>
                  </div>
                  <p className="mt-1 text-sm text-muted">
                    {formatDate(o.createdAt)} · {o.items.length} items · {formatPrice(o.total)}
                  </p>
                  <Link href={`/track-order?id=${o.id}`} className="mt-3 inline-block text-xs font-semibold tracking-[0.14em] uppercase underline">
                    Track
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </>
  );
}
