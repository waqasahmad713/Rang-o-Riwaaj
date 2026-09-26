"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import type { Criteria, Product } from "@/lib/types";
import { categoryLabel, discountPercent, getProducts, inStock, sortOptions, sortProducts, tagsOf, type SortKey } from "@/lib/catalog";
import { useCatalog } from "@/store";
import { cn } from "@/lib/format";
import { Drawer } from "@/components/ui/Overlay";
import { Swatch } from "@/components/ui/primitives";
import { ProductGrid } from "@/components/product/ProductRail";

const PRICE_RANGES = [
  { id: "0-5000", label: "Under Rs. 5,000", min: 0, max: 5000 },
  { id: "5000-10000", label: "Rs. 5,000 – 10,000", min: 5000, max: 10000 },
  { id: "10000-20000", label: "Rs. 10,000 – 20,000", min: 10000, max: 20000 },
  { id: "20000-50000", label: "Rs. 20,000 – 50,000", min: 20000, max: 50000 },
  { id: "50000+", label: "Above Rs. 50,000", min: 50000, max: Infinity },
];
const COLLECTION_LABELS: Record<string, string> = { eid: "Eid", summer: "Summer", winter: "Winter", festive: "Festive", wedding: "Wedding" };
const SIZE_ORDER = ["XS", "S", "M", "L", "XL", "XXL", "Unstitched", "One Size"];

type Filters = {
  category: string[];
  price: string[];
  color: string[];
  size: string[];
  fabric: string[];
  collection: string[];
  availability: string[];
  discount: string[];
  rating: string[];
};
const KEYS: (keyof Filters)[] = ["category", "price", "color", "size", "fabric", "collection", "availability", "discount", "rating"];
const empty = (): Filters => ({ category: [], price: [], color: [], size: [], fabric: [], collection: [], availability: [], discount: [], rating: [] });

function apply(products: Product[], f: Filters) {
  return products.filter((p) => {
    if (f.category.length && !f.category.some((c) => tagsOf(p).has(c))) return false;
    if (f.price.length && !f.price.some((id) => {
      const r = PRICE_RANGES.find((x) => x.id === id)!;
      return p.price >= r.min && p.price < r.max;
    })) return false;
    if (f.color.length && !p.colors.some((c) => f.color.includes(c.name))) return false;
    if (f.size.length && !p.sizes.some((s) => f.size.includes(s) && (p.stock[s] ?? 0) > 0)) return false;
    if (f.fabric.length && !f.fabric.includes(p.fabric)) return false;
    if (f.collection.length && !p.collections.some((c) => f.collection.includes(c))) return false;
    if (f.availability.includes("in-stock") && !inStock(p)) return false;
    if (f.discount.includes("on-sale") && discountPercent(p) === 0) return false;
    if (f.discount.includes("20") && discountPercent(p) < 20) return false;
    if (f.rating.length) {
      const min = Math.min(...f.rating.map(Number));
      if (p.rating < min) return false;
    }
    return true;
  });
}

