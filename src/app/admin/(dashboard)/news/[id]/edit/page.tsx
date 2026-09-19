import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/article-form";
import { connectDB } from "@/lib/db/connect";
import { Article } from "@/lib/models/Article";
import { getAllCategories } from "@/lib/queries/categories";
import { getSettings } from "@/lib/models/Settings";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/messages";
import { getArticleBySlug } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const doc = await Article.findById(id).select("slug").lean();
  if (!doc) notFound();

  const [article, categories, settings, locale] = await Promise.all([
    getArticleBySlug(doc.slug, true),
    getAllCategories(true),
    getSettings(),
    getLocale(),
  ]);

  if (!article) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">{t("editArticle", locale)}</h1>
      <ArticleForm
        categories={categories}
        article={article}
        defaultAuthor={settings.defaultAuthor ?? "Editorial Desk"}
      />
    </div>
  );
}
