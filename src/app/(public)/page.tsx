import Link from "next/link";
import { BannerCarousel } from "@/components/banners/banner-carousel";
import { FadeIn } from "@/components/motion/fade-in";
import { BreakingNewsTicker } from "@/components/news/breaking-news-ticker";
import { FeaturedCarousel } from "@/components/news/featured-carousel";
import { NewsCard } from "@/components/news/news-card";
import { NewsGrid } from "@/components/news/news-grid";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { isDbConfigured } from "@/lib/db/connect";
import { getActiveBanners } from "@/lib/queries/banners";
import { getArticlesPaginated, getBreakingArticles } from "@/lib/queries/articles";
import { getActiveCategories, getCategoryArticlesSection } from "@/lib/queries/categories";
import { getSettings } from "@/lib/models/Settings";

export const dynamic = "force-dynamic";

export async function generateMetadata() {
  try {
    const settings = await getSettings();
    return {
      title: settings.defaultSeoTitle ?? settings.siteName,
      description: settings.defaultSeoDescription ?? settings.siteDescription,
    };
  } catch {
    return { title: "The News" };
  }
}

export default async function HomePage() {
  if (!isDbConfigured()) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="font-serif text-4xl font-bold text-[#0F172A]">Welcome to The News</h1>
        <p className="mt-4 text-muted-foreground">
          Set <code className="rounded bg-muted px-1">MONGODB_URI</code> and visit{" "}
          <Link href="/admin" className="text-[#2563EB] underline">/admin</Link> to publish stories.
        </p>
      </div>
    );
  }

  const [
    breaking,
    featured,
    latest,
    trending,
    topBanners,
    middleBanners,
    categories,
  ] = await Promise.all([
    getBreakingArticles(),
    getArticlesPaginated({ page: 1, pageSize: 6, featured: true, status: "published" }),
    getArticlesPaginated({ page: 1, pageSize: 9, status: "published" }),
    getArticlesPaginated({ page: 1, pageSize: 6, trending: true, status: "published" }),
    getActiveBanners("home-top"),
    getActiveBanners("home-middle"),
    getActiveCategories(),
  ]);

  const heroMain = featured.items[0];
  const heroSide = featured.items.slice(1, 3);
  const heroRow = featured.items.slice(3, 6);

  const categorySections = await Promise.all(
    categories.slice(0, 6).map((cat) => getCategoryArticlesSection(cat._id, 4)),
  );

  return (
    <>
      <BreakingNewsTicker articles={breaking} />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {topBanners.length > 0 && (
          <FadeIn className="mb-8">
            <BannerCarousel banners={topBanners} />
          </FadeIn>
        )}

        {heroMain && (
          <section className="mb-10 grid gap-4 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <NewsCard article={heroMain} variant="featured" priority />
            </div>
            <div className="flex flex-col gap-4">
              {heroSide.map((a) => (
                <NewsCard key={a._id} article={a} variant="horizontal" />
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-3 lg:col-span-3">
              {heroRow.map((a) => (
                <NewsCard key={a._id} article={a} variant="standard" />
              ))}
            </div>
          </section>
        )}

        <FadeIn>
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-2xl font-bold text-[#0F172A]">Latest News</h2>
            <Link href="/today" className="text-sm text-[#2563EB] hover:underline">Today&apos;s edition</Link>
          </div>
          <NewsGrid articles={latest.items} />
        </FadeIn>

        {featured.items.length > 0 && (
          <FadeIn className="mt-14">
            <h2 className="mb-4 font-serif text-2xl font-bold">Featured Stories</h2>
            <FeaturedCarousel articles={featured.items} />
          </FadeIn>
        )}

        {middleBanners.length > 0 && (
          <FadeIn className="my-14">
            <BannerCarousel banners={middleBanners} />
          </FadeIn>
        )}

        {categorySections.map(
          (section) =>
            section &&
            section.articles.length > 0 && (
              <FadeIn key={section.category._id} className="mb-12">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="font-serif text-2xl font-bold">{section.category.name}</h2>
                  <Link
                    href={`/category/${section.category.slug}`}
                    className="text-sm text-[#2563EB] hover:underline"
                  >
                    View all
                  </Link>
                </div>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                  {section.articles.map((article) => (
                    <NewsCard key={article._id} article={article} />
                  ))}
                </div>
              </FadeIn>
            ),
        )}

        <FadeIn className="mt-14">
          <h2 className="mb-4 font-serif text-2xl font-bold">Trending</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {trending.items.map((article) => (
              <NewsCard key={article._id} article={article} variant="horizontal" />
            ))}
          </div>
        </FadeIn>

        <section className="mt-16 rounded-2xl bg-[#0F172A] px-6 py-10 text-center text-white">
          <h2 className="font-serif text-2xl font-bold">Stay informed</h2>
          <p className="mt-2 text-white/70">Subscribe for daily headlines.</p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </section>
      </div>
    </>
  );
}