export function CollectionView({
  products,
  criteria,
  categoryOptions,
  initialSort = "featured",
}: {
  products: Product[];
  criteria?: Criteria;
  categoryOptions?: { slug: string; name: string }[];
  initialSort?: SortKey;
}) {
  const custom = useCatalog((s) => s.custom);
  const overrides = useCatalog((s) => s.overrides);
  const live = useMemo(() => (criteria ? getProducts(criteria) : products), [criteria, products, custom, overrides]);
  const params = useSearchParams();
  const [filters, setFilters] = useState<Filters>(() => {
    const f = empty();
    KEYS.forEach((k) => {
      const v = params.get(k);
      if (v) f[k] = v.split(",").filter(Boolean);
    });
    return f;
  });
  const [sort, setSort] = useState<SortKey>(() => (params.get("sort") as SortKey) || initialSort);
  const [drawer, setDrawer] = useState(false);

  useEffect(() => {
    const qs = new URLSearchParams();
    KEYS.forEach((k) => filters[k].length && qs.set(k, filters[k].join(",")));
    if (sort !== initialSort) qs.set("sort", sort);
    const s = qs.toString();
    window.history.replaceState(null, "", s ? `?${s}` : window.location.pathname);
  }, [filters, sort, initialSort]);

  const options = useMemo(() => {
    const colors = new Map<string, string>();
    const sizes = new Set<string>();
    const fabrics = new Set<string>();
    const cols = new Set<string>();
    const cats = new Set<string>();
    live.forEach((p) => {
      p.colors.forEach((c) => colors.set(c.name, c.hex));
      p.sizes.forEach((s) => sizes.add(s));
      fabrics.add(p.fabric);
      p.collections.forEach((c) => cols.add(c));
      cats.add(p.category);
    });
    return {
      category:
        categoryOptions?.filter((c) => live.some((p) => tagsOf(p).has(c.slug))) ??
        [...cats].map((slug) => ({ slug, name: categoryLabel(slug) })),
      colors: [...colors.entries()].map(([name, hex]) => ({ name, hex })),
      sizes: [...sizes].sort((a, b) => {
        const ia = SIZE_ORDER.indexOf(a);
        const ib = SIZE_ORDER.indexOf(b);
        return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib) || a.localeCompare(b, undefined, { numeric: true });
      }),
      fabrics: [...fabrics].sort(),
      collections: [...cols],
    };
  }, [live, categoryOptions]);

  const result = useMemo(() => sortProducts(apply(live, filters), sort), [live, filters, sort]);
  const activeCount = KEYS.reduce((n, k) => n + filters[k].length, 0);

  const toggle = (k: keyof Filters, v: string) =>
    setFilters((f) => ({ ...f, [k]: f[k].includes(v) ? f[k].filter((x) => x !== v) : [...f[k], v] }));
  const clear = () => setFilters(empty());

  const chips: { k: keyof Filters; v: string; label: string }[] = KEYS.flatMap((k) =>
    filters[k].map((v) => ({
      k,
      v,
      label:
        k === "price"
          ? PRICE_RANGES.find((r) => r.id === v)?.label ?? v
          : k === "category"
            ? options.category.find((c) => c.slug === v)?.name ?? categoryLabel(v)
            : k === "collection"
              ? COLLECTION_LABELS[v] ?? v
              : k === "availability"
                ? "In stock"
                : k === "discount"
                  ? v === "20" ? "20% off or more" : "On sale"
                  : k === "rating"
                    ? `${v}★ & up`
                    : v,
    })),
  );

  const panel = (
    <FilterPanel options={options} filters={filters} toggle={toggle} />
  );

  return (
    <div className="grid gap-10 lg:grid-cols-[250px_1fr]">
      <aside className="hidden lg:block" aria-label="Product filters">
        <div className="sticky top-36">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold tracking-[0.16em] uppercase">Filters</p>
            {activeCount > 0 && (
              <button onClick={clear} className="text-xs text-muted underline hover:text-ink">
                Clear all
              </button>
            )}
          </div>
          <div className="max-h-[calc(100vh-11rem)] overflow-y-auto pr-2">{panel}</div>
        </div>
      </aside>

      <div className="min-w-0">
        <div className="sticky top-16 z-20 -mx-4 mb-6 flex items-center justify-between gap-3 border-b border-line bg-ivory/95 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:static lg:mx-0 lg:border-none lg:bg-transparent lg:px-0 lg:py-0">
          <button onClick={() => setDrawer(true)} className="flex h-10 items-center gap-2 border border-ink px-4 text-xs font-semibold tracking-[0.14em] uppercase lg:hidden">
            <SlidersHorizontal className="h-4 w-4" /> Filter {activeCount > 0 && `(${activeCount})`}
          </button>
          <p className="hidden text-sm text-muted lg:block" aria-live="polite">
            {result.length} {result.length === 1 ? "product" : "products"}
          </p>
          <label className="flex items-center gap-2 text-xs">
            <span className="hidden font-semibold tracking-[0.14em] uppercase sm:inline">Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as SortKey)} className="h-10 border border-line bg-white px-3 text-sm focus:border-ink focus:outline-none" aria-label="Sort products">
              {sortOptions.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {chips.length > 0 && (
          <ul className="mb-6 flex flex-wrap items-center gap-2" aria-label="Active filters">
            {chips.map((c) => (
              <li key={c.k + c.v}>
                <button onClick={() => toggle(c.k, c.v)} className="flex items-center gap-1.5 bg-sand px-3 py-1.5 text-xs hover:bg-sand-deep" aria-label={`Remove filter ${c.label}`}>
                  {c.label} <X className="h-3 w-3" />
                </button>
              </li>
            ))}
            <li>
              <button onClick={clear} className="text-xs underline">
                Clear all
              </button>
            </li>
          </ul>
        )}

        <p className="mb-4 text-sm text-muted lg:hidden" aria-live="polite">
          {result.length} {result.length === 1 ? "product" : "products"}
        </p>

        {result.length ? (
          <ProductGrid products={result} className="md:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4" />
        ) : (
          <div className="flex flex-col items-center gap-4 bg-sand px-6 py-20 text-center">
            <p className="font-serif text-2xl">No styles match these filters</p>
            <p className="text-sm text-muted">Try removing a filter or two to see more.</p>
            <button onClick={clear} className="btn-primary">
              Clear filters
            </button>
          </div>
        )}
      </div>

      <Drawer open={drawer} onClose={() => setDrawer(false)} title="Filter" side="left">
        <div className="flex-1 overflow-y-auto px-5">{panel}</div>
        <div className="grid grid-cols-2 gap-2 border-t border-line p-4">
          <button onClick={clear} className="btn-outline">
            Clear
          </button>
          <button onClick={() => setDrawer(false)} className="btn-primary">
            Show {result.length}
          </button>
        </div>
      </Drawer>
    </div>
  );
}

