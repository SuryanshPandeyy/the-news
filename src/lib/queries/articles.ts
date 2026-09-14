import { connectDB } from "@/lib/db/connect";
import { Article } from "@/lib/models/Article";
import { getTodayRangeInUtc } from "@/lib/timezone";
import type { ArticleDetail, ArticleListItem, PaginatedResult } from "@/lib/types";

const listProjection = {
  title: 1,
  slug: 1,
  excerpt: 1,
  featuredImage: 1,
  author: 1,
  status: 1,
  featured: 1,
  breaking: 1,
  trending: 1,
  publishedAt: 1,
  createdAt: 1,
  updatedAt: 1,
  category: 1,
  tags: 1,
  views: 1,
};

function serializeArticle(doc: Record<string, unknown>): ArticleListItem {
  const category = doc.category as Record<string, unknown> | undefined;
  return {
    _id: String(doc._id),
    title: doc.title as string,
    slug: doc.slug as string,
    excerpt: doc.excerpt as string | undefined,
    featuredImage: doc.featuredImage as string | undefined,
    author: doc.author as string | undefined,
    status: doc.status as "draft" | "published",
    featured: Boolean(doc.featured),
    breaking: Boolean(doc.breaking),
    trending: Boolean(doc.trending),
    publishedAt: doc.publishedAt
      ? new Date(doc.publishedAt as string).toISOString()
      : undefined,
    createdAt: new Date(doc.createdAt as string).toISOString(),
    updatedAt: new Date(doc.updatedAt as string).toISOString(),
    category: category
      ? {
          _id: String(category._id),
          name: category.name as string,
          slug: category.slug as string,
          description: category.description as string | undefined,
          image: category.image as string | undefined,
        }
      : { _id: "", name: "Uncategorized", slug: "uncategorized" },
    tags: doc.tags as string[] | undefined,
    views: doc.views as number | undefined,
  };
}

export async function getArticlesPaginated(
  options: {
    page?: number;
    pageSize?: number;
    status?: "draft" | "published";
    categorySlug?: string;
    featured?: boolean;
    breaking?: boolean;
    trending?: boolean;
    search?: string;
    todayOnly?: boolean;
    admin?: boolean;
  } = {},
): Promise<PaginatedResult<ArticleListItem>> {
  await connectDB();
  const {
    page = 1,
    pageSize = 12,
    status,
    categorySlug,
    featured,
    breaking,
    trending,
    search,
    todayOnly,
    admin,
  } = options;

  const filter: Record<string, unknown> = {};

  if (status) filter.status = status;
  if (!admin) filter.status = "published";
  if (featured !== undefined) filter.featured = featured;
  if (breaking !== undefined) filter.breaking = breaking;
  if (trending !== undefined) filter.trending = trending;

  if (todayOnly) {
    const { start, end } = getTodayRangeInUtc();
    filter.publishedAt = { $gte: start, $lte: end };
  }

  if (categorySlug) {
    const { Category } = await import("@/lib/models/Category");
    const cat = await Category.findOne({ slug: categorySlug }).select("_id").lean();
    if (cat) filter.category = cat._id;
    else return { items: [], total: 0, page, pageSize, totalPages: 0 };
  }

  if (search?.trim()) {
    filter.$text = { $search: search.trim() };
  }

  const skip = (page - 1) * pageSize;
  const [docs, total] = await Promise.all([
    Article.find(filter)
      .select(listProjection)
      .populate("category", "name slug description image")
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean(),
    Article.countDocuments(filter),
  ]);

  return {
    items: docs.map((d) => serializeArticle(d as Record<string, unknown>)),
    total,
    page,
    pageSize,
    totalPages: Math.ceil(total / pageSize) || 1,
  };
}

export async function getArticleBySlug(
  slug: string,
  admin = false,
): Promise<ArticleDetail | null> {
  await connectDB();
  const filter: Record<string, unknown> = { slug };
  if (!admin) filter.status = "published";

  const doc = await Article.findOne(filter)
    .populate("category", "name slug description image")
    .lean();

  if (!doc) return null;

  const base = serializeArticle(doc as Record<string, unknown>);
  return {
    ...base,
    content: doc.content,
    featuredImagePublicId: doc.featuredImagePublicId ?? undefined,
    seoTitle: doc.seoTitle ?? undefined,
    seoDescription: doc.seoDescription ?? undefined,
    seoKeywords: doc.seoKeywords ?? undefined,
  };
}

export async function getBreakingArticles(limit = 8): Promise<ArticleListItem[]> {
  const result = await getArticlesPaginated({
    page: 1,
    pageSize: limit,
    breaking: true,
    status: "published",
  });
  return result.items;
}

export async function incrementArticleViews(slug: string) {
  await connectDB();
  await Article.updateOne({ slug, status: "published" }, { $inc: { views: 1 } });
}

export async function getRelatedArticles(
  categoryId: string,
  excludeSlug: string,
  limit = 4,
): Promise<ArticleListItem[]> {
  await connectDB();
  const docs = await Article.find({
    status: "published",
    category: categoryId,
    slug: { $ne: excludeSlug },
  })
    .select(listProjection)
    .populate("category", "name slug")
    .sort({ publishedAt: -1 })
    .limit(limit)
    .lean();

  return docs.map((d) => serializeArticle(d as Record<string, unknown>));
}

export async function getMostReadArticles(limit = 5): Promise<ArticleListItem[]> {
  await connectDB();
  const docs = await Article.find({ status: "published" })
    .select(listProjection)
    .populate("category", "name slug description image")
    .sort({ views: -1, publishedAt: -1 })
    .limit(limit)
    .lean();

  return docs.map((d) => serializeArticle(d as Record<string, unknown>));
}

export async function getAdminStats() {
  await connectDB();
  const { Category } = await import("@/lib/models/Category");
  const { Subscriber } = await import("@/lib/models/Subscriber");

  const [
    total,
    published,
    drafts,
    categories,
    trending,
    featured,
    breaking,
    subscribers,
  ] = await Promise.all([
    Article.countDocuments(),
    Article.countDocuments({ status: "published" }),
    Article.countDocuments({ status: "draft" }),
    Category.countDocuments(),
    Article.countDocuments({ trending: true, status: "published" }),
    Article.countDocuments({ featured: true, status: "published" }),
    Article.countDocuments({ breaking: true, status: "published" }),
    Subscriber.countDocuments({ isActive: true }),
  ]);

  return {
    total,
    published,
    drafts,
    categories,
    trending,
    featured,
    breaking,
    subscribers,
  };
}
