"use client";

import { useState } from "react";
import { useInquiries, useUI } from "@/store";

export function ContactForm() {
  const add = useInquiries((s) => s.add);
  const toast = useUI((s) => s.toast);
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="border border-line bg-white p-8">
        <h2 className="font-serif text-2xl">Message received</h2>
        <p className="mt-3 text-sm text-ink-soft">Thank you. We typically reply within a few hours during shop hours. For something urgent, WhatsApp is faster.</p>
        <button onClick={() => setSent(false)} className="btn-outline mt-6">
          Send another
        </button>
      </div>
    );
  }

  return (
    <form
      className="border border-line bg-white p-6 sm:p-8"
      onSubmit={(e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        add({
          id: `inq-${Date.now()}`,
          name: String(f.get("name") ?? ""),
          email: String(f.get("email") ?? ""),
          phone: String(f.get("phone") ?? ""),
          topic: String(f.get("topic") ?? "General"),
          message: String(f.get("message") ?? ""),
          createdAt: new Date().toISOString(),
        });
        toast("Message sent — we'll reply soon.");
        setSent(true);
      }}
    >
      <h2 className="font-serif text-2xl">Write to us</h2>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="cname" className="label">
            Name
          </label>
          <input id="cname" name="name" className="input" required autoComplete="name" />
        </div>
        <div>
          <label htmlFor="cemail" className="label">
            Email
          </label>
          <input id="cemail" name="email" type="email" className="input" required autoComplete="email" />
        </div>
        <div>
          <label htmlFor="cphone" className="label">
            Phone
          </label>
          <input id="cphone" name="phone" className="input" autoComplete="tel" />
        </div>
        <div>
          <label htmlFor="ctopic" className="label">
            Topic
          </label>
          <select id="ctopic" name="topic" className="input">
            <option>Order help</option>
            <option>Size & fit</option>
            <option>Exchange</option>
            <option>Wholesale</option>
            <option>General</option>
          </select>
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="cmsg" className="label">
            Message
          </label>
          <textarea id="cmsg" name="message" className="input min-h-32" required minLength={10} />
        </div>
      </div>
      <button className="btn-primary mt-6">Send message</button>
    </form>
  );
}
