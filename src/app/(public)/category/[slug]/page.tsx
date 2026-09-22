import Link from "next/link";
import { notFound } from "next/navigation";
import { ArticleImage } from "@/components/editorial/article-image";
import { ContinueReading } from "@/components/editorial/continue-reading";
import { NewsListRow } from "@/components/editorial/news-list-row";
import { NewsSectionHeader } from "@/components/editorial/news-section-header";
import { PaginationControls } from "@/components/shared/pagination-controls";
import { formatDateIST } from "@/lib/timezone";
import { getCategoryFeed } from "@/lib/queries/articles";
import { getCategoryBySlug } from "@/lib/queries/categories";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/messages";
import { newsArticlePath } from "@/lib/utils/slug";

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

  const { hero, gridArticles, pagination } = await getCategoryFeed(category.slug, page, 12);
  const locale = await getLocale();

  return (
    <div className="mx-auto max-w-[1500px] px-4 py-8 sm:px-5">
      <NewsSectionHeader title={category.name} />

      {hero && (
        <article className="group mb-8 overflow-hidden rounded-md bg-white shadow-sm">
          <Link
            href={newsArticlePath(hero.slug)}
            className="relative block aspect-[16/9] w-full overflow-hidden bg-gray-200"
          >
            <ArticleImage
              src={hero.featuredImage}
              alt={hero.featuredImageAlt || hero.title}
              seed={hero._id}
              fill
              sizes="(max-width: 1024px) 100vw, 80vw"
              className="object-cover transition duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
              <span className="inline-flex bg-[#e71920] px-3 py-1 text-xs font-bold text-white">
                {category.name}
              </span>
              <h2 className="mt-3 max-w-4xl text-2xl font-black leading-tight text-white sm:text-4xl">
                {hero.title}
              </h2>
              {hero.excerpt && (
                <p className="mt-2 line-clamp-2 max-w-3xl text-sm text-gray-200 sm:text-base">
                  {hero.excerpt}
                </p>
              )}
              <p className="mt-3 text-xs text-gray-300">
                {formatDateIST(hero.publishedAt ?? hero.createdAt, { dateStyle: "medium" })}
              </p>
            </div>
          </Link>
          <div className="px-5 py-4">
            <ContinueReading href={newsArticlePath(hero.slug)} />
          </div>
        </article>
      )}

      {gridArticles.length > 0 ? (
        <section>
          <NewsSectionHeader
            title={`${t("moreFrom", locale)} ${category.name}`}
          />
          <div className="rounded-md bg-white px-4 shadow-sm">
            {gridArticles.map((article) => (
              <NewsListRow key={article._id} article={article} />
            ))}
          </div>
          <PaginationControls
            page={pagination.page}
            totalPages={pagination.totalPages}
            basePath={`/category/${slug}`}
          />
        </section>
      ) : (
        <div className="rounded-md bg-white px-4 py-16 text-center text-gray-500 shadow-sm">
          No published stories in this category yet.
        </div>
      )}
    </div>
  );
}
