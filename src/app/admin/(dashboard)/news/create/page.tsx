import { ArticleForm } from "@/components/admin/article-form";
import { getSettings } from "@/lib/models/Settings";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/messages";
import { getAllCategories } from "@/lib/queries/categories";

export const dynamic = "force-dynamic";

export default async function CreateNewsPage() {
  const [categories, settings, locale] = await Promise.all([
    getAllCategories(true),
    getSettings(),
    getLocale(),
  ]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">{t("createArticle", locale)}</h1>
      <ArticleForm
        categories={categories}
        defaultAuthor={settings.defaultAuthor ?? "Editorial Desk"}
      />
    </div>
  );
}
