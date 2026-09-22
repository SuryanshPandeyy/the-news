"use client";

import Image from "next/image";
import Link from "next/link";
import { Mail, Menu, Search } from "lucide-react";
import { SocialIcon } from "@/components/shared/social-icon";
import { useState } from "react";
import { SiteNavSidebar } from "@/components/layout/site-nav-sidebar";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useLocale } from "@/components/providers/locale-provider";
import { formatDateIST } from "@/lib/timezone";
import type { CategorySummary } from "@/lib/types";
import { categoryPath } from "@/lib/utils/slug";
import { DEFAULT_SECTION_LINKS } from "@/lib/nav/default-sections";

export type SiteHeaderSocials = {
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
  socialYoutube?: string;
  socialWhatsapp?: string;
};

export function SiteHeader({
  siteName,
  logo,
  siteDescription,
  contactEmail,
  socials,
  categories,
}: {
  siteName: string;
  logo?: string;
  siteDescription?: string;
  contactEmail?: string;
  socials?: SiteHeaderSocials;
  categories: CategorySummary[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLocale();

  const now = new Date();
  const dateLine = formatDateIST(now, {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const useDefaultSections = categories.length === 0;
  const socialLinks = [
    socials?.socialFacebook
      ? { href: socials.socialFacebook, network: "facebook" as const, label: "Facebook" }
      : null,
    socials?.socialTwitter
      ? { href: socials.socialTwitter, network: "twitter" as const, label: "X" }
      : null,
    socials?.socialInstagram
      ? { href: socials.socialInstagram, network: "instagram" as const, label: "Instagram" }
      : null,
    socials?.socialYoutube
      ? { href: socials.socialYoutube, network: "youtube" as const, label: "YouTube" }
      : null,
    socials?.socialWhatsapp
      ? {
          href: socials.socialWhatsapp.startsWith("http")
            ? socials.socialWhatsapp
            : `https://wa.me/${socials.socialWhatsapp.replace(/\D/g, "")}`,
          network: "whatsapp" as const,
          label: "WhatsApp",
        }
      : null,
  ].filter((link): link is NonNullable<typeof link> => link !== null);

  return (
    <>
      <SiteNavSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        categories={categories}
        contactEmail={contactEmail}
      />

      <header className="w-full">
        <div className="bg-[#121212] text-white">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-3 px-4 py-2 text-xs sm:px-5">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setSidebarOpen(true)}
                className="rounded p-1 hover:bg-white/10 lg:hidden"
                aria-label={t("openMenu")}
              >
                <Menu size={20} />
              </button>
              <span className="font-semibold text-gray-200">{dateLine}</span>
            </div>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4">
              {socialLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 transition hover:text-white"
                  aria-label={link.label}
                >
                  <SocialIcon network={link.network} />
                </a>
              ))}
              <Link
                href="/search"
                className="flex items-center gap-1 font-semibold text-gray-200 hover:text-white"
              >
                <Search size={15} />
                <span className="hidden sm:inline">{t("search")}</span>
              </Link>
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="hidden items-center gap-1 font-semibold text-gray-200 hover:text-white sm:flex"
                >
                  <Mail size={15} />
                  {t("contact")}
                </a>
              )}
              <LanguageSwitcher variant="compact" className="hidden sm:flex" />
            </div>
          </div>
        </div>

        <div className="border-b border-gray-200 bg-white">
          <div className="mx-auto flex max-w-[1500px] flex-wrap items-center justify-between gap-4 px-4 py-4 sm:px-5">
            <Link href="/" className="shrink-0">
              {logo ? (
                <Image
                  src={logo}
                  alt={siteName}
                  width={200}
                  height={56}
                  className="h-12 w-auto max-w-[220px] object-contain md:h-14"
                  priority
                />
              ) : (
                <span className="text-3xl font-black text-[#e71920]">{siteName}</span>
              )}
            </Link>

            {siteDescription && (
              <p className="hidden max-w-xl flex-1 text-center text-sm font-medium leading-snug text-gray-700 md:block">
                {siteDescription}
              </p>
            )}

            <div className="hidden shrink-0 bg-[#e71920] px-4 py-2 text-center text-white sm:block">
              <div className="text-2xl font-black leading-none">24×7</div>
              <div className="text-xs font-bold tracking-wide text-yellow-300">LIVE</div>
            </div>
          </div>
        </div>

        <div className="sticky top-0 z-40 bg-[#e71920] shadow-md">
          <div className="mx-auto max-w-[1500px] overflow-x-auto px-4 hide-scrollbar sm:px-5">
            <nav className="flex min-w-max items-center gap-1 py-2.5">
              <Link
                href="/"
                className="rounded px-3 py-1.5 text-sm font-bold text-white transition hover:bg-black/15"
              >
                {t("home")}
              </Link>
              {useDefaultSections
                ? DEFAULT_SECTION_LINKS.map((link) => (
                    <Link
                      key={link.id}
                      href={link.href}
                      className="whitespace-nowrap rounded px-3 py-1.5 text-sm font-bold text-white transition hover:bg-black/15"
                    >
                      {t(link.labelKey)}
                    </Link>
                  ))
                : categories.map((item) => (
                    <Link
                      key={item._id}
                      href={categoryPath(item.slug)}
                      className="whitespace-nowrap rounded px-3 py-1.5 text-sm font-bold text-white transition hover:bg-black/15"
                    >
                      {item.name}
                    </Link>
                  ))}
            </nav>
          </div>
        </div>

        {!useDefaultSections && (
          <div className="bg-[#121212]">
            <div className="mx-auto max-w-[1500px] overflow-x-auto px-4 hide-scrollbar sm:px-5">
              <nav className="flex min-w-max items-center gap-2 py-2">
                {DEFAULT_SECTION_LINKS.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    className="whitespace-nowrap rounded-full border border-white/20 px-4 py-1 text-xs font-semibold text-white transition hover:border-[#e71920] hover:bg-[#e71920]"
                  >
                    {t(link.labelKey)}
                  </Link>
                ))}
              </nav>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
