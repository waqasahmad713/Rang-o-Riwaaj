type LoaderArgs = { src: string; width: number; quality?: number };

// Unsplash (imgix) resizes on its CDN, so we skip the Next.js optimizer for remote photos.
// When real product photos are hosted on Supabase Storage or a CDN, extend this loader.
export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    url.searchParams.set("q", String(quality ?? 70));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    return url.toString();
  }
  return src;
}
