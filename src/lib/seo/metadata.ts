import type { Metadata } from "next";
import { isDbConfigured } from "@/lib/db/connect";
import { getSettings } from "@/lib/models/Settings";
import { getSiteUrl } from "@/lib/site";

/** Default image for social previews when a story has no hero image. */
export const DEFAULT_SHARE_IMAGE_PATH = "/shareimg.jpeg";

export type SeoSiteContext = {
  siteName: string;
  siteDescription?: string;
  defaultSeoTitle?: string;
  defaultSeoDescription?: string;
  defaultSeoImage?: string;
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

/** Site/list pages: featured image, else admin default SEO image, else shareimg.jpeg. */
export function resolveShareImageUrl(
  image?: string | null,
  site?: Pick<SeoSiteContext, "defaultSeoImage">,
): string {
  const featured = image?.trim();
  if (featured) return toAbsoluteUrl(featured);

  const fromSettings = site?.defaultSeoImage?.trim();
  if (fromSettings) return toAbsoluteUrl(fromSettings);

  return toAbsoluteUrl(DEFAULT_SHARE_IMAGE_PATH);
}

/** Article shares: story hero only, else shareimg.jpeg (never random placeholders). */
export function resolveArticleShareImageUrl(heroImage?: string | null): string {
  const featured = heroImage?.trim();
  if (featured) return toAbsoluteUrl(featured);
  return toAbsoluteUrl(DEFAULT_SHARE_IMAGE_PATH);
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
  const ogImage = ogImageOverride ?? resolveShareImageUrl(image, site);
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
  };
}
