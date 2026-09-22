import Link from "next/link";
import { ArticleImage } from "@/components/editorial/article-image";
import { formatDateIST } from "@/lib/timezone";
import type { ArticleListItem } from "@/lib/types";
import { newsArticlePath } from "@/lib/utils/slug";

export function HomeSidebarCards({
  title,
  actionLabel,
  actionHref,
  articles,
}: {
  title: string;
  actionLabel: string;
  actionHref: string;
  articles: ArticleListItem[];
}) {
  if (!articles.length) return null;

  return (
    <section className="bg-[#171717] p-4 text-white">
      <div className="mb-4 flex items-center justify-between border-b border-gray-600 pb-2">
        <div className="flex items-center gap-3">
          <span className="h-6 w-1.5 bg-[#e71920]" />
          <h2 className="text-2xl font-black">{title}</h2>
        </div>
        <Link href={actionHref} className="text-sm font-semibold text-red-500 hover:text-red-400">
          {actionLabel}
        </Link>
      </div>

      <div className="space-y-3">
        {articles.map((item) => {
          const date = item.publishedAt ?? item.createdAt;
          return (
            <article
              key={item._id}
              className="group flex gap-3 border-b border-white/15 pb-3 last:border-0 last:pb-0"
            >
              <Link
                href={newsArticlePath(item.slug)}
                className="h-[98px] w-[145px] shrink-0 overflow-hidden rounded-lg bg-gray-800"
              >
                <ArticleImage
                  src={item.featuredImage}
                  alt={item.title}
                  seed={item._id}
                  width={145}
                  height={98}
                  className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                />
              </Link>
              <div className="min-w-0 pt-1">
                <Link href={newsArticlePath(item.slug)}>
                  <h3 className="line-clamp-3 text-[15px] font-bold leading-[1.22] text-white group-hover:text-red-300">
                    {item.title}
                  </h3>
                </Link>
                <div className="mt-2 text-[11px] text-gray-400">
                  {formatDateIST(date, { dateStyle: "medium" })}
                  {item.category?.name && (
                    <>
                      {" "}
                      | {item.category.name}
                    </>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
