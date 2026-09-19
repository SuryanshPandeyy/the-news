"use client";

import Link from "next/link";
import { ArticleDateLabel, CategoryBadge } from "@/components/editorial/category-meta";
import { ContinueReading } from "@/components/editorial/continue-reading";
import { SectionHeader } from "@/components/editorial/section-header";
import { useLocale } from "@/components/providers/locale-provider";
import type { ArticleListItem } from "@/lib/types";
import { newsArticlePath } from "@/lib/utils/slug";

export function HomeLatestColumn({ articles }: { articles: ArticleListItem[] }) {
  const { t } = useLocale();

  return (
    <div className="col-span-1 mt-10 flex flex-col md:col-span-12 lg:col-span-4 lg:mt-0 lg:border-r lg:border-gray-200 lg:px-8">
      <SectionHeader title={t("latestNews")} href="/today" />

      <div className="flex flex-col space-y-6">
        {articles.length === 0 && (
          <p className="font-serif text-[15px] text-gray-600">—</p>
        )}
        {articles.map((item) => {
          const date = item.publishedAt ?? item.createdAt;
          const href = newsArticlePath(item.slug);
          return (
            <article
              key={item._id}
              className="group cursor-pointer border-b border-dashed border-gray-200 pb-6 last:border-b-0 last:pb-0"
            >
              <div className="mb-2 flex items-center space-x-3">
                {item.category && <CategoryBadge>{item.category.name}</CategoryBadge>}
                <ArticleDateLabel date={date} />
              </div>

              <Link href={href}>
                <h3 className="mb-2 pr-2 text-[20px] font-bold leading-tight transition-colors group-hover:text-blue-700">
                  {item.title}
                </h3>
              </Link>

              {item.excerpt && (
                <p className="mb-3 line-clamp-2 pr-4 font-serif text-[15px] leading-snug text-gray-600">
                  {item.excerpt}
                </p>
              )}

              <ContinueReading href={href} />
            </article>
          );
        })}
      </div>
    </div>
  );
}
