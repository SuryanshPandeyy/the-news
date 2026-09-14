import type { MetadataRoute } from "next";
import { connectDB, isDbConfigured } from "@/lib/db/connect";
import { Article } from "@/lib/models/Article";
import { Category } from "@/lib/models/Category";
import { getSiteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "hourly", priority: 1 },
    { url: `${base}/today`, changeFrequency: "hourly", priority: 0.9 },
    { url: `${base}/search`, changeFrequency: "weekly", priority: 0.5 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  if (!isDbConfigured()) return staticRoutes;

  try {
    await connectDB();
    const [articles, categories] = await Promise.all([
      Article.find({ status: "published" }).select("slug updatedAt").lean(),
      Category.find({ isActive: true }).select("slug").lean(),
    ]);

    return [
      ...staticRoutes,
      ...categories.map((c) => ({
        url: `${base}/category/${c.slug}`,
        changeFrequency: "daily" as const,
        priority: 0.8,
      })),
      ...articles.map((a) => ({
        url: `${base}/news/${a.slug}`,
        lastModified: a.updatedAt,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      })),
    ];
  } catch {
    return staticRoutes;
  }
}
