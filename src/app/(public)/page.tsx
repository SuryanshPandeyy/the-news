import Link from "next/link";
import { HomeHeroSlider } from "@/components/editorial/home-hero-slider";
import { HomeFeaturedColumn } from "@/components/editorial/home-featured-column";
import { HomeLatestColumn } from "@/components/editorial/home-latest-column";
import { HomeMostReadColumn } from "@/components/editorial/home-most-read-column";
import { ArticleDateLabel } from "@/components/editorial/category-meta";
import { isDbConfigured } from "@/lib/db/connect";
import { getHomeFeed, getHomeHeaderBannerSlides } from "@/lib/queries/articles";
import { getSettings } from "@/lib/models/Settings";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/messages";
import { newsArticlePath } from "@/lib/utils/slug";

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
        <h1 className="font-serif text-4xl font-black text-black">Welcome</h1>
        <p className="mt-4 font-serif text-gray-600">
          Set <code className="rounded bg-gray-100 px-1">MONGODB_URI</code> and visit{" "}
          <Link href="/admin" className="font-bold text-[#0000ee] hover:underline">
            /admin
          </Link>{" "}
          to publish stories.
        </p>
      </div>
    );
  }

  const [feed, headerSlides, locale] = await Promise.all([
    getHomeFeed(),
    getHomeHeaderBannerSlides(5),
    getLocale(),
  ]);

  const heroSlides = headerSlides.map((article) => ({
    _id: article._id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    image: article.bannerImage ?? article.featuredImage,
    categoryName: article.category?.name,
  }));

  return (
    <div className="w-full">
      <HomeHeroSlider slides={heroSlides} />
      <div className="mx-auto mt-4 max-w-[1440px] px-4 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 lg:gap-y-0">
          <HomeFeaturedColumn
            article={feed.hero}
            thumbnails={feed.heroThumbs}
            sectionTitle={feed.sectionTitle}
          />
          <HomeLatestColumn articles={feed.latest} />
          <HomeMostReadColumn articles={feed.mostRead} />
        </div>

        {feed.more.length > 0 && (
          <section className="mt-16 border-t-[3px] border-[#0a192f] pt-10">
            <h2 className="mb-8 text-[22px] font-black uppercase tracking-tight text-[#0a192f]">
              {t("moreStories", locale)}
            </h2>
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
              {feed.more.map((article) => (
                <article key={article._id} className="group flex flex-col">
                  <Link href={newsArticlePath(article.slug)}>
                    <h3 className="text-[20px] font-bold leading-tight transition-colors group-hover:text-blue-600">
                      {article.title}
                    </h3>
                  </Link>
                  <ArticleDateLabel date={article.publishedAt ?? article.createdAt} />
                  {article.excerpt && (
                    <p className="mt-2 line-clamp-2 font-serif text-sm leading-snug text-gray-600">
                      {article.excerpt}
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
