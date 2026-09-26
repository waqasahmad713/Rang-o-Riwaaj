"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, Trash2 } from "lucide-react";
import type { Construction, Department, Product, Season } from "@/lib/types";
import { shopColors } from "@/data/site";
import { useCatalog, useUI } from "@/store";

const WOMEN_CATS = [
  ["casual-wear", "Casual Wear"],
  ["formal-wear", "Formal Wear"],
  ["party-wear", "Party Wear"],
  ["wedding-wear", "Wedding Wear"],
];
const MEN_CATS = [
  ["shalwar-kameez", "Shalwar Kameez"],
  ["kurta", "Kurta"],
  ["casual-wear", "Casual Wear"],
  ["formal-wear", "Formal Wear"],
  ["wedding-wear", "Wedding Wear"],
];
const ACC_CATS = [
  ["khussa", "Khussa"],
  ["jewellery", "Jewellery"],
  ["clutch", "Clutch"],
];

const slugify = (s: string) =>
  s
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

async function uploadFile(file: File) {
  const fd = new FormData();
  fd.set("file", file);
  const res = await fetch("/api/upload", { method: "POST", body: fd });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Upload failed");
  return data.url as string;
}

export function ProductForm({ onDone }: { onDone?: () => void }) {
  const router = useRouter();
  const apply = useCatalog((s) => s.apply);
  const toast = useUI((s) => s.toast);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [department, setDepartment] = useState<Department>("women");
  const [construction, setConstruction] = useState<Construction>("stitched");
  const cats = department === "men" ? MEN_CATS : department === "accessories" ? ACC_CATS : WOMEN_CATS;

  const addFiles = async (files: FileList | null) => {
    if (!files?.length) return;
    setError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) urls.push(await uploadFile(file));
      setPhotos((p) => [...p, ...urls]);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not upload photo.");
    }
  };

  return (
    <form
      className="border border-line bg-white p-6 sm:p-8"
      onSubmit={async (e) => {
        e.preventDefault();
        const f = new FormData(e.currentTarget);
        const name = String(f.get("name") ?? "").trim();
        const price = Number(f.get("price"));
        const compare = Number(f.get("compareAt")) || undefined;
        if (!name || !price) return setError("Please add a name and price.");
        if (!photos.length) return setError("Please upload at least one photo.");
        const sizes = String(f.get("sizes") ?? "S, M, L")
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        const qty = Number(f.get("stock")) || 8;
        const colorName = String(f.get("color") ?? "Maroon");
        const colorHex = shopColors.find((c) => c.name === colorName)?.hex ?? "#6b1e2e";
        const slug = slugify(name) || `piece-${Date.now()}`;
        const id = `c-${Date.now()}`;
        const cons = department === "accessories" ? "accessory" : department === "men" ? "unstitched" : construction;
        const product: Product = {
          id,
          slug,
          sku: `RR-${id.slice(-6).toUpperCase()}`,
          name,
          department,
          construction: cons,
          category: String(f.get("category") ?? cats[0][0]),
          tags: cons === "unstitched" ? ["unstitched"] : ["new"],
          collections: ["summer"],
          badges: ["new"],
          fabric: String(f.get("fabric") ?? "Lawn"),
          price,
          compareAtPrice: compare && compare > price ? compare : undefined,
          colors: [{ name: colorName, hex: colorHex, imageIndex: 0 }],
          sizes,
          stock: Object.fromEntries(sizes.map((s) => [s, qty])),
          images: photos.map((src, i) => ({ src, alt: `${name} — photo ${i + 1}`, view: i === 0 ? "front" : "detail" })),
          rating: 5,
          reviewCount: 0,
          sold: 0,
          views: 0,
          createdAt: new Date().toISOString().slice(0, 10),
          pieces: Number(f.get("pieces") || 3) as 1 | 2 | 3,
          includes: String(f.get("includes") ?? "As shown")
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean),
          shortDescription: String(f.get("short") ?? "").trim() || `${name} from Rang-o-Riwaaj.`,
          description: String(f.get("description") ?? "").trim() || `${name} — added from the studio desk.`,
          details: [],
          fabricLength: cons === "unstitched" ? String(f.get("length") ?? "") : undefined,
          season: String(f.get("season") ?? "All Season") as Season,
          fit: cons === "unstitched" ? "Unstitched — sufficient for sizes up to XXL." : "Choose your usual size. WhatsApp us if you are between sizes.",
          care: ["Gentle wash or dry clean as labelled", "Dry in shade", "Iron on reverse"],
        };
        setBusy(true);
        setError("");
        try {
          const res = await fetch("/api/catalog", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ product }) });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "Could not save.");
          apply(data);
          toast(`${name} is in the shop`, { label: "View", href: `/product/${slug}` });
          onDone?.();
          router.refresh();
          router.push(`/product/${slug}`);
        } catch (err) {
          setError(err instanceof Error ? err.message : "Could not save.");
        } finally {
          setBusy(false);
        }
      }}
    >
      <h2 className="font-serif text-2xl">Add a new item</h2>
      <p className="mt-2 text-sm text-muted">Upload photos from your phone or computer, set the price, and publish. The piece appears in Women, Men or Accessories right away.</p>

      <div className="mt-6">
        <label className="label">Photos</label>
        <label className="flex cursor-pointer flex-col items-center justify-center border border-dashed border-line bg-sand px-4 py-8 text-center hover:border-ink">
          <ImagePlus className="h-8 w-8 text-maroon" />
          <span className="mt-2 text-sm font-medium">Click to upload photos</span>
          <span className="mt-1 text-xs text-muted">JPG, PNG or WebP · up to 8 MB each</span>
          <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="sr-only" onChange={(e) => addFiles(e.target.files)} />
        </label>
        {photos.length > 0 && (
          <ul className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
            {photos.map((src) => (
              <li key={src} className="relative aspect-[3/4] bg-sand">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt="" className="h-full w-full object-cover" />
                <button type="button" onClick={() => setPhotos((p) => p.filter((x) => x !== src))} className="absolute top-1 right-1 bg-ink p-1 text-ivory" aria-label="Remove photo">
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor="pname" className="label">
            Product name
          </label>
          <input id="pname" name="name" className="input" required placeholder="e.g. Noor Printed Lawn 3-Piece" />
        </div>
        <div>
          <label htmlFor="price" className="label">
            Price (Rs.)
          </label>
          <input id="price" name="price" type="number" min={1} className="input" required placeholder="6490" />
        </div>
        <div>
          <label htmlFor="compareAt" className="label">
            Original price if on sale (optional)
          </label>
          <input id="compareAt" name="compareAt" type="number" min={1} className="input" placeholder="7990" />
        </div>
        <div>
          <label htmlFor="dept" className="label">
            Department
          </label>
          <select
            id="dept"
            className="input"
            value={department}
            onChange={(e) => {
              const d = e.target.value as Department;
              setDepartment(d);
              if (d === "men") setConstruction("unstitched");
              else if (d === "accessories") setConstruction("accessory");
              else if (construction === "accessory" || construction === "unstitched") setConstruction("stitched");
            }}
          >
            <option value="women">Women</option>
            <option value="men">Men</option>
            <option value="accessories">Accessories</option>
          </select>
        </div>
        {department !== "men" && (
          <div>
            <label htmlFor="cons" className="label">
              Type
            </label>
            <select id="cons" className="input" value={construction} onChange={(e) => setConstruction(e.target.value as Construction)} disabled={department === "accessories"}>
              <option value="stitched">Stitched / Ready to wear</option>
              <option value="unstitched">Unstitched</option>
            </select>
            {department === "accessories" && <p className="mt-1 text-xs text-muted">Accessories are saved without a stitch type.</p>}
          </div>
        )}
        {department === "men" && (
          <div>
            <label className="label">Type</label>
            <p className="input flex items-center text-sm text-ink-soft">Unstitched fabric only</p>
          </div>
        )}
        <div>
          <label htmlFor="category" className="label">
            Category
          </label>
          <select id="category" name="category" className="input">
            {cats.map(([v, l]) => (
              <option key={v} value={v}>
                {l}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="fabric" className="label">
            Fabric
          </label>
          <input id="fabric" name="fabric" className="input" defaultValue="Lawn" />
        </div>
        <div>
          <label htmlFor="color" className="label">
            Main colour
          </label>
          <select id="color" name="color" className="input">
            {shopColors.map((c) => (
              <option key={c.name}>{c.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="sizes" className="label">
            Sizes (comma separated)
          </label>
          <input
            id="sizes"
            name="sizes"
            key={`${department}-${construction}`}
            className="input"
            defaultValue={department === "men" || construction === "unstitched" ? "Unstitched" : "XS, S, M, L, XL"}
          />
        </div>
        <div>
          <label htmlFor="stock" className="label">
            Stock per size
          </label>
          <input id="stock" name="stock" type="number" min={0} className="input" defaultValue={8} />
        </div>
        <div>
          <label htmlFor="pieces" className="label">
            Pieces
          </label>
          <select id="pieces" name="pieces" className="input" defaultValue="3">
            <option value="1">1</option>
            <option value="2">2</option>
            <option value="3">3</option>
          </select>
        </div>
        <div>
          <label htmlFor="season" className="label">
            Season
          </label>
          <select id="season" name="season" className="input">
            <option>All Season</option>
            <option>Summer</option>
            <option>Winter</option>
          </select>
        </div>
        {construction === "unstitched" && (
          <div>
            <label htmlFor="length" className="label">
              Fabric length
            </label>
            <input id="length" name="length" className="input" placeholder="3 metres shirt + 2.5 metres trouser + dupatta" />
          </div>
        )}
        <div className="sm:col-span-2">
          <label htmlFor="includes" className="label">
            What&apos;s included
          </label>
          <input id="includes" name="includes" className="input" defaultValue="Shirt, Trouser, Dupatta" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="short" className="label">
            Short description
          </label>
          <input id="short" name="short" className="input" placeholder="One line that appears under the price" />
        </div>
        <div className="sm:col-span-2">
          <label htmlFor="description" className="label">
            Full description
          </label>
          <textarea id="description" name="description" className="input min-h-28" placeholder="Fabric, work, occasion…" />
        </div>
      </div>
      {error && (
        <p className="mt-4 text-sm text-danger" role="alert">
          {error}
        </p>
      )}
      <button disabled={busy} className="btn-primary mt-6">
        {busy ? "Saving…" : "Publish in the shop"}
      </button>
    </form>
  );
}
