"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export function AdminLogin() {
  const router = useRouter();
  const params = useSearchParams();
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="mx-auto max-w-md border border-line bg-white p-6 sm:p-8"
      onSubmit={async (e) => {
        e.preventDefault();
        setBusy(true);
        setError("");
        try {
          const res = await fetch("/api/admin/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ password }),
          });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Could not sign in.");
          router.replace(params.get("next") || "/admin");
          router.refresh();
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not sign in.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <label htmlFor="admin-password" className="label">
        Password
      </label>
      <div className="relative">
        <input
          id="admin-password"
          type={showPassword ? "text" : "password"}
          name="password"
          autoComplete="current-password"
          className="input pr-20"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoFocus
        />
        <button
          type="button"
          className="absolute inset-y-0 right-0 flex items-center gap-1.5 px-3 text-xs font-semibold tracking-[0.08em] text-muted uppercase hover:text-ink"
          onClick={() => setShowPassword((v) => !v)}
          aria-label={showPassword ? "Hide password" : "Show password"}
          aria-pressed={showPassword}
        >
          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>
      {error && (
        <p className="mt-3 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <button disabled={busy} className="btn-primary mt-6 w-full">
        {busy ? "Checking…" : "Enter studio"}
      </button>
    </form>
  );
}
