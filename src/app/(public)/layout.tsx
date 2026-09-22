import type { Metadata } from "next";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { getSiteShell } from "@/lib/data/site-shell";

export async function generateMetadata(): Promise<Metadata> {
  const { settings } = await getSiteShell();
  return {
    title: {
      default: settings.siteName,
      template: `%s | ${settings.siteName}`,
    },
    description: settings.siteDescription ?? undefined,
  };
}

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { settings, categories } = await getSiteShell();
  const socials = {
    socialFacebook:
      "socialFacebook" in settings ? settings.socialFacebook ?? undefined : undefined,
    socialTwitter:
      "socialTwitter" in settings ? settings.socialTwitter ?? undefined : undefined,
    socialInstagram:
      "socialInstagram" in settings ? settings.socialInstagram ?? undefined : undefined,
    socialLinkedin:
      "socialLinkedin" in settings ? settings.socialLinkedin ?? undefined : undefined,
    socialYoutube:
      "socialYoutube" in settings ? settings.socialYoutube ?? undefined : undefined,
    socialWhatsapp:
      "socialWhatsapp" in settings ? settings.socialWhatsapp ?? undefined : undefined,
  };

  return (
    <div className="flex min-h-full flex-col bg-[#efefef] font-sans text-gray-900 antialiased selection:bg-red-200 selection:text-black">
      <SiteHeader
        siteName={settings.siteName}
        logo={settings.logo ?? "/logo.png"}
        siteDescription={settings.siteDescription ?? undefined}
        contactEmail={"contactEmail" in settings ? settings.contactEmail ?? undefined : undefined}
        socials={socials}
        categories={categories}
      />
      <main className="flex-1">{children}</main>
      <SiteFooter
        settings={{
          siteName: settings.siteName,
          logo: settings.logo ?? "/logo.png",
          footerText: "footerText" in settings ? settings.footerText ?? undefined : undefined,
        }}
        socials={socials}
      />
    </div>
  );
}
