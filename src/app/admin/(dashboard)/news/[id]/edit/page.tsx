import { notFound } from "next/navigation";
import { ArticleForm } from "@/components/admin/article-form";
import { connectDB } from "@/lib/db/connect";
import { Article } from "@/lib/models/Article";
import { getAllCategories } from "@/lib/queries/categories";
import { getArticleBySlug } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";

export default async function EditNewsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await connectDB();
  const doc = await Article.findById(id).select("slug").lean();
  if (!doc) notFound();

  const [article, categories] = await Promise.all([
    getArticleBySlug(doc.slug, true),
    getAllCategories(true),
  ]);

  if (!article) notFound();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit article</h1>
      <ArticleForm categories={categories} article={article} />
    </div>
  );
}
