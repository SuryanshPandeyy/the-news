"use client";

import Link from "next/link";
import { ArticleImage } from "@/components/editorial/article-image";
import { ArticleDateLabel, CategoryBadge } from "@/components/editorial/category-meta";
import { ContinueReading } from "@/components/editorial/continue-reading";
import { SectionHeader } from "@/components/editorial/section-header";
import { useLocale } from "@/components/providers/locale-provider";
import type { ArticleListItem } from "@/lib/types";

export function HomeFeaturedColumn({
  article,
  thumbnails,
  sectionTitle = "Featured",
}: {
  article: ArticleListItem | null;
  thumbnails: ArticleListItem[];
  sectionTitle?: string;
}) {
  const { t } = useLocale();

  if (!article) {
    return (
      <div className="col-span-1 flex flex-col md:col-span-12 lg:col-span-4 lg:border-r lg:border-gray-200 lg:pr-8">
        <SectionHeader title={sectionTitle} href="/search" />
        <p className="font-serif text-[15px] text-gray-600">—</p>
      </div>
    );
  }

  const date = article.publishedAt ?? article.createdAt;
  const href = `/news/${article.slug}`;

  return (
    <div className="col-span-1 flex flex-col md:col-span-12 lg:col-span-4 lg:border-r lg:border-gray-200 lg:pr-8">
      <SectionHeader
        title={sectionTitle}
        href={`/category/${article.category.slug}`}
        links={[
          { label: t("latest"), href: "/today", active: true },
          { label: t("trending"), href: "/search?q=trending" },
        ]}
      />

      <article className="group flex flex-col">
        <Link href={href} className="relative mb-3 aspect-[4/3] w-full overflow-hidden bg-gray-100">
          <span className="absolute left-0 top-0 z-10 border-b border-r border-gray-200 bg-white px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-black">
            {article.sectionLabel || article.category.name}
          </span>
          <ArticleImage
            src={article.featuredImage}
            alt={article.featuredImageAlt || article.title}
            seed={article._id}
            fill
            sizes="(max-width: 1024px) 100vw, 33vw"
            className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
          />
        </Link>

        <ArticleDateLabel date={date} />

        <Link href={href}>
          <h3 className="mb-3 pr-4 text-[26px] font-bold leading-[1.1] transition-colors group-hover:text-blue-700">
            {article.title}
          </h3>
        </Link>

        {article.excerpt && (
          <p className="mb-4 line-clamp-2 font-serif text-[15px] leading-snug text-gray-600">
            {article.excerpt}
          </p>
        )}

        {thumbnails.length > 0 && (
          <div className="mb-5 flex space-x-1">
            {thumbnails.slice(0, 3).map((thumb, i) => (
              <Link
                key={thumb._id}
                href={`/news/${thumb.slug}`}
                className="relative aspect-[16/9] w-1/3 overflow-hidden bg-gray-200"
              >
                <ArticleImage
                  src={thumb.featuredImage}
                  alt={thumb.featuredImageAlt || thumb.title}
                  seed={`${thumb._id}-${i}`}
                  fill
                  sizes="120px"
                  className="transition-opacity hover:opacity-90"
                />
              </Link>
            ))}
          </div>
        )}

        <ContinueReading href={href} />
      </article>
    </div>
  );
}
