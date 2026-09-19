import type { z } from "zod";
import type { articleSchema } from "@/lib/validation/schemas";
import { slugFromTitle } from "@/lib/utils/slug";
import { excerptFromContent } from "@/lib/articles/excerpt";

type ArticleInput = z.infer<typeof articleSchema>;

function opt(value?: string | null): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

/** Maps validated admin form input to MongoDB article fields (frontend-compatible). */
export function articleInputToDb(parsed: ArticleInput) {
  const slug = slugFromTitle(parsed.title, parsed.slug);
  const images = (parsed.images ?? []).filter((img) => img.url?.trim());
  const first = images[0];
  const status = parsed.status ?? "published";

  return {
    title: parsed.title.trim(),
    slug,
    excerpt: excerptFromContent(parsed.content),
    content: parsed.content,
    images,
    featuredImage: first?.url ?? opt(parsed.featuredImage),
    featuredImagePublicId: first?.publicId ?? opt(parsed.featuredImagePublicId),
    bannerImage: opt(parsed.bannerImage) ?? null,
    bannerImagePublicId: opt(parsed.bannerImagePublicId) ?? null,
    category: parsed.category?.trim() ? parsed.category.trim() : null,
    author: opt(parsed.author) ?? "Editorial Desk",
    status,
    featured: Boolean(parsed.featured),
    breaking: Boolean(parsed.breaking),
    trending: Boolean(parsed.trending),
    editorsPick: Boolean(parsed.editorsPick),
    views: parsed.views ?? 0,
    publishedAt:
      status === "published"
        ? parsed.publishedAt
          ? new Date(parsed.publishedAt)
          : new Date()
        : parsed.publishedAt
          ? new Date(parsed.publishedAt)
          : undefined,
  };
}
