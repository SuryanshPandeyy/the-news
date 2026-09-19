import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats, getArticlesPaginated } from "@/lib/queries/articles";
import { isDbConfigured } from "@/lib/db/connect";
import { formatDateIST } from "@/lib/timezone";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  if (!isDbConfigured()) {
    return (
      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-6">
        <h1 className="text-lg font-semibold">Database not configured</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Set MONGODB_URI in your environment to use the CMS.
        </p>
      </div>
    );
  }

  const [stats, recent] = await Promise.all([
    getAdminStats(),
    getArticlesPaginated({ page: 1, pageSize: 8, admin: true, status: "published" }),
  ]);

  const editorialCards = [
    { label: "Featured (hero column)", value: stats.featured, href: "/admin/news?featured=1&status=published" },
    { label: "Breaking", value: stats.breaking, href: "/admin/news?breaking=1&status=published" },
    { label: "Trending", value: stats.trending, href: "/admin/news?trending=1&status=published" },
    { label: "Editor's picks", value: stats.editorsPick, href: "/admin/news?editorsPick=1&status=published" },
  ];

  const overviewCards = [
    { label: "Published", value: stats.published },
    { label: "Drafts", value: stats.drafts },
    { label: "Categories", value: stats.categories, href: "/admin/categories" },
    { label: "Subscribers", value: stats.subscribers, href: "/admin/subscribers" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Editorial dashboard</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Counts match flags on each story and what the public site displays.
          </p>
        </div>
        <Link
          href="/admin/news/create"
          className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
        >
          New story
        </Link>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Homepage placement
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {editorialCards.map((card) => (
            <Link key={card.label} href={card.href}>
              <Card className="transition-shadow hover:shadow-md">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{card.value}</p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Overview
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {overviewCards.map((card) =>
            card.href ? (
              <Link key={card.label} href={card.href}>
                <Card className="transition-shadow hover:shadow-md">
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                      {card.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </CardContent>
                </Card>
              </Link>
            ) : (
              <Card key={card.label}>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {card.label}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">{card.value}</p>
                </CardContent>
              </Card>
            ),
          )}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Recently published</h2>
          <Link href="/admin/news" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="overflow-hidden rounded-lg border">
          <table className="w-full text-sm">
            <thead className="border-b bg-muted/50">
              <tr>
                <th className="px-4 py-2 text-left font-medium">Title</th>
                <th className="px-4 py-2 text-left font-medium">Category</th>
                <th className="px-4 py-2 text-left font-medium">Published</th>
                <th className="px-4 py-2 text-right font-medium">Views</th>
              </tr>
            </thead>
            <tbody>
              {recent.items.map((a) => (
                <tr key={a._id} className="border-b last:border-0">
                  <td className="px-4 py-3">
                    <Link href={`/admin/news/${a._id}/edit`} className="font-medium hover:underline">
                      {a.title}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{a.category?.name ?? "—"}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {a.publishedAt
                      ? formatDateIST(a.publishedAt, { dateStyle: "medium" })
                      : "—"}
                  </td>
                  <td className="px-4 py-3 text-right tabular-nums">{a.views ?? 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
