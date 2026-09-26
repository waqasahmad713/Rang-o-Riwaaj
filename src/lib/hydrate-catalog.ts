import { setCatalogOverlay } from "./catalog";
import { loadCustomCatalog } from "./catalog-file";

/** Server-only: load uploaded products from disk before reading the catalogue. */
export function hydrateCatalogFromDisk() {
  setCatalogOverlay(loadCustomCatalog());
}
