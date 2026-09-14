import Link from "next/link";
import { NewsTable } from "@/components/admin/news-table";
import { getArticlesPaginated } from "@/lib/queries/articles";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; status?: string }>;
}) {
  const params = await searchParams;
  const page = Number(params.page ?? 1);
  const status = params.status === "draft" || params.status === "published"
    ? params.status
    : undefined;

  const data = await getArticlesPaginated({
    page,
    pageSize: 20,
    admin: true,
    status,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">News</h1>
        <Link
          href="/admin/news/create"
          className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm text-primary-foreground"
        >
          Create
        </Link>
      </div>
      <div className="flex gap-2 text-sm">
        <Link href="/admin/news" className="underline-offset-4 hover:underline">All</Link>
        <Link href="/admin/news?status=published" className="underline-offset-4 hover:underline">Published</Link>
        <Link href="/admin/news?status=draft" className="underline-offset-4 hover:underline">Drafts</Link>
      </div>
      <NewsTable articles={data.items} />
      <p className="text-sm text-muted-foreground">
        Page {data.page} of {data.totalPages} ({data.total} total)
      </p>
    </div>
  );
}
