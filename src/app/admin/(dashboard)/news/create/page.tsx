import { ArticleForm } from "@/components/admin/article-form";
import { getAllCategories } from "@/lib/queries/categories";

export const dynamic = "force-dynamic";

export default async function CreateNewsPage() {
  const categories = await getAllCategories(true);
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <h1 className="text-2xl font-bold">Create article</h1>
      <ArticleForm categories={categories} />
    </div>
  );
}
