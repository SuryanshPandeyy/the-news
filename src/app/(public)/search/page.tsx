import { HomeLatestColumn } from "@/components/editorial/home-latest-column";
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
  searchParams: Promise<{ q?: string; page?: string }>;
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
      })
    : { items: [], total: 0, page: 1, pageSize: 12, totalPages: 1 };

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-12">
      <h1 className="mb-6 text-5xl font-black text-black">Search</h1>
      <form className="mb-8 flex max-w-xl gap-2" action="/search" method="get">
        <input
          name="q"
          defaultValue={q}
          placeholder="Search headlines, tags..."
          className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm"
        />
        <button
          type="submit"
          className="rounded bg-black px-4 py-2 text-sm font-bold text-white hover:bg-gray-800"
        >
          Search
        </button>
      </form>

      {q && (
        <p className="mb-6 text-sm text-gray-500">
          {data.total} result{data.total === 1 ? "" : "s"} for &ldquo;{q}&rdquo;
        </p>
      )}

      {q ? (
        <div className="max-w-2xl">
          <HomeLatestColumn articles={data.items} />
          <PaginationControls
            page={data.page}
            totalPages={data.totalPages}
            basePath="/search"
            query={{ q }}
          />
        </div>
      ) : (
        <p className="font-serif text-gray-600">Enter a search term to find articles.</p>
      )}
    </div>
  );
}
