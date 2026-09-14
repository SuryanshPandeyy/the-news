import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteShell } from "@/lib/data/site-shell";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, categories } = await getSiteShell();

  return (
    <div className="flex min-h-full flex-col bg-[#F8FAFC] dark:bg-background">
      <SiteHeader siteName={settings.siteName} categories={categories} />
      {!categories.length && (
        <div className="border-b bg-amber-50 px-4 py-2 text-center text-sm text-amber-900">
          Database not connected or empty. Add MONGODB_URI and seed categories in the admin panel.
        </div>
      )}
      <main className="flex-1">{children}</main>
      <SiteFooter
        settings={{
          siteName: settings.siteName,
          siteDescription: settings.siteDescription ?? undefined,
          footerText: "footerText" in settings ? settings.footerText ?? undefined : undefined,
          contactEmail: "contactEmail" in settings ? settings.contactEmail ?? undefined : undefined,
        }}
        categories={categories}
      />
    </div>
  );
}
