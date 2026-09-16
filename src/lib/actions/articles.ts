"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth-helpers";
import { articleInputToDb } from "@/lib/articles/map-payload";
import { connectDB } from "@/lib/db/connect";
import { Article } from "@/lib/models/Article";
import { Category } from "@/lib/models/Category";
import { sanitizeArticleContent } from "@/lib/sanitize";
import { articleSchema } from "@/lib/validation/schemas";

export type ActionResult = { success: boolean; message?: string; id?: string };

async function revalidatePublicPaths(categoryId: string, slug: string) {
  revalidatePath("/");
  revalidatePath("/today");
  revalidatePath("/search");
  revalidatePath(`/news/${slug}`);
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

    const payload = {
      ...articleInputToDb(parsed),
      content: sanitizeArticleContent(parsed.content),
    };

    if (id) {
      const existing = await Article.findById(id).select("slug category").lean();
      await Article.findByIdAndUpdate(id, payload);
      await revalidatePublicPaths(
        String(existing?.category ?? parsed.category),
        parsed.slug,
      );
      revalidatePath("/admin/news");
      return { success: true, id, message: "Article updated" };
    }

    const slugTaken = await Article.findOne({ slug: parsed.slug });
    if (slugTaken) {
      return { success: false, message: "Slug already exists" };
    }

    const created = await Article.create(payload);
    await revalidatePublicPaths(String(parsed.category), parsed.slug);
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
    await revalidatePublicPaths(String(article.category), article.slug);
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
      excerpt: article.excerpt,
      subtitle: article.subtitle,
      content: article.content,
      featuredImage: article.featuredImage,
      featuredImageAlt: article.featuredImageAlt,
      featuredImagePublicId: article.featuredImagePublicId,
      imageCaption: article.imageCaption,
      sectionLabel: article.sectionLabel,
      category: article.category,
      author: article.author,
      authorRole: article.authorRole,
      status: "draft",
      featured: article.featured,
      breaking: false,
      trending: article.trending,
      editorsPick: article.editorsPick,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      seoKeywords: article.seoKeywords,
      tags: article.tags,
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
    await revalidatePublicPaths(String(article.category), article.slug);
    revalidatePath("/admin/news");
    return { success: true, message: "Status updated" };
  } catch {
    return { success: false, message: "Failed to update status" };
  }
}
