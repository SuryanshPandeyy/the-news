/** Public origin for share links, sitemap, Open Graph, etc. (no trailing slash). */
export function getSiteUrl(): string {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://maukhabar.in";
  return raw.replace(/\/$/, "");
}
