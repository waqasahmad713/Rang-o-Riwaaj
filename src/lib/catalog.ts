import { products as seedProducts } from "@/data/products";
import type { Criteria, Product } from "./types";

/* Single read-access layer for catalogue data. Custom items from /admin merge in via overlay. */

export type CatalogOverride = Partial<Pick<Product, "name" | "price" | "compareAtPrice" | "images" | "stock" | "shortDescription">>;

export interface CatalogOverlay {
  custom: Product[];
  overrides: Record<string, CatalogOverride>;
}

let overlay: CatalogOverlay = { custom: [], overrides: {} };

export const setCatalogOverlay = (next: CatalogOverlay) => {
  overlay = { custom: next.custom ?? [], overrides: next.overrides ?? {} };
  tagCache.clear();
};

export const getCatalogOverlay = () => overlay;

export const mergeCatalog = (base: Product[] = seedProducts, extra: CatalogOverlay = overlay): Product[] => {
  const apply = (p: Product) => {
    const o = extra.overrides[p.id];
    return o ? { ...p, ...o } : p;
  };
  const customIds = new Set(extra.custom.map((p) => p.id));
  const custom = extra.custom.map(apply);
  const seeded = base.filter((p) => !customIds.has(p.id)).map(apply);
  return [...custom, ...seeded];
};

const derivedTags = (p: Product): string[] => {
  const t: string[] = [];
  if (p.construction === "stitched") {
    t.push("ready-to-wear");
    if (p.department === "women" && p.category !== "wedding-wear") t.push("pret-wear");
    if ((p.pieces ?? 1) >= 2) t.push("ready-made-suits");
    if (p.pieces === 2) t.push("stitched-2-piece", "2-piece");
    if (p.pieces === 3) t.push("stitched-3-piece", "3-piece");
    const formal = ["formal-wear", "party-wear", "wedding-wear"].includes(p.category) || p.tags.includes("formal");
    t.push(formal ? "formal" : "casual");
  }
  if (p.construction === "unstitched") {
    if (p.pieces === 2) t.push("2-piece");
    if (p.pieces === 3) t.push("3-piece");
    const fabric = p.fabric.toLowerCase();
    if (fabric.includes("lawn")) t.push("lawn");
    if (fabric.includes("cotton")) t.push("cotton");
    if (fabric.includes("linen")) t.push("linen");
    if (fabric.includes("khaddar")) t.push("khaddar");
    if (/embroider|jamawar|silk|jacquard|velvet|zardozi|resham/.test(fabric)) t.push("embroidered-fabric");
  }
  return t;
};

const tagCache = new Map<string, Set<string>>();
export const tagsOf = (p: Product) => {
  let s = tagCache.get(p.id);
  if (!s) {
    s = new Set([p.category, ...p.tags, ...derivedTags(p)]);
    tagCache.set(p.id, s);
  }
  return s;
};

export const matches = (p: Product, c: Criteria) => {
  if (c.department && p.department !== c.department) return false;
  if (c.construction && p.construction !== c.construction) return false;
  if (c.badge && !p.badges.includes(c.badge)) return false;
  if (c.collection && !p.collections.includes(c.collection)) return false;
  if (c.onSale && !isOnSale(p)) return false;
  if (c.categories?.length) {
    const tags = tagsOf(p);
    if (!c.categories.some((cat) => tags.has(cat))) return false;
  }
  return true;
};

export const getAllProducts = () => mergeCatalog();
export const getProducts = (c: Criteria = {}) => getAllProducts().filter((p) => matches(p, c));
export const getProductBySlug = (slug: string) => getAllProducts().find((p) => p.slug === slug);
export const getProductById = (id: string) => getAllProducts().find((p) => p.id === id);
export const getProductsByIds = (ids: string[]) =>
  ids.map((id) => getProductById(id)).filter((p): p is Product => Boolean(p));

export const isOnSale = (p: Product) => Boolean(p.compareAtPrice && p.compareAtPrice > p.price);
export const discountPercent = (p: Product) =>
  isOnSale(p) ? Math.round(((p.compareAtPrice! - p.price) / p.compareAtPrice!) * 100) : 0;

export const totalStock = (p: Product) => Object.values(p.stock).reduce((a, b) => a + b, 0);
export const sizeStock = (p: Product, size: string) => p.stock[size] ?? 0;
export const LOW_STOCK = 5;
export const isLowStock = (p: Product) => {
  const t = totalStock(p);
  return t > 0 && t <= LOW_STOCK;
};
export const inStock = (p: Product) => totalStock(p) > 0;

export const isNew = (p: Product) => p.badges.includes("new");

