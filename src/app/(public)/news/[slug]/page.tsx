import Image from "next/image";
import { notFound } from "next/navigation";
import { ArticleBody } from "@/components/news/article-body";
import { NewsCard } from "@/components/news/news-card";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { SocialShare } from "@/components/social/social-share";
import {
  getArticleBySlug,
  getRelatedArticles,
  incrementArticleViews,
} from "@/lib/queries/articles";
import { getArticlesPaginated } from "@/lib/queries/articles";
import { getSiteUrl } from "@/lib/site";
import { formatDateIST } from "@/lib/timezone";
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
      images: article.featuredImage ? [article.featuredImage] : [],
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

  const [related, trending] = await Promise.all([
    getRelatedArticles(article.category._id, article.slug),
    getArticlesPaginated({ page: 1, pageSize: 4, trending: true, status: "published" }),
  ]);

  const url = `${getSiteUrl()}/news/${article.slug}`;
  const published = article.publishedAt ?? article.createdAt;
  const readingTime = getReadingTimeMinutes(article.content);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.excerpt,
    image: article.featuredImage ? [article.featuredImage] : [],
    datePublished: published,
    dateModified: article.updatedAt,
    author: [{ "@type": "Person", name: article.author ?? "Editorial Desk" }],
    articleSection: article.category.name,
  };

  return (
    <article className="mx-auto max-w-4xl px-4 py-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <p className="text-sm font-semibold uppercase tracking-wide text-[#2563EB]">
        {article.category.name}
      </p>
      <h1 className="mt-2 font-serif text-4xl font-bold leading-tight text-[#0F172A] md:text-5xl">
        {article.title}
      </h1>
      {article.excerpt && (
        <p className="mt-4 text-lg text-muted-foreground">{article.excerpt}</p>
      )}
      <div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
        <span>{article.author}</span>
        <span>·</span>
        <time dateTime={published}>
          {formatDateIST(published, { dateStyle: "long", timeStyle: "short" })}
        </time>
        <span>·</span>
        <span>{readingTime} min read</span>
      </div>

      {article.featuredImage && (
        <div className="relative mt-8 aspect-[16/9] overflow-hidden rounded-xl">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority
            className="object-cover"
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      )}

      <div className="mt-10">
        <ArticleBody html={article.content} />
      </div>

      <div className="mt-10 border-t pt-6">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide">Share</h2>
        <SocialShare url={url} title={article.title} />
      </div>

      {related.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-serif text-2xl font-bold">Related stories</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {related.map((a) => (
              <NewsCard key={a._id} article={a} variant="horizontal" />
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 rounded-xl bg-muted/50 p-6">
        <h2 className="font-serif text-xl font-bold">Get more like this</h2>
        <div className="mt-4">
          <NewsletterForm compact />
        </div>
      </section>

      {trending.items.length > 0 && (
        <section className="mt-12">
          <h2 className="mb-4 font-serif text-2xl font-bold">Trending now</h2>
          <div className="space-y-3">
            {trending.items.map((a) => (
              <NewsCard key={a._id} article={a} variant="compact" />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
