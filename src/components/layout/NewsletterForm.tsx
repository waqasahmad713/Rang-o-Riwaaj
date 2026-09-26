"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { useAccount } from "@/store";
import { cn } from "@/lib/format";

export function NewsletterForm({ tone = "dark", id = "newsletter-email" }: { tone?: "dark" | "light"; id?: string }) {
  const subscribe = useAccount((s) => s.subscribe);
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "done" | "error">("idle");

  if (state === "done")
    return (
      <p className={cn("flex items-center gap-2 text-sm", tone === "light" ? "text-ivory" : "text-success")} role="status">
        <Check className="h-4 w-4" /> You&apos;re on the list — welcome to Rang-o-Riwaaj.
      </p>
    );

  return (
    <form
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) return setState("error");
        subscribe(email);
        setState("done");
      }}
    >
      <label htmlFor={id} className="sr-only">
        Email address
      </label>
      <div className="flex">
        <input
          id={id}
          type="email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "error") setState("idle");
          }}
          placeholder="Your email address"
          autoComplete="email"
          aria-invalid={state === "error"}
          aria-describedby={state === "error" ? `${id}-err` : undefined}
          className={cn(
            "w-full border px-4 py-3.5 text-sm focus:outline-none",
            tone === "light" ? "border-ivory/30 bg-white/5 text-ivory placeholder:text-ivory/50 focus:border-ivory" : "border-line bg-white text-ink placeholder:text-muted/70 focus:border-ink",
          )}
        />
        <button className={cn("btn shrink-0 px-6", tone === "light" ? "bg-ivory text-ink hover:bg-gold-light" : "bg-ink text-ivory hover:bg-maroon")}>Subscribe</button>
      </div>
      {state === "error" && (
        <p id={`${id}-err`} className="mt-2 text-xs text-danger" role="alert">
          Please enter a valid email address.
        </p>
      )}
    </form>
  );
}
