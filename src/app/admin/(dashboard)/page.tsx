import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getAdminStats } from "@/lib/queries/articles";
import { getArticlesPaginated } from "@/lib/queries/articles";
import { NewsCard } from "@/components/news/news-card";
import { isDbConfigured } from "@/lib/db/connect";

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
    getArticlesPaginated({ page: 1, pageSize: 5, admin: true }),
  ]);

  const cards = [
    { label: "Total news", value: stats.total },
    { label: "Published", value: stats.published },
    { label: "Drafts", value: stats.drafts },
    { label: "Categories", value: stats.categories },
    { label: "Subscribers", value: stats.subscribers },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link
          href="/admin/news/create"
          className="inline-flex h-8 items-center justify-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/80"
        >
          Create news
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        {cards.map((card) => (
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
        ))}
      </div>

      <section>
        <h2 className="mb-4 text-lg font-semibold">Recent articles</h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {recent.items.map((article) => (
            <NewsCard key={article._id} article={article} variant="horizontal" />
          ))}
        </div>
      </section>
    </div>
  );
}
