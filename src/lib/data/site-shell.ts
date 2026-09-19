import { isDbConfigured } from "@/lib/db/connect";
import { getSettings } from "@/lib/models/Settings";
import { getActiveCategories } from "@/lib/queries/categories";

export async function getSiteShell() {
  if (!isDbConfigured()) {
    return {
      configured: false as const,
      settings: {
        siteName: "The News",
        siteDescription: "Configure MONGODB_URI to load content.",
        logo: undefined as string | undefined,
        favicon: undefined as string | undefined,
      },
      categories: [] as Awaited<ReturnType<typeof getActiveCategories>>,
    };
  }

  try {
    const [settings, categories] = await Promise.all([
      getSettings(),
      getActiveCategories(),
    ]);
    return {
      configured: true as const,
      settings,
      categories,
    };
  } catch {
    return {
      configured: false as const,
      settings: {
        siteName: "The News",
        siteDescription: "Unable to connect to the database.",
        logo: undefined as string | undefined,
        favicon: undefined as string | undefined,
      },
      categories: [] as Awaited<ReturnType<typeof getActiveCategories>>,
    };
  }
}
