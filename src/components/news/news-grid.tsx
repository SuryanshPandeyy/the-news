import { NewsCard } from "@/components/news/news-card";
import type { ArticleListItem } from "@/lib/types";

export function NewsGrid({ articles }: { articles: ArticleListItem[] }) {
  if (!articles.length) {
    return (
      <p className="py-12 text-center text-muted-foreground">
        No articles to display yet.
      </p>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {articles.map((article, i) => (
        <NewsCard key={article._id} article={article} priority={i < 3} />
      ))}
    </div>
  );
}
