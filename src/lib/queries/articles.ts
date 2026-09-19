import { connectDB } from "@/lib/db/connect";
import { Article } from "@/lib/models/Article";
import { getTodayRangeInUtc } from "@/lib/timezone";
import type { ArticleDetail, ArticleListItem, PaginatedResult } from "@/lib/types";
import { isObjectIdSlug, normalizeSlug, slugLookupCandidates } from "@/lib/utils/slug";
import mongoose from "mongoose";

const listProjection = {
  title: 1,
  slug: 1,
  excerpt: 1,
  subtitle: 1,
  featuredImage: 1,
  featuredImageAlt: 1,
  bannerImage: 1,
  sectionLabel: 1,
  author: 1,
  authorRole: 1,
  status: 1,
  featured: 1,
  breaking: 1,
  trending: 1,
  editorsPick: 1,
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
    subtitle: doc.subtitle as string | undefined,
    featuredImage: doc.featuredImage as string | undefined,
    featuredImageAlt: doc.featuredImageAlt as string | undefined,
    bannerImage: doc.bannerImage as string | undefined,
    sectionLabel: doc.sectionLabel as string | undefined,
    author: doc.author as string | undefined,
    authorRole: doc.authorRole as string | undefined,
    status: doc.status as "draft" | "published",
    featured: Boolean(doc.featured),
    breaking: Boolean(doc.breaking),
    trending: Boolean(doc.trending),
    editorsPick: Boolean(doc.editorsPick),
    publishedAt: doc.publishedAt
      ? new Date(doc.publishedAt as string).toISOString()
      : undefined,
    createdAt: new Date(doc.createdAt as string).toISOString(),
    updatedAt: new Date(doc.updatedAt as string).toISOString(),
    category:
      category && category._id
        ? {
            _id: String(category._id),
            name: category.name as string,
            slug: category.slug as string,
            description: category.description as string | undefined,
            image: category.image as string | undefined,
          }
        : undefined,
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
    editorsPick?: boolean;
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
    editorsPick,
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
  if (editorsPick !== undefined) filter.editorsPick = editorsPick;

  if (todayOnly) {
    const { start, end } = getTodayRangeInUtc();
    filter.publishedAt = { $gte: start, $lte: end };
  }

  if (categorySlug) {
    const { Category } = await import("@/lib/models/Category");
    let categoryId: string | null = null;
    for (const candidate of slugLookupCandidates(categorySlug)) {
      const cat = await Category.findOne({ slug: candidate }).select("_id").lean();
      if (cat) {
        categoryId = String(cat._id);
        break;
      }
    }
    if (!categoryId) return { items: [], total: 0, page, pageSize, totalPages: 0 };
    filter.category = categoryId;
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

function articleDetailFromLeanDoc(doc: Record<string, unknown>): ArticleDetail {
  const base = serializeArticle(doc);
  const images = (doc.images as { url: string; publicId?: string }[] | undefined)?.map(
    (img) => ({
      url: img.url,
      publicId: img.publicId,
    }),
  );
  const gallery =
    images && images.length > 0
      ? images
      : doc.featuredImage
        ? [{ url: doc.featuredImage as string, publicId: doc.featuredImagePublicId as string | undefined }]
        : [];

  return {
    ...base,
    content: doc.content as string,
    featuredImagePublicId: doc.featuredImagePublicId as string | undefined,
    bannerImagePublicId: doc.bannerImagePublicId as string | undefined,
    images: gallery,
    imageCaption: doc.imageCaption as string | undefined,
    seoTitle: doc.seoTitle as string | undefined,
    seoDescription: doc.seoDescription as string | undefined,
    seoKeywords: doc.seoKeywords as string[] | undefined,
  };
}

export async function getArticleBySlug(
  rawSlug: string,
  admin = false,
): Promise<ArticleDetail | null> {
  await connectDB();
  const statusFilter: Record<string, unknown> = admin ? {} : { status: "published" };

  const normalized = normalizeSlug(rawSlug);
  if (isObjectIdSlug(normalized) && mongoose.Types.ObjectId.isValid(normalized)) {
    const oid = new mongoose.Types.ObjectId(normalized);
    if (String(oid) === normalized) {
      for (const filter of [{ _id: oid, ...statusFilter }, { slug: normalized, ...statusFilter }]) {
        const doc = await Article.findOne(filter)
          .populate("category", "name slug description image")
          .lean();
        if (doc) return articleDetailFromLeanDoc(doc as Record<string, unknown>);
      }
    }
  }

  for (const slug of slugLookupCandidates(rawSlug)) {
    const filter: Record<string, unknown> = { slug, ...statusFilter };

    const doc = await Article.findOne(filter)
      .populate("category", "name slug description image")
      .lean();

    if (!doc) continue;

    return articleDetailFromLeanDoc(doc as Record<string, unknown>);
  }

  return null;
}

export async function getHomeHeaderBannerSlides(limit = 5): Promise<ArticleListItem[]> {
  await connectDB();
  const bannerDocs = await Article.find({
    status: "published",
    bannerImage: { $exists: true, $nin: [null, ""] },
  })
    .select(listProjection)
    .populate("category", "name slug description image")
    .sort({ publishedAt: -1, createdAt: -1 })
    .limit(limit)
    .lean();

  const items = bannerDocs.map((d) => serializeArticle(d as Record<string, unknown>));
  if (items.length > 0) return items;

  const fallback = await getArticlesPaginated({
    page: 1,
    pageSize: limit,
    status: "published",
  });
  return fallback.items;
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

export async function incrementArticleViews(slugParam: string) {
  await connectDB();
  const normalized = normalizeSlug(slugParam);
  if (isObjectIdSlug(normalized) && mongoose.Types.ObjectId.isValid(normalized)) {
    const oid = new mongoose.Types.ObjectId(normalized);
    if (String(oid) === normalized) {
      for (const filter of [
        { _id: oid, status: "published" as const },
        { slug: normalized, status: "published" as const },
      ]) {
        const result = await Article.updateOne(filter, { $inc: { views: 1 } });
        if (result.matchedCount > 0) return;
      }
    }
  }
  for (const slug of slugLookupCandidates(slugParam)) {
    const result = await Article.updateOne(
      { slug, status: "published" },
      { $inc: { views: 1 } },
    );
    if (result.matchedCount > 0) return;
  }
}

export async function getRelatedArticles(
  categoryId: string | undefined,
  excludeSlug: string,
  limit = 4,
): Promise<ArticleListItem[]> {
  if (!categoryId) {
    const result = await getArticlesPaginated({
      page: 1,
      pageSize: limit + 5,
      status: "published",
    });
    return result.items.filter((a) => a.slug !== excludeSlug).slice(0, limit);
  }

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

export async function getEditorsPickArticles(
  categorySlug?: string,
  limit = 4,
): Promise<ArticleListItem[]> {
  await connectDB();
  const filter: Record<string, unknown> = {
    status: "published",
    editorsPick: true,
  };
  if (categorySlug) {
    const { Category } = await import("@/lib/models/Category");
    let categoryId: string | null = null;
    for (const candidate of slugLookupCandidates(categorySlug)) {
      const cat = await Category.findOne({ slug: candidate }).select("_id").lean();
      if (cat) {
        categoryId = String(cat._id);
        break;
      }
    }
    if (categoryId) filter.category = categoryId;
  }
  const docs = await Article.find(filter)
    .select(listProjection)
    .populate("category", "name slug description image")
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

const HOME_FEED_CAP = 40;

function orderFeaturedFirst(items: ArticleListItem[]): ArticleListItem[] {
  const featured = items.filter((a) => a.featured);
  const rest = items.filter((a) => !a.featured);
  const seen = new Set<string>();
  const out: ArticleListItem[] = [];
  for (const a of [...featured, ...rest]) {
    if (seen.has(a._id)) continue;
    seen.add(a._id);
    out.push(a);
  }
  return out;
}

export type HomeFeed = {
  breaking: ArticleListItem[];
  hero: ArticleListItem | null;
  heroThumbs: ArticleListItem[];
  latest: ArticleListItem[];
  mostRead: ArticleListItem[];
  more: ArticleListItem[];
  sectionTitle: string;
};

export async function getHomeFeed(): Promise<HomeFeed> {
  const [breaking, pool] = await Promise.all([
    getBreakingArticles(),
    getArticlesPaginated({ page: 1, pageSize: HOME_FEED_CAP, status: "published" }),
  ]);

  const ordered = orderFeaturedFirst(pool.items);
  const hero = ordered[0] ?? null;
  const heroThumbs = ordered.slice(1, 4);
  const heroBlockIds = new Set(
    [hero?._id, ...heroThumbs.map((t) => t._id)].filter(Boolean) as string[],
  );

  const latest = ordered.filter((a) => !heroBlockIds.has(a._id)).slice(0, 3);

  const mostReadRaw = await getMostReadArticles(5);
  const hasViewCounts = mostReadRaw.some((a) => (a.views ?? 0) > 0);
  const mostRead = hasViewCounts ? mostReadRaw : ordered.slice(0, 5);

  const reserved = new Set([
    ...heroBlockIds,
    ...latest.map((a) => a._id),
    ...mostRead.map((a) => a._id),
  ]);
  const more = ordered.filter((a) => !reserved.has(a._id));

  const sectionTitle = hero?.sectionLabel || hero?.category?.name || "Featured";

  return {
    breaking,
    hero,
    heroThumbs,
    latest: latest.length > 0 ? latest : ordered.slice(hero ? 1 : 0, hero ? 4 : 3),
    mostRead,
    more,
    sectionTitle,
  };
}

export type CategoryFeed = {
  hero: ArticleListItem | null;
  editorPicks: ArticleListItem[];
  gridArticles: ArticleListItem[];
  pagination: PaginatedResult<ArticleListItem>;
};

export async function getCategoryFeed(
  categorySlug: string,
  page = 1,
  pageSize = 12,
): Promise<CategoryFeed> {
  const [featuredPage, latestPage, editorPicksRaw] = await Promise.all([
    getArticlesPaginated({
      page: 1,
      pageSize: 1,
      categorySlug,
      featured: true,
      status: "published",
    }),
    getArticlesPaginated({ page, pageSize, categorySlug, status: "published" }),
    getEditorsPickArticles(categorySlug, 4),
  ]);

  const ordered = orderFeaturedFirst(latestPage.items);
  const hero = featuredPage.items[0] ?? ordered[0] ?? null;

  let editorPicks = editorPicksRaw;
  if (editorPicks.length === 0) {
    editorPicks = ordered.filter((a) => a._id !== hero?._id).slice(0, 4);
  }

  const heroId = hero?._id;
  const pickIds = new Set(editorPicks.map((p) => p._id));
  const gridArticles = ordered.filter(
    (a) => a._id !== heroId && !pickIds.has(a._id),
  );

  return {
    hero,
    editorPicks,
    gridArticles,
    pagination: latestPage,
  };
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
    editorsPick,
    subscribers,
  ] = await Promise.all([
    Article.countDocuments(),
    Article.countDocuments({ status: "published" }),
    Article.countDocuments({ status: "draft" }),
    Category.countDocuments(),
    Article.countDocuments({ trending: true, status: "published" }),
    Article.countDocuments({ featured: true, status: "published" }),
    Article.countDocuments({ breaking: true, status: "published" }),
    Article.countDocuments({ editorsPick: true, status: "published" }),
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
    editorsPick,
    subscribers,
  };
}
