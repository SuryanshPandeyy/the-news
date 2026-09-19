import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { ArticleImage } from "@/components/editorial/article-image";
import { ArticleDateLabel } from "@/components/editorial/category-meta";
import { ContinueReading } from "@/components/editorial/continue-reading";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { getCategoryFeed } from "@/lib/queries/articles";
import { getCategoryBySlug } from "@/lib/queries/categories";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/messages";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const { slug } = await params;
  const sp = await searchParams;
  const page = Number(sp.page ?? 1);
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const { hero, editorPicks, gridArticles, pagination } = await getCategoryFeed(slug, page, 12);
  const locale = await getLocale();

  return (
    <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-12">
      <div className="mb-10 flex items-end justify-between border-b-[3px] border-black pb-4">
        <h1 className="text-5xl font-black leading-none text-black md:text-6xl">
          {category.name}
        </h1>
        <div className="hidden space-x-4 md:flex">
          <span className="cursor-pointer text-sm font-bold uppercase text-black">{t("latest", locale)}</span>
          <Link
            href={`/category/${slug}?page=1`}
            className="text-sm font-bold uppercase text-gray-500 hover:text-black"
          >
            {t("archive", locale)}
          </Link>
        </div>
      </div>

      {hero && (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-8">
            <article className="group flex flex-col">
              <Link
                href={`/news/${hero.slug}`}
                className="relative mb-4 aspect-[16/9] w-full overflow-hidden bg-gray-100"
              >
                <ArticleImage
                  src={hero.featuredImage}
                  alt={hero.featuredImageAlt || hero.title}
                  seed={hero._id}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="transition-transform duration-500 ease-out group-hover:scale-[1.02]"
                />
              </Link>
              <ArticleDateLabel date={hero.publishedAt ?? hero.createdAt} />
              <Link href={`/news/${hero.slug}`}>
                <h2 className="mb-4 pr-4 text-[32px] font-bold leading-tight transition-colors group-hover:text-blue-700 md:text-[40px]">
                  {hero.title}
                </h2>
              </Link>
              {hero.excerpt && (
                <p className="mb-4 font-serif text-[18px] leading-relaxed text-gray-600">
                  {hero.excerpt}
                </p>
              )}
              <ContinueReading href={`/news/${hero.slug}`} />
            </article>
          </div>

          <div className="border-t border-gray-200 pt-8 lg:col-span-4 lg:border-t-0 lg:border-l lg:pl-8 lg:pt-0">
            <h3 className="mb-6 flex items-center text-xl font-bold">
              {t("editorsPicks", locale)}
              <ChevronRight className="ml-1 h-4 w-4 text-gray-400" />
            </h3>
            <div className="flex flex-col space-y-6">
              {editorPicks.map((item) => (
                <article
                  key={item._id}
                  className="group border-b border-dashed border-gray-200 pb-6 last:border-b-0 last:pb-0"
                >
                  <ArticleDateLabel date={item.publishedAt ?? item.createdAt} />
                  <Link href={`/news/${item.slug}`}>
                    <h4 className="text-[16px] font-bold leading-tight transition-colors group-hover:text-blue-700">
                      {item.title}
                    </h4>
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-16 border-t-2 border-black pt-10">
        <h3 className="mb-8 text-2xl font-bold">
          {t("moreFrom", locale)} {category.name}
        </h3>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {gridArticles.map((article) => (
            <article key={article._id} className="group flex flex-col">
              <Link
                href={`/news/${article.slug}`}
                className="relative mb-3 aspect-video w-full overflow-hidden bg-gray-100"
              >
                <ArticleImage
                  src={article.featuredImage}
                  alt={article.featuredImageAlt || article.title}
                  seed={article._id}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                />
              </Link>
              <ArticleDateLabel date={article.publishedAt ?? article.createdAt} />
              <Link href={`/news/${article.slug}`}>
                <h4 className="mb-2 text-[20px] font-bold leading-tight transition-colors group-hover:text-blue-700">
                  {article.title}
                </h4>
              </Link>
              {article.excerpt && (
                <p className="line-clamp-3 font-serif text-[14px] leading-relaxed text-gray-600">
                  {article.excerpt}
                </p>
              )}
            </article>
          ))}
        </div>
        <PaginationControls
          page={pagination.page}
          totalPages={pagination.totalPages}
          basePath={`/category/${slug}`}
        />
      </div>
    </div>
  );
}
