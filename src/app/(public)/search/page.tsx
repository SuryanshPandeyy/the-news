import { NewsGrid } from "@/components/news/news-grid";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { getArticlesPaginated } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
    description: "Search news articles",
  };
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const q = params.q?.trim() ?? "";
  const page = Number(params.page ?? 1);

  const data = q
    ? await getArticlesPaginated({
        page,
        pageSize: 12,
        search: q,
        status: "published",
        categorySlug: params.category,
      })
    : { items: [], total: 0, page: 1, pageSize: 12, totalPages: 1 };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold">Search</h1>
      <form className="mt-6 flex gap-2" action="/search" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search headlines, tags..."
          className="flex-1 rounded-lg border px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded-lg bg-[#2563EB] px-4 py-2 text-sm font-medium text-white"
        >
          Search
        </button>
      </form>

      {q && (
        <p className="mt-4 text-sm text-muted-foreground">
          {data.total} result{data.total === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
        </p>
      )}

      <div className="mt-8">
        {q ? (
          <NewsGrid articles={data.items} />
        ) : (
          <p className="text-muted-foreground">Enter a search term to find articles.</p>
        )}
      </div>

      {q && (
        <PaginationControls
          page={data.page}
          totalPages={data.totalPages}
          basePath="/search"
          query={{ q, category: params.category }}
        />
      )}
    </div>
  );
}
