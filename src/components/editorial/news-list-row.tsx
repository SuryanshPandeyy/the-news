import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ArticleImage } from "@/components/editorial/article-image";
import { formatDateIST } from "@/lib/timezone";
import type { ArticleListItem } from "@/lib/types";
import { newsArticlePath } from "@/lib/utils/slug";

export function NewsListRow({ article }: { article: ArticleListItem }) {
  const date = article.publishedAt ?? article.createdAt;

  return (
    <article className="group flex gap-4 border-b border-gray-300 py-4 last:border-b-0">
      <Link
        href={newsArticlePath(article.slug)}
        className="h-[84px] w-[135px] shrink-0 overflow-hidden rounded-md bg-gray-200"
      >
        <ArticleImage
          src={article.featuredImage}
          alt={article.title}
          seed={article._id}
          width={135}
          height={84}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </Link>

      <div className="min-w-0 flex-1">
        <Link href={newsArticlePath(article.slug)}>
          <h3 className="line-clamp-2 text-[17px] font-bold leading-snug text-gray-900 transition-colors group-hover:text-[#c90000]">
            {article.title}
          </h3>
        </Link>
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-gray-600">
          <span>{formatDateIST(date, { dateStyle: "medium" })}</span>
          {article.category?.name && (
            <>
              <span>|</span>
              <span>{article.category.name}</span>
            </>
          )}
        </div>
      </div>

      <Link
        href={newsArticlePath(article.slug)}
        className="mt-6 hidden h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#e71920] text-white transition hover:bg-[#bd1117] sm:flex"
        aria-hidden
      >
        <ChevronRight size={18} />
      </Link>
    </article>
  );
}
