import type { Metadata } from "next";
import { isDbConfigured } from "@/lib/db/connect";
import { getSettings } from "@/lib/models/Settings";
import { getSiteUrl } from "@/lib/site";

/** Default image for social previews when a story has no usable upload. */
export const DEFAULT_SHARE_IMAGE_PATH = "/shareimg.jpeg";

export type SeoSiteContext = {
  siteName: string;
  siteDescription?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultSeoImage?: string;
};

export type ArticleShareImageSource = {
  images?: Array<{ url?: string | null } | null> | null;
  featuredImage?: string | null;
  bannerImage?: string | null;
};

export function siteMetadataBase(): URL {
  return new URL(getSiteUrl());
}

export function toAbsoluteUrl(pathOrUrl: string): string {
  if (/^https?:\/\//i.test(pathOrUrl)) return pathOrUrl;
  const base = getSiteUrl();
  const path = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${base}${path}`;
}

/** Force https and reject blob/data/localhost URLs WhatsApp cannot fetch. */
export function isUsableShareImageUrl(value?: string | null): boolean {
  const raw = value?.trim();
  if (!raw) return false;
  if (/^(blob:|data:|about:)/i.test(raw)) return false;

  try {
    const absolute = toAbsoluteUrl(raw);
    const parsed = new URL(absolute);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return false;
    if (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") return false;
    return true;
  } catch {
    return false;
  }
}

export function toAbsoluteHttpsUrl(pathOrUrl: string): string {
  const absolute = toAbsoluteUrl(pathOrUrl.trim());
  if (absolute.startsWith("http://")) {
    return `https://${absolute.slice("http://".length)}`;
  }
  return absolute;
}

function guessImageMimeType(url: string): string {
  const clean = url.toLowerCase().split("?")[0] ?? url;
  if (clean.endsWith(".png")) return "image/png";
  if (clean.endsWith(".webp")) return "image/webp";
  if (clean.endsWith(".gif")) return "image/gif";
  if (clean.endsWith(".jpg") || clean.endsWith(".jpeg")) return "image/jpeg";
  return "image/jpeg";
}

/** Site/list pages: featured image, else admin default SEO image, else shareimg.jpeg. */
export function resolveShareImageUrl(
  image?: string | null,
  site?: Pick<SeoSiteContext, "defaultSeoImage">,
): string {
  if (isUsableShareImageUrl(image)) {
    return toAbsoluteHttpsUrl(image!);
  }

  if (isUsableShareImageUrl(site?.defaultSeoImage)) {
    return toAbsoluteHttpsUrl(site!.defaultSeoImage!);
  }

  return toAbsoluteHttpsUrl(DEFAULT_SHARE_IMAGE_PATH);
}

/**
 * Article shares — first usable wins:
 * 1. Gallery / story images (normal uploads)
 * 2. Thumbnail (featuredImage)
 * 3. Header banner image
 * 4. /shareimg.jpeg
 */
export function resolveArticleShareImageUrl(
  ...candidates: Array<string | null | undefined>
): string {
  for (const candidate of candidates) {
    if (isUsableShareImageUrl(candidate)) {
      return toAbsoluteHttpsUrl(candidate!);
    }
  }
  return toAbsoluteHttpsUrl(DEFAULT_SHARE_IMAGE_PATH);
}

/** Flatten article image fields in the preferred share order. */
export function articleShareImageCandidates(
  article?: ArticleShareImageSource | null,
): Array<string | undefined> {
  if (!article) return [];
  const gallery = (article.images ?? [])
    .map((img) => img?.url?.trim() || undefined)
    .filter(Boolean) as string[];

  return [...gallery, article.featuredImage ?? undefined, article.bannerImage ?? undefined];
}

export function resolveArticleShareImage(
  article?: ArticleShareImageSource | null,
): string {
  return resolveArticleShareImageUrl(...articleShareImageCandidates(article));
}

/** Same-origin OG endpoint WhatsApp can always fetch. */
export function articleOgImageEndpoint(slug: string, version?: string | number): string {
  const path = `/api/og-image/${encodeURIComponent(slug)}`;
  const absolute = toAbsoluteHttpsUrl(path);
  if (version == null || version === "") return absolute;
  const sep = absolute.includes("?") ? "&" : "?";
  return `${absolute}${sep}v=${encodeURIComponent(String(version))}`;
}

export async function getSeoSiteContext(): Promise<SeoSiteContext> {
  if (!isDbConfigured()) {
    return {
      siteName: "Maukhabar.in",
      siteDescription: "सच के साथ, आपके साथ",
    };
  }

  try {
    const settings = await getSettings();
    return {
      siteName: settings.siteName,
      siteDescription: settings.siteDescription ?? undefined,
      defaultSeoTitle: settings.defaultSeoTitle ?? undefined,
      defaultSeoDescription: settings.defaultSeoDescription ?? undefined,
      defaultSeoImage: settings.defaultSeoImage ?? undefined,
    };
  } catch {
    return { siteName: "Maukhabar.in" };
  }
}

function ogLocaleFromAppLocale(locale: "hi" | "en"): string {
  return locale === "hi" ? "hi_IN" : "en_IN";
}

export function buildPageMetadata({
  title,
  description,
  path,
  image,
  site,
  locale = "hi",
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  ogImageOverride,
}: {
  title: string;
  description?: string;
  path?: string;
  image?: string | null;
  site: SeoSiteContext;
  locale?: "hi" | "en";
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  /** When set, used for Open Graph / Twitter instead of resolveShareImageUrl(). */
  ogImageOverride?: string;
}): Metadata {
  const resolvedDescription =
    description?.trim() ||
    site.defaultSeoDescription?.trim() ||
    site.siteDescription?.trim() ||
    undefined;

  const canonical = path ? toAbsoluteUrl(path) : getSiteUrl();
  const ogImage = toAbsoluteHttpsUrl(
    ogImageOverride ?? resolveShareImageUrl(image, site),
  );
  const imageType = guessImageMimeType(ogImage);
  const fullTitle = title.includes(site.siteName)
    ? title
    : `${title} | ${site.siteName}`;

  return {
    title,
    description: resolvedDescription,
    alternates: { canonical },
    authors: authors?.map((name) => ({ name })),
    openGraph: {
      title: fullTitle,
      description: resolvedDescription,
      url: canonical,
      siteName: site.siteName,
      locale: ogLocaleFromAppLocale(locale),
      type,
      images: [
        {
          url: ogImage,
          secureUrl: ogImage,
          type: imageType,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      ...(publishedTime ? { publishedTime } : {}),
      ...(modifiedTime ? { modifiedTime } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: resolvedDescription,
      images: [ogImage],
    },
    other: {
      "og:image:width": "1200",
      "og:image:height": "630",
      "og:image:type": imageType,
    },
  };
}
