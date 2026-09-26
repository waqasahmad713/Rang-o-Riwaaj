"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Building2, CreditCard, Landmark, ShieldCheck, Truck, Wallet } from "lucide-react";
import type { DeliveryMethod, OrderAddress, PaymentMethod } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { createOrderId } from "@/lib/order";
import { site, whatsappLink } from "@/data/site";
import { cn } from "@/lib/format";
import { useAccount, useCart, useOrders, useUI } from "@/store";
import { PaymentIcons } from "@/components/brand/BrandIcons";
import { Logo } from "@/components/brand/Logo";
import { CartLine } from "@/components/cart/CartLine";
import { CouponForm, SummaryRows } from "@/components/cart/OrderSummary";
import { useCartLines } from "@/components/cart/useCartLines";

const STEPS = ["Information", "Delivery", "Payment"] as const;

const CITIES = ["Lahore", "Karachi", "Islamabad", "Rawalpindi", "Faisalabad", "Multan", "Peshawar", "Quetta", "Sialkot", "Gujranwala", "Hyderabad", "Other"];
const PROVINCES = ["Punjab", "Sindh", "Khyber Pakhtunkhwa", "Balochistan", "Islamabad Capital Territory", "Gilgit-Baltistan", "Azad Kashmir"];

export function CheckoutFlow() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [delivery, setDelivery] = useState<DeliveryMethod>("standard");
  const { lines: currentLines, totals: currentTotals, hydrated } = useCartLines(delivery);
  const user = useAccount((s) => s.user);
  const login = useAccount((s) => s.login);
  const addOrder = useOrders((s) => s.add);
  const clear = useCart((s) => s.clear);
  const toast = useUI((s) => s.toast);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  const [addr, setAddr] = useState<OrderAddress>({
    fullName: user?.name ?? "",
    email: user?.email ?? "",
    phone: user?.phone ?? "",
    address: "",
    city: "Lahore",
    province: "Punjab",
    postalCode: "",
    notes: "",
  });
  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [createAccount, setCreateAccount] = useState(!user);

  if (!hydrated) return <div className="min-h-[50vh]" />;

  if (currentLines.length === 0) {
    return (
      <div className="container-x flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
        <p className="font-serif text-3xl">Your bag is empty</p>
        <p className="mt-2 text-sm text-muted">Add a piece before checking out.</p>
        <Link href="/shop" className="btn-primary mt-6">
          Start shopping
        </Link>
      </div>
    );
  }

  const set = (k: keyof OrderAddress, v: string) => setAddr((a) => ({ ...a, [k]: v }));

  const validInfo = addr.fullName.trim().length > 1 && /\S+@\S+\.\S+/.test(addr.email) && addr.phone.replace(/\D/g, "").length >= 10 && addr.address.trim().length > 8;

  const place = () => {
    if (!validInfo) {
      setError("Please complete your delivery details.");
      setStep(0);
      return;
    }
    setPlacing(true);
    const id = createOrderId();
    addOrder({
      id,
      createdAt: new Date().toISOString(),
      items: currentLines.map((l) => ({
        key: l.key,
        productId: l.productId,
        color: l.color,
        size: l.size,
        qty: l.qty,
        name: l.product.name,
        price: l.price,
        image: l.product.images[0].src,
        slug: l.product.slug,
      })),
      address: addr,
      delivery,
      payment,
      subtotal: currentTotals.subtotal,
      discount: currentTotals.discount,
      shipping: currentTotals.shipping,
      total: currentTotals.total,
      coupon: currentTotals.coupon?.code,
    });
    if (createAccount) login({ name: addr.fullName, email: addr.email, phone: addr.phone, styleClub: user?.styleClub });
    clear();
    toast(`Order ${id} placed`);
    router.push(`/order/${id}`);
  };

  return (
    <div className="min-h-dvh bg-sand">
      <div className="border-b border-line bg-ivory">
        <div className="container-x flex h-16 items-center justify-between">
          <Logo compact />
          <p className="flex items-center gap-1.5 text-xs text-muted">
            <ShieldCheck className="h-4 w-4 text-success" /> Secure checkout
          </p>
        </div>
      </div>

      <ol className="container-x flex gap-2 py-6 text-[11px] font-semibold tracking-[0.16em] uppercase sm:gap-6">
        {STEPS.map((s, i) => (
          <li key={s} className="flex items-center gap-2">
            <button
              onClick={() => i < step && setStep(i)}
              className={cn(i === step ? "text-maroon" : i < step ? "text-ink underline" : "text-muted")}
              disabled={i > step}
            >
              <span className="mr-1.5">{i + 1}.</span>
              {s}
            </button>
            {i < STEPS.length - 1 && <span className="hidden text-line sm:inline">—</span>}
          </li>
        ))}
      </ol>

      <div className="container-x grid gap-10 pb-20 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="border border-line bg-ivory p-5 sm:p-8">
          {step === 0 && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!validInfo) return setError("Please fill in your name, email, phone and address.");
                setError("");
                setStep(1);
              }}
            >
              <h1 className="font-serif text-3xl">Customer information</h1>
              <p className="mt-2 text-sm text-muted">Checkout as a guest — or save your details for next time.</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                <Field label="Full name" id="fullName" value={addr.fullName} onChange={(v) => set("fullName", v)} autoComplete="name" required />
                <Field label="Email" id="email" type="email" value={addr.email} onChange={(v) => set("email", v)} autoComplete="email" required />
                <Field label="Phone / WhatsApp" id="phone" type="tel" value={addr.phone} onChange={(v) => set("phone", v)} autoComplete="tel" required />
                <div>
                  <label htmlFor="city" className="label">
                    City
                  </label>
                  <select id="city" className="input" value={addr.city} onChange={(e) => set("city", e.target.value)}>
                    {CITIES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Street address" id="address" value={addr.address} onChange={(v) => set("address", v)} autoComplete="street-address" required />
                </div>
                <div>
                  <label htmlFor="province" className="label">
                    Province
                  </label>
                  <select id="province" className="input" value={addr.province} onChange={(e) => set("province", e.target.value)}>
                    {PROVINCES.map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <Field label="Postal code (optional)" id="postal" value={addr.postalCode ?? ""} onChange={(v) => set("postalCode", v)} autoComplete="postal-code" />
                <div className="sm:col-span-2">
                  <label htmlFor="notes" className="label">
                    Order notes
                  </label>
                  <textarea id="notes" className="input min-h-24" value={addr.notes ?? ""} onChange={(e) => set("notes", e.target.value)} placeholder="Gate code, preferred courier, gift message…" />
                </div>
              </div>
              {!user && (
                <label className="mt-5 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={createAccount} onChange={(e) => setCreateAccount(e.target.checked)} />
                  Save my details for order history and faster checkout
                </label>
              )}
              {error && (
                <p className="mt-3 text-sm text-danger" role="alert">
                  {error}
                </p>
              )}
              <div className="mt-8 flex flex-wrap justify-between gap-3">
                <Link href="/cart" className="btn-outline">
                  Back to bag
                </Link>
                <button className="btn-primary">Continue to delivery</button>
              </div>
            </form>
          )}

          {step === 1 && (
            <div>
              <h1 className="font-serif text-3xl">Delivery</h1>
              <p className="mt-2 text-sm text-muted">Nationwide delivery across Pakistan. Dispatch within 24–48 hours.</p>
              <ul className="mt-8 space-y-3">
                {(
                  [
                    ["standard", "Standard", `${site.shipping.standardDays[0]}–${site.shipping.standardDays[1]} working days`, currentTotals.shipping === 0 && delivery === "standard" ? "Free" : formatPrice(site.shipping.standardFee)],
                    ["express", "Express", `${site.shipping.expressDays[0]}–${site.shipping.expressDays[1]} working days`, formatPrice(site.shipping.expressFee)],
                  ] as const
                ).map(([id, title, days, price]) => (
                  <li key={id}>
                    <label className={cn("flex cursor-pointer items-start gap-4 border p-4 transition-colors", delivery === id ? "border-ink bg-sand" : "border-line hover:border-ink")}>
                      <input type="radio" name="delivery" checked={delivery === id} onChange={() => setDelivery(id)} className="mt-1" />
                      <Truck className="mt-0.5 h-5 w-5 text-maroon" aria-hidden="true" />
                      <span className="flex-1">
                        <span className="block font-semibold">{title}</span>
                        <span className="text-sm text-muted">{days}</span>
                      </span>
                      <span className="font-semibold">{price}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap justify-between gap-3">
                <button onClick={() => setStep(0)} className="btn-outline">
                  Back
                </button>
                <button onClick={() => setStep(2)} className="btn-primary">
                  Continue to payment
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="font-serif text-3xl">Payment</h1>
              <p className="mt-2 text-sm text-muted">Pay on delivery or choose an online method. Card and wallet charges are simulated until a payment gateway is connected.</p>
              <ul className="mt-8 space-y-3">
                {(
                  [
                    ["cod", "Cash on delivery", "Pay the courier when your order arrives.", Landmark],
                    ["card", "Credit / debit card", "Visa, Mastercard and local debit — encrypted checkout.", CreditCard],
                    ["wallet", "JazzCash / Easypaisa", "Pay from your mobile wallet.", Wallet],
                    ["bank", "Bank transfer", "We'll WhatsApp account details after you place the order.", Building2],
                  ] as const
                ).map(([id, title, text, Icon]) => (
                  <li key={id}>
                    <label className={cn("flex cursor-pointer items-start gap-4 border p-4 transition-colors", payment === id ? "border-ink bg-sand" : "border-line hover:border-ink")}>
                      <input type="radio" name="payment" checked={payment === id} onChange={() => setPayment(id)} className="mt-1" />
                      <Icon className="mt-0.5 h-5 w-5 text-maroon" aria-hidden="true" />
                      <span>
                        <span className="block font-semibold">{title}</span>
                        <span className="text-sm text-muted">{text}</span>
                      </span>
                    </label>
                  </li>
                ))}
              </ul>
              {payment === "card" && (
                <div className="mt-6 grid gap-3 border border-line bg-sand p-4 sm:grid-cols-2">
                  <Field label="Name on card" id="ccname" value="" onChange={() => {}} autoComplete="cc-name" />
                  <Field label="Card number" id="ccnum" value="" onChange={() => {}} autoComplete="cc-number" />
                  <Field label="Expiry" id="ccexp" value="" onChange={() => {}} autoComplete="cc-exp" />
                  <Field label="CVC" id="cccvc" value="" onChange={() => {}} autoComplete="cc-csc" />
                  <p className="sm:col-span-2 text-xs text-muted">Demo fields only — no card is charged. Connect a payment provider when you go live.</p>
                </div>
              )}
              <p className="mt-6 text-xs leading-relaxed text-muted">
                By placing this order you agree to our{" "}
                <Link href="/terms" className="underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="underline">
                  Privacy Policy
                </Link>
                .
              </p>
              <div className="mt-8 flex flex-wrap justify-between gap-3">
                <button onClick={() => setStep(1)} className="btn-outline">
                  Back
                </button>
                <button onClick={place} disabled={placing} className="btn-accent">
                  {placing ? "Placing order…" : `Place order · ${formatPrice(currentTotals.total)}`}
                </button>
              </div>
              <a href={whatsappLink("I need help placing an order.")} className="mt-4 block text-center text-xs underline" target="_blank" rel="noopener noreferrer">
                Need help? WhatsApp us
              </a>
            </div>
          )}
        </div>

        <aside className="h-fit border border-line bg-ivory p-5 lg:sticky lg:top-6 sm:p-6">
          <h2 className="font-serif text-2xl">Your bag</h2>
          <ul className="mt-2 divide-y divide-line">
            {currentLines.map((l) => (
              <CartLine key={l.key} line={l} compact />
            ))}
          </ul>
          <div className="mt-4">
            <CouponForm subtotal={currentTotals.subtotal} />
          </div>
          <div className="mt-5">
            <SummaryRows totals={currentTotals} />
          </div>
          <PaymentIcons className="mt-5 justify-center" />
        </aside>
      </div>
    </div>
  );
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  autoComplete,
  required,
}: {
  label: string;
  id: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  autoComplete?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label htmlFor={id} className="label">
        {label}
      </label>
      <input id={id} type={type} value={value} onChange={(e) => onChange(e.target.value)} autoComplete={autoComplete} required={required} className="input" />
    </div>
  );
}
