"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { excerptFromContent } from "@/lib/articles/excerpt";
import { articleInputToDb } from "@/lib/articles/map-payload";
import { connectDB } from "@/lib/db/connect";
import { Article } from "@/lib/models/Article";
import { Category } from "@/lib/models/Category";
import { sanitizeArticleContent } from "@/lib/sanitize";
import { articleSchema } from "@/lib/validation/schemas";
import { newsArticlePath } from "@/lib/utils/slug";

export type ActionResult = { success: boolean; message?: string; id?: string };

async function revalidatePublicPaths(categoryId: string | null | undefined, slug: string) {
  revalidatePath("/");
  revalidatePath("/today");
  revalidatePath("/search");
  revalidatePath(newsArticlePath(slug));
  if (!categoryId) return;
  const cat = await Category.findById(categoryId).select("slug").lean();
  if (cat?.slug) {
    revalidatePath(`/category/${cat.slug}`);
  }
}

export async function saveArticle(
  data: unknown,
  id?: string,
): Promise<ActionResult> {
  try {
    await requireAdmin();
    const parsed = articleSchema.parse(data);
    await connectDB();

    const mapped = articleInputToDb(parsed);
    const payload = {
      ...mapped,
      content: sanitizeArticleContent(parsed.content),
    };

    if (id) {
      const existing = await Article.findById(id).select("slug category").lean();
      await Article.findByIdAndUpdate(id, payload);
      if (existing?.category) {
        await revalidatePublicPaths(String(existing.category), existing.slug);
      }
      await revalidatePublicPaths(mapped.category, mapped.slug);
      revalidatePath("/admin/news");
      return { success: true, id, message: "Article updated" };
    }

    const slugTaken = await Article.findOne({ slug: mapped.slug });
    if (slugTaken) {
      return { success: false, message: "Slug already exists" };
    }

    const created = await Article.create(payload);
    await revalidatePublicPaths(mapped.category, mapped.slug);
    revalidatePath("/admin/news");
    return { success: true, id: String(created._id), message: "Article created" };
  } catch (e) {
    return {
      success: false,
      message: e instanceof Error ? e.message : "Failed to save article",
    };
  }
}

export async function deleteArticle(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();
    const article = await Article.findById(id).lean();
    if (!article) return { success: false, message: "Not found" };
    await Article.findByIdAndDelete(id);
    await revalidatePublicPaths(article.category ? String(article.category) : null, article.slug);
    revalidatePath("/admin/news");
    return { success: true, message: "Article deleted" };
  } catch {
    return { success: false, message: "Failed to delete" };
  }
}

export async function duplicateArticle(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();
    const article = await Article.findById(id).lean();
    if (!article) return { success: false, message: "Not found" };

    const baseSlug = `${article.slug}-copy`;
    let slug = baseSlug;
    let i = 1;
    while (await Article.findOne({ slug })) {
      slug = `${baseSlug}-${i}`;
      i += 1;
    }

    const created = await Article.create({
      title: `${article.title} (Copy)`,
      slug,
      excerpt: excerptFromContent(article.content),
      subtitle: article.subtitle,
      content: article.content,
      featuredImage: article.featuredImage,
      featuredImagePublicId: article.featuredImagePublicId,
      images: article.images,
      category: article.category,
      author: article.author,
      status: "draft",
      featured: article.featured,
      breaking: false,
      trending: article.trending,
      editorsPick: article.editorsPick,
      views: 0,
    });

    revalidatePath("/admin/news");
    return { success: true, id: String(created._id) };
  } catch {
    return { success: false, message: "Failed to duplicate" };
  }
}

export async function toggleArticleStatus(id: string): Promise<ActionResult> {
  try {
    await requireAdmin();
    await connectDB();
    const article = await Article.findById(id);
    if (!article) return { success: false, message: "Not found" };

    if (article.status === "published") {
      article.status = "draft";
    } else {
      article.status = "published";
      article.publishedAt = article.publishedAt ?? new Date();
    }
    await article.save();
    await revalidatePublicPaths(article.category ? String(article.category) : null, article.slug);
    revalidatePath("/admin/news");
    return { success: true, message: "Status updated" };
  } catch {
    return { success: false, message: "Failed to update status" };
  }
}
