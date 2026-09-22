import { NewsListRow } from "@/components/editorial/news-list-row";
import { NewsSectionHeader } from "@/components/editorial/news-section-header";
import { PaginationControls } from "@/components/shared/pagination-controls";
import type { ArticleListItem } from "@/lib/types";

export function SectionNewsListPage({
  title,
  subtitle,
  articles,
  page,
  totalPages,
  basePath,
}: {
  title: string;
  subtitle?: string;
  articles: ArticleListItem[];
  page: number;
  totalPages: number;
  basePath: string;
}) {
  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-5">
      <NewsSectionHeader title={title} />
      {subtitle && <p className="mb-6 text-sm font-medium text-gray-600">{subtitle}</p>}

      <div className="rounded-md bg-white px-4 shadow-sm">
        {articles.length > 0 ? (
          articles.map((article) => <NewsListRow key={article._id} article={article} />)
        ) : (
          <p className="py-12 text-center text-gray-500">No stories yet.</p>
        )}
      </div>

      <PaginationControls page={page} totalPages={totalPages} basePath={basePath} />
    </div>
  );
}
