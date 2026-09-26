import { mkdirSync, readFileSync, writeFileSync } from "fs";
import path from "path";
import type { Product } from "./types";
import type { CatalogOverlay } from "./catalog";

const file = () => path.join(process.cwd(), "data", "custom-products.json");

const empty = (): CatalogOverlay => ({ custom: [], overrides: {} });

export const loadCustomCatalog = (): CatalogOverlay => {
  try {
    const raw = readFileSync(file(), "utf8");
    const parsed = JSON.parse(raw) as Partial<CatalogOverlay>;
    return { custom: parsed.custom ?? [], overrides: parsed.overrides ?? {} };
  } catch {
    return empty();
  }
};

export const saveCustomCatalog = (data: CatalogOverlay) => {
  mkdirSync(path.dirname(file()), { recursive: true });
  writeFileSync(file(), JSON.stringify(data, null, 2));
};

export const upsertCustomProduct = (product: Product) => {
  const data = loadCustomCatalog();
  const i = data.custom.findIndex((p) => p.id === product.id);
  if (i >= 0) data.custom[i] = product;
  else data.custom.unshift(product);
  saveCustomCatalog(data);
  return data;
};

export const removeCustomProduct = (id: string) => {
  const data = loadCustomCatalog();
  data.custom = data.custom.filter((p) => p.id !== id);
  delete data.overrides[id];
  saveCustomCatalog(data);
  return data;
};
