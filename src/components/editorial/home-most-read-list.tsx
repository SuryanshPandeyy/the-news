import Link from "next/link";
import { formatDateIST } from "@/lib/timezone";
import type { ArticleListItem } from "@/lib/types";
import { newsArticlePath } from "@/lib/utils/slug";
import { NewsSectionHeader } from "@/components/editorial/news-section-header";

export function HomeMostReadList({
  title,
  articles,
}: {
  title: string;
  articles: ArticleListItem[];
}) {
  if (!articles.length) return null;

  return (
    <section>
      <NewsSectionHeader title={title} />
      <div className="space-y-0">
        {articles.map((article, index) => {
          const date = article.publishedAt ?? article.createdAt;
          return (
            <article
              key={article._id}
              className="group flex gap-3 border-b border-gray-300 py-4 last:border-b-0"
            >
              <span className="mt-1 text-3xl font-black leading-none text-[#e71920]">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <Link href={newsArticlePath(article.slug)}>
                  <h3 className="text-[16px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#c90000]">
                    {article.title}
                  </h3>
                </Link>
                <p className="mt-2 text-xs text-gray-600">
                  {formatDateIST(date, { dateStyle: "medium" })}
                </p>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
