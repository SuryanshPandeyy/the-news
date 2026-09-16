import type { z } from "zod";
import type { articleSchema } from "@/lib/validation/schemas";

type ArticleInput = z.infer<typeof articleSchema>;

function opt(value?: string | null): string | undefined {
  const v = value?.trim();
  return v ? v : undefined;
}

/** Maps validated admin form input to MongoDB article fields (frontend-compatible). */
export function articleInputToDb(parsed: ArticleInput) {
  return {
    title: parsed.title.trim(),
    slug: parsed.slug.trim().toLowerCase(),
    excerpt: opt(parsed.excerpt),
    subtitle: opt(parsed.subtitle),
    content: parsed.content,
    featuredImage: opt(parsed.featuredImage),
    featuredImageAlt: opt(parsed.featuredImageAlt),
    featuredImagePublicId: opt(parsed.featuredImagePublicId),
    imageCaption: opt(parsed.imageCaption),
    sectionLabel: opt(parsed.sectionLabel),
    category: parsed.category,
    author: opt(parsed.author) ?? "Editorial Desk",
    authorRole: opt(parsed.authorRole),
    status: parsed.status,
    featured: Boolean(parsed.featured),
    breaking: Boolean(parsed.breaking),
    trending: Boolean(parsed.trending),
    editorsPick: Boolean(parsed.editorsPick),
    views: parsed.views ?? 0,
    seoTitle: opt(parsed.seoTitle),
    seoDescription: opt(parsed.seoDescription),
    seoKeywords: parsed.seoKeywords?.filter(Boolean),
    tags: parsed.tags?.filter(Boolean),
    publishedAt:
      parsed.status === "published"
        ? parsed.publishedAt
          ? new Date(parsed.publishedAt)
          : new Date()
        : parsed.publishedAt
          ? new Date(parsed.publishedAt)
          : undefined,
  };
}
