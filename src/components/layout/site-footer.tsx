"use client";

import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";

type SettingsFooter = {
  siteName: string;
  siteDescription?: string;
  footerText?: string;
};

export function SiteFooter({
  settings,
}: {
  settings: SettingsFooter;
  categories: unknown[];
}) {
  const { t } = useLocale();
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 w-full border-t-4 border-black bg-white px-8 py-12">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between text-[13px] font-medium text-gray-500 md:flex-row">
        <div className="mb-4 md:mb-0">
          {settings.footerText ??
            `© ${year} ${settings.siteName}. ${t("allRights")}`}
        </div>
        <div className="flex space-x-6">
          <Link href="/terms" className="hover:text-black">
            {t("termsOfService")}
          </Link>
          <Link href="/privacy" className="hover:text-black">
            {t("privacyPolicy")}
          </Link>
          <Link href="/search" className="hover:text-black">
            {t("search")}
          </Link>
        </div>
      </div>
    </footer>
  );
}
