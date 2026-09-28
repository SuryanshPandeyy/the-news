/** Public origin for share links, sitemap, Open Graph, etc. (no trailing slash). */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  let raw =
    fromEnv ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/^https?:\/\//i, "").replace(/\/$/, "")}`
      : "https://www.maukhabar.in");

  raw = raw.replace(/\/$/, "");

  try {
    const url = new URL(raw);
    // Production canonical host is www (apex redirects with 308).
    if (url.hostname === "maukhabar.in") {
      url.hostname = "www.maukhabar.in";
    }
    return url.origin;
  } catch {
    return "https://www.maukhabar.in";
  }
}
