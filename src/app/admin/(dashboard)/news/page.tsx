import Link from "next/link";
import { NewsTable } from "@/components/admin/news-table";
import { getArticlesPaginated } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";

const placementFilters = [
  { key: "featured", label: "Featured (hero)" },
  { key: "breaking", label: "Breaking" },
  { key: "trending", label: "Trending" },
  { key: "editorsPick", label: "Editor's pick" },
] as const;

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

  const data = await getArticlesPaginated({
    page,
    pageSize: 20,
    admin: true,
    status,
    featured: params.featured === "1" ? true : undefined,
    breaking: params.breaking === "1" ? true : undefined,
    trending: params.trending === "1" ? true : undefined,
    editorsPick: params.editorsPick === "1" ? true : undefined,
  });

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
          <h1 className="text-2xl font-bold">Stories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Maps to homepage columns: Featured hero, Latest, Most read (views), plus category
            editor&apos;s picks.
          </p>
        </div>
        <Link
          href="/admin/news/create"
          className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          New story
        </Link>
      </div>

      <div className="flex flex-wrap gap-3 text-sm">
        <Link href="/admin/news" className="font-medium hover:underline">
          All
        </Link>
        <Link href="/admin/news?status=published" className="hover:underline">
          Published
        </Link>
        <Link href="/admin/news?status=draft" className="hover:underline">
          Drafts
        </Link>
        <span className="text-muted-foreground">|</span>
        {placementFilters.map((f) => (
          <Link
            key={f.key}
            href={filterHref({ [f.key]: "1", status: status ?? undefined })}
            className="hover:underline"
          >
            {f.label}
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