export type SortKey = "newest" | "best-selling" | "price-asc" | "price-desc" | "popular" | "rating" | "featured";

export const sortOptions: { value: SortKey; label: string }[] = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "best-selling", label: "Best Selling" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "popular", label: "Most Popular" },
  { value: "rating", label: "Highest Rated" },
];

export const sortProducts = (list: Product[], key: SortKey) => {
  const arr = [...list];
  switch (key) {
    case "newest":
      return arr.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
    case "best-selling":
      return arr.sort((a, b) => b.sold - a.sold);
    case "price-asc":
      return arr.sort((a, b) => a.price - b.price);
    case "price-desc":
      return arr.sort((a, b) => b.price - a.price);
    case "popular":
      return arr.sort((a, b) => b.views - a.views);
    case "rating":
      return arr.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    default:
      return arr.sort((a, b) => score(b) - score(a));
  }
};

const score = (p: Product) =>
  p.sold * 2 + p.views / 20 + (isNew(p) ? 400 : 0) + (p.badges.includes("trending") ? 250 : 0) + (inStock(p) ? 0 : -5000);

export const similarity = (a: Product, b: Product) => {
  if (a.id === b.id) return -1;
  let s = 0;
  if (a.department === b.department) s += 4;
  if (a.construction === b.construction) s += 2;
  if (a.category === b.category) s += 3;
  const ta = tagsOf(a);
  tagsOf(b).forEach((t) => ta.has(t) && (s += 1));
  a.collections.forEach((c) => b.collections.includes(c) && (s += 1));
  if (a.fabric === b.fabric) s += 1;
  const ratio = Math.min(a.price, b.price) / Math.max(a.price, b.price);
  s += ratio * 2;
  return s;
};

export const getRelated = (p: Product, n = 8) =>
  getAllProducts()
    .filter((x) => x.id !== p.id && x.department !== "accessories")
    .map((x) => ({ x, s: similarity(p, x) }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map(({ x }) => x);

/** Recommendations weighted by what the shopper recently viewed. */
export const getRecommendations = (seedIds: string[], excludeIds: string[] = [], n = 8) => {
  const seeds = getProductsByIds(seedIds);
  const pool = getAllProducts().filter((p) => !excludeIds.includes(p.id) && !seedIds.includes(p.id) && p.department !== "accessories");
  if (!seeds.length) return sortProducts(pool, "featured").slice(0, n);
  return pool
    .map((p) => ({ p, s: seeds.reduce((acc, sd, i) => acc + similarity(sd, p) / (i + 1), 0) + p.rating }))
    .sort((a, b) => b.s - a.s)
    .slice(0, n)
    .map(({ p }) => p);
};

export const getCompleteTheLook = (p: Product) => {
  const explicit = getProductsByIds(p.completeTheLook ?? []);
  if (explicit.length) return explicit;
  return getAllProducts()
    .filter((x) => x.department === "accessories" && x.collections.some((c) => p.collections.includes(c)))
    .slice(0, 4);
};

const norm = (s: string) => s.toLowerCase().normalize("NFKD").replace(/[^a-z0-9\s-]/g, "");

export const searchProducts = (q: string, limit?: number) => {
  const terms = norm(q).split(/\s+/).filter(Boolean);
  if (!terms.length) return [];
  const results = getAllProducts()
    .map((p) => {
      const hay = norm(
        [p.name, p.category, p.fabric, p.department, p.construction, ...p.tags, ...p.colors.map((c) => c.name), ...p.collections].join(" "),
      );
      const name = norm(p.name);
      let s = 0;
      for (const t of terms) {
        if (name.includes(t)) s += 5;
        else if (hay.includes(t)) s += 2;
        else return { p, s: 0 };
      }
      return { p, s: s + p.sold / 1000 };
    })
    .filter((r) => r.s > 0)
    .sort((a, b) => b.s - a.s)
    .map((r) => r.p);
  return limit ? results.slice(0, limit) : results;
};

export const popularSearches = ["Lawn 3 piece", "Embroidered", "Kurta", "Wedding", "Khussa", "Maroon", "Shalwar Kameez"];

export const categoryLabel = (slug: string) =>
  slug
    .split("-")
    .map((w) => (/^\d/.test(w) ? w : w[0].toUpperCase() + w.slice(1)))
    .join(" ");

export const productSubtitle = (p: Product) => {
  const dept = p.department === "women" ? "Women" : p.department === "men" ? "Men" : "Accessories";
  const type = p.construction === "unstitched" ? "Unstitched" : p.construction === "stitched" ? "Ready to Wear" : categoryLabel(p.category);
  return p.department === "accessories" ? `${dept} · ${type}` : `${dept} · ${type} · ${categoryLabel(p.category)}`;
};
