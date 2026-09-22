"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import type { ArticleListItem } from "@/lib/types";
import { newsArticlePath } from "@/lib/utils/slug";

export function HomeBreakingTicker({ articles }: { articles: ArticleListItem[] }) {
  const { t } = useLocale();
  if (!articles.length) return null;

  const items = [...articles, ...articles];

  return (
    <div className="flex overflow-hidden rounded-md bg-[#111111] text-white shadow-sm">
      <div className="flex shrink-0 items-center bg-[#e71920] px-4 py-3 text-sm font-bold">
        <span className="mr-2">⚡</span>
        {t("breaking")}
      </div>
      <div className="min-w-0 flex-1 overflow-hidden">
        <div className="flex h-full min-w-max animate-marquee items-center">
          {items.map((article, index) => (
            <span key={`${article._id}-${index}`} className="flex items-center">
              <Link
                href={newsArticlePath(article.slug)}
                className="px-6 text-sm font-medium hover:text-red-300"
              >
                {article.title}
              </Link>
              <span className="text-gray-600">|</span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
