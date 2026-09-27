import { getLocale } from "@/lib/i18n/locale";
import { t } from "@/lib/i18n/messages";
import { buildPageMetadata, getSeoSiteContext } from "@/lib/seo/metadata";

export async function generateMetadata() {
  const [site, locale] = await Promise.all([getSeoSiteContext(), getLocale()]);
  const title = t("privacyPolicy", locale);

  return buildPageMetadata({
    title,
    description: site.siteDescription,
    path: "/privacy",
    site,
    locale,
  });
}

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12 prose prose-neutral">
      <h1>Privacy Policy</h1>
      <p>
        We respect your privacy. Newsletter emails are stored securely and used only to send
        editorial updates. Contact the publication for data requests.
      </p>
    </div>
  );
}
