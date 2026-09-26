"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CatalogOverlay } from "@/lib/catalog";
import { setCatalogOverlay } from "@/lib/catalog";
import type { CartItem, Order, Review } from "@/lib/types";

const opts = (name: string) => ({ name: `rr-${name}`, skipHydration: true, version: 1 });

/* ─────────── Cart ─────────── */
interface CartState {
  items: CartItem[];
  coupon?: string;
  add: (i: Omit<CartItem, "key">) => void;
  setQty: (key: string, qty: number) => void;
  remove: (key: string) => void;
  clear: () => void;
  setCoupon: (code?: string) => void;
}
export const cartKey = (productId: string, color: string, size: string) => `${productId}|${color}|${size}`;

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      coupon: undefined,
      add: (i) =>
        set((s) => {
          const key = cartKey(i.productId, i.color, i.size);
          const existing = s.items.find((x) => x.key === key);
          if (existing) return { items: s.items.map((x) => (x.key === key ? { ...x, qty: Math.min(10, x.qty + i.qty) } : x)) };
          return { items: [...s.items, { ...i, key }] };
        }),
      setQty: (key, qty) => set((s) => ({ items: s.items.map((x) => (x.key === key ? { ...x, qty: Math.max(1, Math.min(10, qty)) } : x)) })),
      remove: (key) => set((s) => ({ items: s.items.filter((x) => x.key !== key) })),
      clear: () => set({ items: [], coupon: undefined }),
      setCoupon: (coupon) => set({ coupon }),
    }),
    opts("cart"),
  ),
);

/* ─────────── Wishlist ─────────── */
interface ListState {
  ids: string[];
  toggle: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
}
export const useWishlist = create<ListState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const has = get().ids.includes(id);
        set({ ids: has ? get().ids.filter((x) => x !== id) : [id, ...get().ids] });
        return !has;
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    opts("wishlist"),
  ),
);

/* ─────────── Compare (max 4) ─────────── */
export const COMPARE_MAX = 4;
export const useCompare = create<ListState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) => {
        const ids = get().ids;
        if (ids.includes(id)) {
          set({ ids: ids.filter((x) => x !== id) });
          return false;
        }
        if (ids.length >= COMPARE_MAX) return false;
        set({ ids: [...ids, id] });
        return true;
      },
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
    }),
    opts("compare"),
  ),
);

/* ─────────── Recently viewed ─────────── */
interface RecentState {
  ids: string[];
  push: (id: string) => void;
}
export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      push: (id) => set((s) => ({ ids: [id, ...s.ids.filter((x) => x !== id)].slice(0, 12) })),
    }),
    opts("recent"),
  ),
);

/* ─────────── Orders ─────────── */
interface OrdersState {
  orders: Order[];
  add: (o: Order) => void;
}
export const useOrders = create<OrdersState>()(
  persist(
    (set) => ({
      orders: [],
      add: (o) => set((s) => ({ orders: [o, ...s.orders] })),
    }),
    opts("orders"),
  ),
);

/* ─────────── Account ─────────── */
export interface Account {
  name: string;
  email: string;
  phone?: string;
  styleClub: boolean;
  birthday?: string;
}
interface AccountState {
  user: Account | null;
  newsletter: string[];
  login: (a: Omit<Account, "styleClub"> & { styleClub?: boolean }) => void;
  update: (a: Partial<Account>) => void;
  logout: () => void;
  subscribe: (email: string) => void;
}
export const useAccount = create<AccountState>()(
  persist(
    (set) => ({
      user: null,
      newsletter: [],
      login: (a) => set({ user: { styleClub: false, ...a } }),
      update: (a) => set((s) => (s.user ? { user: { ...s.user, ...a } } : s)),
      logout: () => set({ user: null }),
      subscribe: (email) => set((s) => ({ newsletter: Array.from(new Set([...s.newsletter, email.toLowerCase()])) })),
    }),
    opts("account"),
  ),
);

/* ─────────── User-submitted reviews ─────────── */
interface ReviewState {
  reviews: Review[];
  add: (r: Review) => void;
}
export const useUserReviews = create<ReviewState>()(
  persist(
    (set) => ({
      reviews: [],
      add: (r) => set((s) => ({ reviews: [r, ...s.reviews] })),
    }),
    opts("reviews"),
  ),
);

/* ─────────── UI (not persisted) ─────────── */
export interface Toast {
  id: number;
  message: string;
  action?: { label: string; href: string };
}
interface UIState {
  cartOpen: boolean;
  searchOpen: boolean;
  menuOpen: boolean;
  quickViewId: string | null;
  sizeGuide: null | "women" | "men";
  toasts: Toast[];
  set: (p: Partial<Omit<UIState, "set" | "toast" | "dismiss">>) => void;
  toast: (message: string, action?: Toast["action"]) => void;
  dismiss: (id: number) => void;
}
let toastId = 0;
export const useUI = create<UIState>()((set) => ({
  cartOpen: false,
  searchOpen: false,
  menuOpen: false,
  quickViewId: null,
  sizeGuide: null,
  toasts: [],
  set: (p) => set(p),
  toast: (message, action) => {
    const id = ++toastId;
    set((s) => ({ toasts: [...s.toasts.slice(-2), { id, message, action }] }));
    setTimeout(() => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })), 3500);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

/* ─────────── Announcements (admin-editable, falls back to site.ts) ─────────── */
export interface Banner {
  text: string;
  href?: string;
}
interface BannerState {
  items: Banner[] | null;
  setItems: (items: Banner[]) => void;
  reset: () => void;
}
export const useBanners = create<BannerState>()(
  persist(
    (set) => ({
      items: null,
      setItems: (items) => set({ items }),
      reset: () => set({ items: null }),
    }),
    opts("banners"),
  ),
);

/* ─────────── Contact inquiries ─────────── */
export interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  topic: string;
  message: string;
  createdAt: string;
}
interface InquiryState {
  items: Inquiry[];
  add: (i: Inquiry) => void;
}
export const useInquiries = create<InquiryState>()(
  persist(
    (set) => ({
      items: [],
      add: (i) => set((s) => ({ items: [i, ...s.items] })),
    }),
    opts("inquiries"),
  ),
);

/* ─────────── Custom catalogue (mirrors /admin uploads) ─────────── */
interface CatalogState extends CatalogOverlay {
  apply: (next: CatalogOverlay) => void;
}
export const useCatalog = create<CatalogState>()((set) => ({
  custom: [],
  overrides: {},
  apply: (next) => {
    const overlay = { custom: next.custom ?? [], overrides: next.overrides ?? {} };
    setCatalogOverlay(overlay);
    set(overlay);
  },
}));

export const persistedStores = [useCart, useWishlist, useCompare, useRecent, useOrders, useAccount, useUserReviews, useBanners, useInquiries];
