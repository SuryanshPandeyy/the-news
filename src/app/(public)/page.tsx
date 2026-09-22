import Link from "next/link";
import { HomeBreakingTicker } from "@/components/editorial/home-breaking-ticker";
import { HomeCategoryStrip } from "@/components/editorial/home-category-strip";
import { HomeHeroStage } from "@/components/editorial/home-hero-stage";
import { HomeMostReadList } from "@/components/editorial/home-most-read-list";
import { HomeSidebarCards } from "@/components/editorial/home-sidebar-cards";
import { HomeSocialBand } from "@/components/editorial/home-social-band";
import { NewsListRow } from "@/components/editorial/news-list-row";
import { NewsSectionHeader } from "@/components/editorial/news-section-header";
import { isDbConfigured } from "@/lib/db/connect";
import { getHomeFeed, getHomeHeaderBannerSlides } from "@/lib/queries/articles";
import { getActiveCategories } from "@/lib/queries/categories";
import { getSettings } from "@/lib/models/Settings";
import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/messages";

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
        <h1 className="text-4xl font-black text-black">Welcome</h1>
        <p className="mt-4 text-gray-600">
          Set <code className="rounded bg-gray-100 px-1">MONGODB_URI</code> and visit{" "}
          <Link href="/admin" className="font-bold text-[#e71920] hover:underline">
            /admin
          </Link>{" "}
          to publish stories.
        </p>
      </div>
    );
  }

  const [feed, headerSlides, categories, settings, locale] = await Promise.all([
    getHomeFeed(),
    getHomeHeaderBannerSlides(5),
    getActiveCategories(),
    getSettings(),
    getLocale(),
  ]);

  const heroSlides = headerSlides.map((article) => ({
    _id: article._id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    image: article.bannerImage ?? article.featuredImage,
    categoryName: article.category?.name,
    publishedAt: article.publishedAt,
    createdAt: article.createdAt,
  }));

  const sidebarArticles = feed.latest.length > 0 ? feed.latest : feed.mostRead.slice(0, 3);

  const categoryImages: Record<string, string | undefined> = {};
  for (const article of [...feed.more, ...feed.latest, ...feed.mostRead, ...headerSlides]) {
    const categoryId = article.category?._id;
    if (categoryId && article.featuredImage && !categoryImages[categoryId]) {
      categoryImages[categoryId] = article.featuredImage;
    }
  }

  const socials = {
    socialFacebook: settings.socialFacebook ?? undefined,
    socialTwitter: settings.socialTwitter ?? undefined,
    socialInstagram: settings.socialInstagram ?? undefined,
    socialYoutube: settings.socialYoutube ?? undefined,
    socialWhatsapp: settings.socialWhatsapp ?? undefined,
  };

  return (
    <div className="w-full">
      <div className="mx-auto max-w-[1500px] space-y-5 px-4 py-5 sm:px-5">
        <HomeBreakingTicker articles={feed.breaking} />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <HomeHeroStage slides={heroSlides} />
          </div>
          <div className="lg:col-span-4">
            <HomeSidebarCards
              title={t("latestNews", locale)}
              actionLabel={t("allNews", locale)}
              actionHref="/today"
              articles={sidebarArticles}
            />
          </div>
        </div>

        {categories.length > 0 && (
          <section>
            <NewsSectionHeader title={t("categories", locale)} />
            <HomeCategoryStrip categories={categories} categoryImages={categoryImages} />
          </section>
        )}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <section className="lg:col-span-8">
            <NewsSectionHeader title={t("latestNews", locale)} action={t("allNews", locale)} actionHref="/today" />
            <div className="rounded-md bg-white px-4 shadow-sm">
              {feed.more.length > 0 ? (
                feed.more.map((article) => <NewsListRow key={article._id} article={article} />)
              ) : (
                <p className="py-8 text-center text-gray-500">{t("moreStories", locale)}</p>
              )}
            </div>
          </section>

          <aside className="lg:col-span-4">
            <div className="rounded-md bg-white p-4 shadow-sm">
              <HomeMostReadList title={t("mostRead", locale)} articles={feed.mostRead} />
            </div>
          </aside>
        </div>
      </div>

      <HomeSocialBand tagline={settings.siteDescription ?? undefined} socials={socials} />
    </div>
  );
}
