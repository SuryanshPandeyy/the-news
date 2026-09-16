import Link from "next/link";
import { ArticleImage } from "@/components/editorial/article-image";
import { ArticleDateLabel, CategoryBadge } from "@/components/editorial/category-meta";
import { ContinueReading } from "@/components/editorial/continue-reading";
import { SectionHeader } from "@/components/editorial/section-header";
import type { ArticleListItem } from "@/lib/types";

export function HomeMostReadColumn({
  articles,
  embedded,
}: {
  articles: ArticleListItem[];
  embedded?: boolean;
}) {
  return (
    <div
      className={
        embedded
          ? "flex flex-col"
          : "col-span-1 mt-10 flex flex-col md:col-span-12 lg:col-span-4 lg:mt-0 lg:pl-8"
      }
    >
      <SectionHeader title="Most Read" href="/search" />

      <div className="flex flex-col space-y-6">
        {articles.map((item) => {
          const date = item.publishedAt ?? item.createdAt;
          const href = `/news/${item.slug}`;
          return (
            <article
              key={item._id}
              className="group flex items-start justify-between gap-4"
            >
              <div className="min-w-0 flex-1">
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <CategoryBadge>{item.category.name}</CategoryBadge>
                  <ArticleDateLabel date={date} />
                </div>

                <Link href={href}>
                  <h3 className="mb-2 text-[15px] font-bold leading-tight transition-colors group-hover:text-blue-700">
                    {item.title}
                  </h3>
                </Link>

                <ContinueReading href={href} />
              </div>

              <Link
                href={href}
                className="relative ml-2 aspect-[16/10] w-[120px] shrink-0 overflow-hidden bg-gray-100"
              >
                <ArticleImage
                  src={item.featuredImage}
                  alt={item.featuredImageAlt || item.title}
                  seed={item._id}
                  fill
                  sizes="120px"
                  className="transition-opacity group-hover:opacity-90"
                />
              </Link>
            </article>
          );
        })}
      </div>
    </div>
  );
}
