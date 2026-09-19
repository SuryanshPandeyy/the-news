import Link from "next/link";
import { NewsTable } from "@/components/admin/news-table";
import { getArticlesPaginated } from "@/lib/queries/articles";
import { getLocale } from "@/lib/i18n/locale";
import { t, type MessageKey } from "@/lib/i18n/messages";

export const dynamic = "force-dynamic";

const placementFilters: { key: string; labelKey: MessageKey }[] = [
  { key: "featured", labelKey: "placementFiltersFeatured" },
  { key: "breaking", labelKey: "breaking" },
  { key: "trending", labelKey: "trending" },
  { key: "editorsPick", labelKey: "editorsPick" },
];

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{
    page?: string;
    status?: string;
    featured?: string;
    breaking?: string;
    trending?: string;
    editorsPick?: string;
  }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const status =
    params.status === "draft" || params.status === "published"
      ? params.status
      : undefined;

  const [data, locale] = await Promise.all([
    getArticlesPaginated({
      page,
      pageSize: 20,
      admin: true,
      status,
      featured: params.featured === "1" ? true : undefined,
      breaking: params.breaking === "1" ? true : undefined,
      trending: params.trending === "1" ? true : undefined,
      editorsPick: params.editorsPick === "1" ? true : undefined,
    }),
    getLocale(),
  ]);

  function filterHref(extra: Record<string, string | undefined>) {
    const q = new URLSearchParams();
    if (status) q.set("status", status);
    Object.entries(extra).forEach(([k, v]) => {
      if (v) q.set(k, v);
    });
    const qs = q.toString();
    return qs ? `/admin/news?${qs}` : "/admin/news";
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-black">{t("stories", locale)}</h1>
        </div>
        <Link
          href="/admin/news/create"
          className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          {t("newStory", locale)}
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/admin/news" className="font-medium hover:underline">
          {t("all", locale)}
        </Link>
        <Link href="/admin/news?status=published" className="hover:underline">
          {t("published", locale)}
        </Link>
        <Link href="/admin/news?status=draft" className="hover:underline">
          {t("drafts", locale)}
        </Link>
        <span className="text-muted-foreground">|</span>
        {placementFilters.map((f) => (
          <Link
            key={f.key}
            href={filterHref({ [f.key]: "1", status: status ?? undefined })}
            className="hover:underline"
          >
            {t(f.labelKey, locale)}
          </Link>
        ))}
      </div>

      <NewsTable articles={data.items} />
      <p className="text-sm text-muted-foreground">
        Page {data.page} of {data.totalPages} ({data.total} total)
      </p>
    </div>
  );
}
