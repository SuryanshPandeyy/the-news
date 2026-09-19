import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleBody } from "@/components/news/article-body";
import { ArticleImage } from "@/components/editorial/article-image";
import { ArticlePageMedia } from "@/components/editorial/article-page-media";
import { ArticleDateLabel, CategoryBadge } from "@/components/editorial/category-meta";
import { HomeMostReadColumn } from "@/components/editorial/home-most-read-column";
import { SocialShare } from "@/components/social/social-share";
import {
  getArticleBySlug,
  getMostReadArticles,
  getRelatedArticles,
  incrementArticleViews,
} from "@/lib/queries/articles";
import { placeholderImage } from "@/lib/images/placeholders";
import { getSiteUrl } from "@/lib/site";
import { getReadingTimeMinutes } from "@/lib/utils/reading-time";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/messages";
import { newsArticlePath } from "@/lib/utils/slug";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: article.featuredImage ? [article.featuredImage] : [placeholderImage(slug)],
      type: "article",
      publishedTime: article.publishedAt,
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  void incrementArticleViews(slug);

  const [related, mostRead, locale] = await Promise.all([
    getRelatedArticles(article.category?._id, article.slug),
    getMostReadArticles(5),
    getLocale(),
  ]);

  const url = `${getSiteUrl()}${newsArticlePath(article.slug)}`;
  const published = article.publishedAt ?? article.createdAt;
  const readingTime = getReadingTimeMinutes(article.content);
  const heroImage = article.images?.[0]?.url ?? article.featuredImage;

  const mediaImages =
    article.images && article.images.length > 0
      ? article.images
      : heroImage
        ? [{ url: heroImage }]
        : [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: heroImage ? [heroImage] : [placeholderImage(slug)],
    datePublished: published,
    dateModified: article.updatedAt,
    author: [{ "@type": "Person", name: article.author ?? "Editorial Desk" }],
    ...(article.category?.name ? { articleSection: article.category.name } : {}),
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href="/"
        className="group mb-8 flex items-center text-sm font-bold text-gray-600 transition-colors hover:text-black"
      >
        <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
        {t("backToHome", locale)}
      </Link>

      <header className="mb-8">
        <div className="mb-6 flex items-center space-x-3">
          {article.category && <CategoryBadge>{article.category.name}</CategoryBadge>}
          <ArticleDateLabel date={published} />
        </div>

        <h1 className="mb-6 pr-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          {article.title}
        </h1>

        <div className="flex flex-col justify-between gap-4 border-y border-gray-200 py-4 sm:flex-row sm:items-center">
          <div className="flex items-center space-x-4">
            <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
              <ArticleImage
                src={null}
                alt={article.author ?? "Author"}
                seed={article.author}
                fill
                sizes="40px"
              />
            </div>
            <div>
              <p className="text-sm font-bold text-gray-900">
                {t("by", locale)} {article.author}
              </p>
              <p className="text-xs text-gray-500">
                {readingTime} {t("minRead", locale)}
              </p>
            </div>
          </div>
          <SocialShare url={url} title={article.title} />
        </div>
      </header>

      {mediaImages.length > 0 && (
        <ArticlePageMedia
          images={mediaImages}
          title={article.title}
          articleId={article._id}
          heroAlt={article.featuredImageAlt || article.title}
        />
      )}

      <div className="prose prose-lg mx-auto max-w-2xl font-serif text-gray-800">
        <ArticleBody html={article.content} />
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-12 max-w-2xl border-t border-gray-200 pt-8">
          <h2 className="mb-4 text-xl font-bold">{t("relatedStories", locale)}</h2>
          <ul className="space-y-3">
            {related.map((a) => (
              <li key={a._id}>
                <Link
                  href={newsArticlePath(a.slug)}
                  className="font-bold text-[15px] hover:text-blue-700"
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {mostRead.length > 0 && (
        <div className="mx-auto mt-16 max-w-2xl border-t border-gray-200 pt-10 lg:max-w-none">
          <HomeMostReadColumn
            embedded
            articles={mostRead.filter((a) => a.slug !== slug).slice(0, 4)}
          />
        </div>
      )}
    </article>
  );
}
