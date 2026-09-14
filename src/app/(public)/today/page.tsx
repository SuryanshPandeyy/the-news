import { NewsGrid } from "@/components/news/news-grid";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { getArticlesPaginated } from "@/lib/queries/articles";
import { formatDateIST } from "@/lib/timezone";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const label = formatDateIST(new Date(), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return {
    title: `Today's News — ${label}`,
    description: "Stories published today (Asia/Kolkata).",
  };
}

export default async function TodayPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; category?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const data = await getArticlesPaginated({
    page,
    pageSize: 12,
    todayOnly: true,
    status: "published",
    categorySlug: params.category,
  });

  const dateLabel = formatDateIST(new Date(), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <h1 className="font-serif text-3xl font-bold text-[#0F172A]">Today&apos;s News</h1>
      <p className="mt-1 text-muted-foreground">{dateLabel} · Asia/Kolkata</p>
      <div className="mt-8">
        <NewsGrid articles={data.items} />
      </div>
      <PaginationControls
        page={data.page}
        totalPages={data.totalPages}
        basePath="/today"
        query={{ category: params.category }}
      />
    </div>
  );
}
