import { HomeLatestColumn } from "@/components/editorial/home-latest-column";
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
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-12">
      <div className="mb-10 border-b-[3px] border-black pb-4">
        <h1 className="text-5xl font-black leading-none text-black md:text-6xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm font-medium text-gray-500">{subtitle}</p>}
      </div>
      <div className="max-w-2xl">
        <HomeLatestColumn articles={articles} />
      </div>
      <PaginationControls page={page} totalPages={totalPages} basePath={basePath} />
    </div>
  );
}
