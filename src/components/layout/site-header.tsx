"use client";

import Link from "next/link";
import { Bell, Menu, MoreHorizontal, Search, User } from "lucide-react";
import { useState } from "react";
import { SiteNavSidebar } from "@/components/layout/site-nav-sidebar";
import { formatDateIST } from "@/lib/timezone";
import type { CategorySummary } from "@/lib/types";

export function SiteHeader({
  siteName,
  categories,
}: {
  siteName: string;
  categories: CategorySummary[];
}) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

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

      <header className="sticky top-0 z-40 w-full border-b border-gray-200 bg-white">
        <div className="flex items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center space-x-4 md:space-x-6">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded p-1 text-gray-800 transition-colors hover:bg-gray-100 hover:text-black"
              aria-label="Open menu"
            >
              <Menu className="h-6 w-6" strokeWidth={1.5} />
            </button>
            <div className="hidden h-5 w-px bg-gray-300 md:block" />
            <Link
              href="/search"
              className="rounded p-1 text-gray-800 transition-colors hover:bg-gray-100 hover:text-black"
              aria-label="Search"
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </Link>
            <Link
              href="/today"
              className="rounded p-1 text-gray-800 transition-colors hover:bg-gray-100 hover:text-black"
              aria-label="Today&apos;s news"
            >
              <Bell className="h-5 w-5" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="flex flex-1 justify-center">
            <Link
              href="/"
              className="font-serif text-[28px] font-black leading-none tracking-tight text-black md:text-[32px]"
            >
              {siteName}
            </Link>
          </div>

          <div className="flex items-center space-x-2 md:space-x-4">
            <Link
              href="/admin/login"
              className="hidden items-center space-x-2 rounded bg-black px-4 py-1.5 text-[13px] font-bold text-white transition-colors hover:bg-gray-800 sm:flex"
            >
              <User className="h-4 w-4" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/#newsletter"
              className="rounded border border-gray-300 bg-white px-3 py-1.5 text-[13px] font-bold text-black transition-colors hover:bg-gray-50 md:px-4"
            >
              Subscribe
            </Link>
          </div>
        </div>

        <div className="relative flex items-center overflow-x-auto border-t border-gray-100 px-4 py-2 hide-scrollbar md:px-6">
          <div className="mr-6 flex shrink-0 flex-col justify-center leading-tight">
            <span className="text-[11px] font-bold uppercase tracking-wide text-gray-900">
              {weekday}
            </span>
            <span className="text-[11px] text-gray-500">{dateLine}</span>
          </div>

          <nav className="flex min-w-max flex-1 items-center space-x-6 md:space-x-8">
            <Link
              href="/"
              className="text-[13px] font-medium text-gray-600 transition-colors hover:text-black"
            >
              Home
            </Link>
            {navCategories.map((item) => (
              <Link
                key={item._id}
                href={`/category/${item.slug}`}
                className="whitespace-nowrap text-[13px] font-medium text-gray-600 transition-colors hover:text-black"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="sticky right-0 ml-4 hidden shrink-0 bg-white pl-2 md:block">
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="flex items-center justify-center rounded bg-[#111] p-2 text-white transition-colors hover:bg-gray-800"
              aria-label="More sections"
            >
              <MoreHorizontal className="h-[18px] w-[18px]" />
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
