"use client";

import Link from "next/link";
import type { ArticleListItem } from "@/lib/types";

export function BreakingNewsTicker({ articles }: { articles: ArticleListItem[] }) {
  if (!articles.length) return null;

  return (
    <div className="border-b border-[#DC2626]/20 bg-[#DC2626]/5">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-2">
        <span className="shrink-0 rounded bg-[#DC2626] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">
          Breaking
        </span>
        <div className="relative min-w-0 flex-1 overflow-hidden">
          <div className="flex animate-marquee gap-8 whitespace-nowrap">
            {[...articles, ...articles].map((article, i) => (
              <Link
                key={`${article._id}-${i}`}
                href={`/news/${article.slug}`}
                className="text-sm font-medium text-[#0F172A] hover:text-[#2563EB] dark:text-foreground"
              >
                {article.title}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
