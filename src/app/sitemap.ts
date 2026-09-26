import type { MetadataRoute } from "next";
import { collections } from "@/data/collections";
import { journal } from "@/data/journal";
import { getAllProducts } from "@/lib/catalog";
import { site } from "@/data/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = ["", "/about", "/contact", "/journal", "/style-quiz", "/style-stories", "/size-guide", "/shipping", "/returns", "/faq", "/privacy", "/terms", "/careers"];
  const now = new Date();
  return [
    ...staticPaths.map((path) => ({
      url: `${site.url}${path || "/"}`,
      lastModified: now,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.6,
    })),
    ...collections.flatMap((c) => [
      { url: `${site.url}/${c.slug}`, lastModified: now, changeFrequency: "weekly" as const, priority: 0.8 },
      ...(c.subcategories ?? []).map((s) => ({
        url: `${site.url}/${c.slug}/${s.slug}`,
        lastModified: now,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ]),
    ...getAllProducts().map((p) => ({
      url: `${site.url}/product/${p.slug}`,
      lastModified: new Date(p.createdAt),
      changeFrequency: "weekly" as const,
      priority: 0.7,
    })),
    ...journal.map((p) => ({
      url: `${site.url}/journal/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
