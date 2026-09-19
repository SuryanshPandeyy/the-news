import { SectionNewsListPage } from "@/components/news/section-news-list-page";
import { getArticlesPaginated } from "@/lib/queries/articles";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  const locale = await getLocale();
  return {
    title: t("breaking", locale),
    description: "Breaking news stories.",
  };
}

export default async function BreakingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const locale = await getLocale();
  const data = await getArticlesPaginated({
    page,
    pageSize: 12,
    breaking: true,
    status: "published",
  });

  return (
    <SectionNewsListPage
      title={t("breaking", locale)}
      subtitle={t("breakingPageDesc", locale)}
      articles={data.items}
      page={data.page}
      totalPages={data.totalPages}
      basePath="/breaking"
    />
  );
}