function Group({ title, children, open = true }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-b border-line py-4">
      <summary className="flex list-none items-center justify-between text-xs font-semibold tracking-[0.14em] uppercase [&::-webkit-details-marker]:hidden">
        {title}
        <span className="text-lg leading-none text-muted transition-transform group-open:rotate-45">+</span>
      </summary>
      <div className="mt-4">{children}</div>
    </details>
  );
}

function Check({ checked, onChange, children }: { checked: boolean; onChange: () => void; children: React.ReactNode }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-ink-soft hover:text-ink">
      <input type="checkbox" checked={checked} onChange={onChange} className="h-4 w-4 accent-maroon" />
      {children}
    </label>
  );
}

function FilterPanel({
  options,
  filters,
  toggle,
}: {
  options: { category: { slug: string; name: string }[]; colors: { name: string; hex: string }[]; sizes: string[]; fabrics: string[]; collections: string[] };
  filters: Filters;
  toggle: (k: keyof Filters, v: string) => void;
}) {
  return (
    <div>
      {options.category.length > 1 && (
        <Group title="Category">
          {options.category.map((c) => (
            <Check key={c.slug} checked={filters.category.includes(c.slug)} onChange={() => toggle("category", c.slug)}>
              {c.name}
            </Check>
          ))}
        </Group>
      )}
      <Group title="Price">
        {PRICE_RANGES.map((r) => (
          <Check key={r.id} checked={filters.price.includes(r.id)} onChange={() => toggle("price", r.id)}>
            {r.label}
          </Check>
        ))}
      </Group>
      <Group title="Colour">
        <div className="flex flex-wrap gap-2">
          {options.colors.map((c) => {
            const on = filters.color.includes(c.name);
            return (
              <button
                key={c.name}
                onClick={() => toggle("color", c.name)}
                aria-pressed={on}
                className={cn("flex items-center gap-2 border px-2.5 py-1.5 text-xs transition-colors", on ? "border-ink bg-ink text-ivory" : "border-line bg-white hover:border-ink")}
              >
                <Swatch hex={c.hex} name={c.name} size={14} /> {c.name}
              </button>
            );
          })}
        </div>
      </Group>
      <Group title="Size">
        <div className="flex flex-wrap gap-2">
          {options.sizes.map((s) => {
            const on = filters.size.includes(s);
            return (
              <button key={s} onClick={() => toggle("size", s)} aria-pressed={on} className={cn("min-w-11 border px-3 py-2 text-xs font-medium", on ? "border-ink bg-ink text-ivory" : "border-line bg-white hover:border-ink")}>
                {s}
              </button>
            );
          })}
        </div>
      </Group>
      <Group title="Fabric" open={false}>
        {options.fabrics.map((f) => (
          <Check key={f} checked={filters.fabric.includes(f)} onChange={() => toggle("fabric", f)}>
            {f}
          </Check>
        ))}
      </Group>
      <Group title="Collection" open={false}>
        {options.collections.map((c) => (
          <Check key={c} checked={filters.collection.includes(c)} onChange={() => toggle("collection", c)}>
            {COLLECTION_LABELS[c] ?? c}
          </Check>
        ))}
      </Group>
      <Group title="Availability" open={false}>
        <Check checked={filters.availability.includes("in-stock")} onChange={() => toggle("availability", "in-stock")}>
          In stock only
        </Check>
      </Group>
      <Group title="Discount" open={false}>
        <Check checked={filters.discount.includes("on-sale")} onChange={() => toggle("discount", "on-sale")}>
          On sale
        </Check>
        <Check checked={filters.discount.includes("20")} onChange={() => toggle("discount", "20")}>
          20% off or more
        </Check>
      </Group>
      <Group title="Rating" open={false}>
        {["4.5", "4"].map((r) => (
          <Check key={r} checked={filters.rating.includes(r)} onChange={() => toggle("rating", r)}>
            {r}★ &amp; up
          </Check>
        ))}
      </Group>
    </div>
  );
}
