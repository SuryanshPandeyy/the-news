import { HomeLatestColumn } from "@/components/editorial/home-latest-column";
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
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const data = await getArticlesPaginated({
    page,
    pageSize: 12,
    todayOnly: true,
    status: "published",
  });

  const dateLabel = formatDateIST(new Date(), {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-12">
      <div className="mb-10 border-b-[3px] border-black pb-4">
        <h1 className="text-5xl font-black leading-none text-black md:text-6xl">
          Today&apos;s News
        </h1>
        <p className="mt-2 text-sm font-medium text-gray-500">{dateLabel} · Asia/Kolkata</p>
      </div>
      <div className="max-w-2xl">
        <HomeLatestColumn articles={data.items} />
      </div>
      <PaginationControls page={data.page} totalPages={data.totalPages} basePath="/today" />
    </div>
  );
}
