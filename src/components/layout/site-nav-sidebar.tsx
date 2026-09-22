"use client";

import Link from "next/link";
import { ChevronRight, Mail, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { LanguageSwitcher } from "@/components/shared/language-switcher";
import { useLocale } from "@/components/providers/locale-provider";
import type { CategorySummary } from "@/lib/types";
import { categoryPath } from "@/lib/utils/slug";
import { DEFAULT_SECTION_LINKS } from "@/lib/nav/default-sections";

export function SiteNavSidebar({
  open,
  onOpenChange,
  categories,
  contactEmail,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategorySummary[];
  contactEmail?: string;
}) {
  const { t } = useLocale();
  const useDefaultSections = categories.length === 0;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[300px] max-w-[300px] gap-0 overflow-y-auto border-r border-[#e71920]/30 bg-[#121212] p-0 text-white shadow-2xl sm:max-w-[300px]"
      >
        <SheetTitle className="sr-only">{t("menu")}</SheetTitle>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#e71920] p-4">
          <span className="text-xl font-black tracking-tight">{t("menu")}</span>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 text-white/80 transition-colors hover:bg-black/20 hover:text-white"
            aria-label={t("closeMenu")}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col py-4">
          <div className="mb-6 border-b border-white/10 px-6 pb-6">
            <LanguageSwitcher variant="dark" />
          </div>

          <nav className="flex flex-col">
            <div className="mb-2 px-6">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                {t("editions")}
              </span>
            </div>
            <Link
              href="/"
              onClick={() => onOpenChange(false)}
              className="px-6 py-3 text-left text-[15px] font-bold text-white transition-colors hover:bg-white/5 hover:text-[#ff6b6b]"
            >
              {t("home")}
            </Link>
            {!useDefaultSections &&
              DEFAULT_SECTION_LINKS.map((link) => (
                <Link
                  key={link.id}
                  href={link.href}
                  onClick={() => onOpenChange(false)}
                  className="group flex w-full items-center justify-between px-6 py-3 text-left transition-colors hover:bg-white/5"
                >
                  <span className="text-[15px] font-medium text-gray-200 group-hover:text-white">
                    {t(link.labelKey)}
                  </span>
                  <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-[#e71920]" />
                </Link>
              ))}
            {useDefaultSections
              ? DEFAULT_SECTION_LINKS.map((link) => (
                  <Link
                    key={link.id}
                    href={link.href}
                    onClick={() => onOpenChange(false)}
                    className="group flex w-full items-center justify-between px-6 py-3 text-left transition-colors hover:bg-white/5"
                  >
                    <span className="text-[15px] font-medium text-gray-200 group-hover:text-white">
                      {t(link.labelKey)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-[#e71920]" />
                  </Link>
                ))
              : categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={categoryPath(cat.slug)}
                    onClick={() => onOpenChange(false)}
                    className="group flex w-full items-center justify-between px-6 py-3 text-left transition-colors hover:bg-white/5"
                  >
                    <span className="text-[15px] font-medium text-gray-200 group-hover:text-white">
                      {cat.name}
                    </span>
                    <ChevronRight className="h-4 w-4 text-gray-500 group-hover:text-[#e71920]" />
                  </Link>
                ))}
          </nav>

          <div className="mt-8 border-t border-white/10 px-6 pt-6">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/search"
                onClick={() => onOpenChange(false)}
                className="text-[14px] text-gray-300 hover:text-white"
              >
                {t("search")}
              </Link>
              {contactEmail && (
                <a
                  href={`mailto:${contactEmail}`}
                  className="flex items-center gap-2 text-[14px] text-gray-300 hover:text-white"
                >
                  <Mail size={15} />
                  {t("contact")}
                </a>
              )}
              <Link
                href="/privacy"
                onClick={() => onOpenChange(false)}
                className="text-[14px] text-gray-300 hover:text-white"
              >
                {t("privacyPolicy")}
              </Link>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
