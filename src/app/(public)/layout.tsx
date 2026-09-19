import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteShell } from "@/lib/data/site-shell";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteShell();
  const iconUrl = settings.favicon || settings.logo;
  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.siteDescription ?? undefined,
    icons: iconUrl ? { icon: iconUrl, shortcut: iconUrl } : undefined,
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, categories } = await getSiteShell();

  return (
    <div className="flex min-h-full flex-col bg-white font-sans text-gray-900 antialiased selection:bg-blue-200 selection:text-black">
      <SiteHeader
        siteName={settings.siteName}
        logo={settings.logo ?? undefined}
        categories={categories}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        settings={{
          siteName: settings.siteName,
          siteDescription: settings.siteDescription ?? undefined,
          footerText: "footerText" in settings ? settings.footerText ?? undefined : undefined,
        }}
        categories={categories}
      />
    </div>
  );
}
