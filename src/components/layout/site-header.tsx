"use client";

import Image from "next/image";
import Link from "next/link";
import { Bell, Menu, MoreHorizontal, Search } from "lucide-react";
import { useState } from "react";
import { SiteNavSidebar } from "@/components/layout/site-nav-sidebar";
import { useLocale } from "@/components/providers/locale-provider";
import { formatDateIST } from "@/lib/timezone";
import type { CategorySummary } from "@/lib/types";

export function SiteHeader({
  siteName,
  logo,
  categories,
}: {
  siteName: string;
  logo?: string;
  categories: CategorySummary[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t } = useLocale();

  const now = new Date();
  const weekday = formatDateIST(now, { weekday: "long" });
  const dateLine = formatDateIST(now, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  const navCategories =
    categories.length > 0
      ? categories
      : [
          { _id: "w", name: "World", slug: "world" },
          { _id: "p", name: "Politics", slug: "politics" },
          { _id: "b", name: "Business", slug: "business" },
          { _id: "t", name: "Tech", slug: "technology" },
        ];

  return (
    <>
      <SiteNavSidebar
        open={sidebarOpen}
        onOpenChange={setSidebarOpen}
        categories={categories}
      />

      <header className="sticky top-0 z-40 w-full bg-white shadow-sm">
        <div className="grid grid-cols-[auto_1fr_auto] items-center gap-2 bg-[#0a192f] px-3 py-2.5 text-white md:gap-4 md:px-6 md:py-3">
          <div className="flex items-center gap-2 md:gap-4">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded p-1 text-white transition-colors hover:bg-white/10 hover:text-blue-200 focus:outline-none"
              aria-label={t("openMenu")}
            >
              <Menu size={24} strokeWidth={2} />
            </button>
            <Link
              href="/search"
              className="rounded p-1 text-white transition-colors hover:bg-white/10 hover:text-blue-200 focus:outline-none"
              aria-label={t("search")}
            >
              <Search size={20} strokeWidth={2} />
            </Link>
          </div>

          <div className="min-w-0 flex justify-center">
            <Link
              href="/"
              className="flex max-w-full items-center leading-none transition-opacity hover:opacity-90"
            >
              {logo ? (
                <Image
                  src={logo}
                  alt={siteName}
                  width={160}
                  height={40}
                  className="h-7 w-auto max-w-[min(160px,50vw)] object-contain brightness-0 invert md:h-10"
                  priority
                />
              ) : (
                <span className="block truncate whitespace-nowrap font-serif text-xl font-black tracking-tighter text-white md:text-[34px]">
                  {siteName}
                  <span className="text-blue-400">.</span>
                </span>
              )}
            </Link>
          </div>

          <div className="flex justify-end">
            <Link
              href="/today"
              className="rounded p-1 text-white transition-colors hover:bg-white/10 hover:text-blue-200 focus:outline-none"
              aria-label={t("todaysNews")}
            >
              <Bell size={20} strokeWidth={2} />
            </Link>
          </div>
        </div>

        <div className="relative flex items-center overflow-x-auto border-b border-gray-200 bg-white px-4 py-2 hide-scrollbar md:px-6">
          <div className="mr-8 flex shrink-0 flex-col justify-center border-r border-gray-200 pr-4 leading-tight">
            <span className="text-[11px] font-black uppercase tracking-wider text-[#0a192f]">
              {weekday}
            </span>
            <span className="text-[11px] font-medium text-gray-500">{dateLine}</span>
          </div>

          <nav className="flex min-w-max flex-1 items-center space-x-1 md:space-x-2">
            <Link
              href="/"
              className="rounded-md px-3 py-1.5 text-[13px] font-semibold text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-700"
            >
              {t("home")}
            </Link>
            {navCategories.map((item) => (
              <Link
                key={item._id}
                href={`/category/${item.slug}`}
                className="whitespace-nowrap rounded-md px-3 py-1.5 text-[13px] font-semibold text-gray-700 transition-all hover:bg-blue-50 hover:text-blue-700"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="sticky right-0 ml-4 hidden shrink-0 bg-white pl-4 shadow-[-10px_0_10px_-10px_rgba(0,0,0,0.1)] md:block">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center justify-center rounded-md bg-gray-100 p-1.5 text-gray-600 transition-colors hover:bg-gray-200 hover:text-black"
              aria-label={t("moreSections")}
            >
              <MoreHorizontal size={18} />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
