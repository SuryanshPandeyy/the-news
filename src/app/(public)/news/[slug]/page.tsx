import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ArticleBody } from "@/components/news/article-body";
import { ArticleImage } from "@/components/editorial/article-image";
import { ArticleDateLabel, CategoryBadge } from "@/components/editorial/category-meta";
import { HomeMostReadColumn } from "@/components/editorial/home-most-read-column";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
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

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) return { title: "Article" };
  return {
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
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

  const [related, mostRead] = await Promise.all([
    getRelatedArticles(article.category._id, article.slug),
    getMostReadArticles(5),
  ]);

  const url = `${getSiteUrl()}/news/${article.slug}`;
  const published = article.publishedAt ?? article.createdAt;
  const readingTime = getReadingTimeMinutes(article.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage ? [article.featuredImage] : [placeholderImage(slug)],
    datePublished: published,
    dateModified: article.updatedAt,
    author: [{ "@type": "Person", name: article.author ?? "Editorial Desk" }],
    articleSection: article.category.name,
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
        Back to Home
      </Link>

      <header className="mb-8">
        <div className="mb-6 flex items-center space-x-3">
          <CategoryBadge>{article.category.name}</CategoryBadge>
          <ArticleDateLabel date={published} />
        </div>

        <h1 className="mb-6 pr-4 text-4xl font-bold leading-tight md:text-5xl lg:text-6xl">
          {article.title}
        </h1>

        {(article.subtitle ?? article.excerpt) && (
          <p className="mb-8 max-w-3xl font-serif text-xl leading-snug text-gray-600 md:text-2xl">
            {article.subtitle ?? article.excerpt}
          </p>
        )}

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
              <p className="text-sm font-bold text-gray-900">By {article.author}</p>
              <p className="text-xs text-gray-500">
                {article.authorRole ?? `${readingTime} min read · Editorial`}
              </p>
            </div>
          </div>
          <SocialShare url={url} title={article.title} />
        </div>
      </header>

      <figure className="relative mb-10 aspect-[16/9] w-full overflow-hidden bg-gray-100 md:aspect-[2/1]">
        <ArticleImage
          src={article.featuredImage}
          alt={article.title}
          seed={article._id}
          fill
          priority
          sizes="(max-width: 896px) 100vw, 896px"
        />
        <figcaption className="absolute bottom-2 right-2 rounded-sm bg-black/60 px-2 py-1 text-xs text-white backdrop-blur-sm">
          {article.imageCaption ?? article.category.name}
        </figcaption>
      </figure>

      <div className="prose prose-lg mx-auto max-w-2xl font-serif text-gray-800">
        <ArticleBody html={article.content} />
      </div>

      {article.tags && article.tags.length > 0 && (
        <div className="mx-auto mt-12 max-w-2xl border-t border-gray-200 pt-8">
          <h4 className="mb-4 text-sm font-bold uppercase tracking-wider">Related Topics</h4>
          <div className="flex flex-wrap gap-2">
            {article.tags.map((tag) => (
              <Link
                key={tag}
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="cursor-pointer rounded-sm bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-200"
              >
                {tag}
              </Link>
            ))}
          </div>
        </div>
      )}

      {related.length > 0 && (
        <section className="mx-auto mt-12 max-w-2xl border-t border-gray-200 pt-8">
          <h2 className="mb-4 text-xl font-bold">Related stories</h2>
          <ul className="space-y-3">
            {related.map((a) => (
              <li key={a._id}>
                <Link
                  href={`/news/${a.slug}`}
                  className="font-bold text-[15px] hover:text-blue-700"
                >
                  {a.title}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mx-auto mt-12 max-w-2xl rounded-sm border border-gray-200 p-6">
        <h2 className="text-lg font-bold">Newsletters</h2>
        <div className="mt-4">
          <NewsletterForm compact />
        </div>
      </section>

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
