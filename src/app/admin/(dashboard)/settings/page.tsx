import { SettingsForm } from "@/components/admin/settings-form";
import { getSettings } from "@/lib/models/Settings";
import { t } from "@/lib/i18n/messages";
import { getLocale } from "@/lib/i18n/locale";
import { orUndefined } from "@/lib/utils/nullish";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const [settings, locale] = await Promise.all([getSettings(), getLocale()]);
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-black">{t("settings", locale)}</h1>
      <SettingsForm
        initial={{
          siteName: settings.siteName,
          siteDescription: orUndefined(settings.siteDescription),
          logo: orUndefined(settings.logo),
          favicon: orUndefined(settings.favicon),
          defaultAuthor: orUndefined(settings.defaultAuthor),
          defaultLocale: settings.defaultLocale === "en" ? "en" : "hi",
          contactEmail: orUndefined(settings.contactEmail),
          socialFacebook: orUndefined(settings.socialFacebook),
          socialTwitter: orUndefined(settings.socialTwitter),
          socialInstagram: orUndefined(settings.socialInstagram),
          socialLinkedin: orUndefined(settings.socialLinkedin),
          socialYoutube: orUndefined(settings.socialYoutube),
          socialWhatsapp: orUndefined(settings.socialWhatsapp),
          footerText: orUndefined(settings.footerText),
          defaultSeoTitle: orUndefined(settings.defaultSeoTitle),
          defaultSeoDescription: orUndefined(settings.defaultSeoDescription),
          defaultSeoImage: orUndefined(settings.defaultSeoImage),
          newsletterFromName: orUndefined(settings.newsletterFromName),
        }}
      />
    </div>
  );
}
