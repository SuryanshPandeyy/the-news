import { connectDB } from "@/lib/db/connect";
import { Category } from "@/lib/models/Category";
import type { CategorySummary } from "@/lib/types";
import { slugLookupCandidates } from "@/lib/utils/slug";

function serialize(doc: Record<string, unknown>): CategorySummary {
  return {
    _id: String(doc._id),
    name: doc.name as string,
    slug: doc.slug as string,
    description: doc.description as string | undefined,
    image: doc.image as string | undefined,
  };
}

export async function getActiveCategories(): Promise<CategorySummary[]> {
  await connectDB();
  const docs = await Category.find({ isActive: true })
    .sort({ displayOrder: 1, name: 1 })
    .lean();
  return docs.map((d) => serialize(d as Record<string, unknown>));
}

export async function getAllCategories(admin = false): Promise<
  (CategorySummary & { isActive: boolean; displayOrder: number })[]
> {
  await connectDB();
  const filter = admin ? {} : { isActive: true };
  const docs = await Category.find(filter).sort({ displayOrder: 1, name: 1 }).lean();
  return docs.map((d) => ({
    ...serialize(d as Record<string, unknown>),
    isActive: Boolean(d.isActive),
    displayOrder: d.displayOrder ?? 0,
  }));
}

export async function getCategoryBySlug(rawSlug: string) {
  await connectDB();
  for (const slug of slugLookupCandidates(rawSlug)) {
    const doc = await Category.findOne({ slug, isActive: true }).lean();
    if (!doc) continue;
    return {
      ...serialize(doc as Record<string, unknown>),
      isActive: Boolean(doc.isActive),
      displayOrder: doc.displayOrder ?? 0,
    };
  }
  return null;
}

export async function getCategoryArticlesSection(
  categoryId: string,
  limit = 4,
) {
  const { getArticlesPaginated } = await import("@/lib/queries/articles");
  const { Category } = await import("@/lib/models/Category");
  await connectDB();
  const cat = await Category.findById(categoryId).lean();
  if (!cat) return null;
  const articles = await getArticlesPaginated({
    page: 1,
    pageSize: limit,
    categorySlug: cat.slug,
    status: "published",
  });
  return {
    category: serialize(cat as Record<string, unknown>),
    articles: articles.items,
  };
}
