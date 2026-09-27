import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/messages";
import { buildPageMetadata, getSeoSiteContext } from "@/lib/seo/metadata";

export async function generateMetadata() {
  const [site, locale] = await Promise.all([getSeoSiteContext(), getLocale()]);
  const title = t("termsOfService", locale);

  return buildPageMetadata({
    title,
    description: site.siteDescription,
    path: "/terms",
    site,
    locale,
  });
}

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral">
      <h1>Terms of Use</h1>
      <p>
        Content on this site is for informational purposes. Republication requires permission
        unless otherwise noted.
      </p>
    </div>
  );
}
