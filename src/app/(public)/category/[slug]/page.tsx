import { notFound } from "next/navigation";
import { NewsCard } from "@/components/news/news-card";
import { NewsGrid } from "@/components/news/news-grid";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { getArticlesPaginated } from "@/lib/queries/articles";
import { getCategoryBySlug } from "@/lib/queries/categories";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Number(sp.page ?? 1);
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const [featured, latest, trending] = await Promise.all([
    getArticlesPaginated({ page: 1, pageSize: 1, categorySlug: slug, featured: true, status: "published" }),
    getArticlesPaginated({ page, pageSize: 12, categorySlug: slug, status: "published" }),
    getArticlesPaginated({ page: 1, pageSize: 4, categorySlug: slug, trending: true, status: "published" }),
  ]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold">{category.name}</h1>
      {category.description && (
        <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>
      )}

      {featured.items[0] && (
        <div className="mt-8">
          <NewsCard article={featured.items[0]} variant="featured" />
        </div>
      )}

      <h2 className="mt-12 mb-4 text-xl font-semibold">Latest in {category.name}</h2>
      <NewsGrid articles={latest.items} />
      <PaginationControls page={latest.page} totalPages={latest.totalPages} basePath={`/category/${slug}`} />

      {trending.items.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 text-xl font-semibold">Trending</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {trending.items.map((a) => (
              <NewsCard key={a._id} article={a} variant="horizontal" />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
