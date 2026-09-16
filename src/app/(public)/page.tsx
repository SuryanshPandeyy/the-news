import Link from "next/link";
import { BreakingNewsTicker } from "@/components/news/breaking-news-ticker";
import { HomeFeaturedColumn } from "@/components/editorial/home-featured-column";
import { HomeLatestColumn } from "@/components/editorial/home-latest-column";
import { HomeMostReadColumn } from "@/components/editorial/home-most-read-column";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import { isDbConfigured } from "@/lib/db/connect";
import {
  getArticlesPaginated,
  getBreakingArticles,
  getMostReadArticles,
} from "@/lib/queries/articles";
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
        <h1 className="font-serif text-4xl font-black text-black">Welcome</h1>
        <p className="mt-4 font-serif text-gray-600">
          Set <code className="rounded bg-gray-100 px-1">MONGODB_URI</code> and visit{" "}
          <Link href="/admin" className="text-[#0000ee] font-bold hover:underline">
            /admin
          </Link>{" "}
          to publish stories.
        </p>
      </div>
    );
  }

  const [breaking, featured, latest, mostRead] = await Promise.all([
    getBreakingArticles(),
    getArticlesPaginated({ page: 1, pageSize: 6, featured: true, status: "published" }),
    getArticlesPaginated({ page: 1, pageSize: 3, status: "published" }),
    getMostReadArticles(5),
  ]);

  const hero = featured.items[0] ?? latest.items[0] ?? null;
  const heroThumbs = featured.items.slice(1, 4);
  const latestList =
    latest.items.length > 0
      ? latest.items
      : featured.items.slice(0, 3);
  const mostReadList =
    mostRead.length > 0
      ? mostRead
      : (await getArticlesPaginated({ page: 1, pageSize: 5, trending: true, status: "published" })).items;

  const sectionTitle = hero?.sectionLabel || hero?.category.name || "Featured";

  return (
    <div className="w-full">
      <BreakingNewsTicker articles={breaking} />
      <div className="mx-auto max-w-[1440px] px-4 py-8 md:px-8 md:py-12">
        <div className="grid grid-cols-1 gap-y-12 md:grid-cols-12 lg:gap-y-0">
          <HomeFeaturedColumn
            article={hero}
            thumbnails={heroThumbs}
            sectionTitle={sectionTitle}
          />
          <HomeLatestColumn articles={latestList} />
          <HomeMostReadColumn articles={mostReadList} />
        </div>
      </div>

      <section
        id="newsletter"
        className="border-t border-gray-200 bg-white px-4 py-12 md:px-8"
      >
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold text-black">Newsletters</h2>
          <p className="mt-2 font-serif text-gray-600">
            Daily headlines delivered to your inbox.
          </p>
          <div className="mt-6">
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  );
}
