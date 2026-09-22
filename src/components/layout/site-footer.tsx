"use client";

import Image from "next/image";
import Link from "next/link";
import { useLocale } from "@/components/providers/locale-provider";
import { SocialIcon } from "@/components/shared/social-icon";
import type { SiteHeaderSocials } from "@/components/layout/site-header";

type SettingsFooter = {
  siteName: string;
  logo?: string;
  footerText?: string;
};

export function SiteFooter({
  settings,
  socials,
}: {
  settings: SettingsFooter;
  socials?: SiteHeaderSocials;
}) {
  const { t } = useLocale();
  const year = new Date().getFullYear();
  const logo = settings.logo ?? "/logo.png";

  const socialLinks = [
    socials?.socialFacebook
      ? { href: socials.socialFacebook, network: "facebook" as const }
      : null,
    socials?.socialTwitter
      ? { href: socials.socialTwitter, network: "twitter" as const }
      : null,
    socials?.socialInstagram
      ? { href: socials.socialInstagram, network: "instagram" as const }
      : null,
    socials?.socialYoutube
      ? { href: socials.socialYoutube, network: "youtube" as const }
      : null,
  ].filter((link): link is NonNullable<typeof link> => link !== null);

  return (
    <footer className="mt-10 w-full border-t border-gray-300 bg-white">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center gap-6 px-5 py-8">
        <Link href="/">
          <Image
            src={logo}
            alt={settings.siteName}
            width={140}
            height={40}
            className="h-10 w-auto object-contain"
          />
        </Link>

        <nav className="flex flex-wrap items-center justify-center gap-4 text-sm font-semibold text-gray-700">
          <Link href="/" className="hover:text-[#e71920]">{t("home")}</Link>
          <span className="text-gray-300">|</span>
          <Link href="/privacy" className="hover:text-[#e71920]">{t("privacyPolicy")}</Link>
          <span className="text-gray-300">|</span>
          <Link href="/terms" className="hover:text-[#e71920]">{t("termsOfService")}</Link>
          <span className="text-gray-300">|</span>
          <Link href="/search" className="hover:text-[#e71920]">{t("search")}</Link>
        </nav>

        {socialLinks.length > 0 && (
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-[#121212] text-white transition hover:bg-[#e71920]"
              >
                <SocialIcon network={link.network} />
              </a>
            ))}
          </div>
        )}

        <p className="text-center text-xs text-gray-500">
          {settings.footerText ?? `© ${year} ${settings.siteName}. ${t("allRights")}`}
        </p>
      </div>
    </footer>
  );
}
