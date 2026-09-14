"use client";

import Link from "next/link";
import { ChevronRight, User, X } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import type { CategorySummary } from "@/lib/types";

export function SiteNavSidebar({
  open,
  onOpenChange,
  categories,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: CategorySummary[];
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        showCloseButton={false}
        className="w-[300px] max-w-[300px] gap-0 overflow-y-auto border-r border-gray-200 bg-white p-0 shadow-2xl sm:max-w-[300px]"
      >
        <SheetTitle className="sr-only">Navigation menu</SheetTitle>
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-200 bg-white p-4">
          <span className="font-serif text-xl font-black tracking-tight text-black">Menu</span>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-black"
            aria-label="Close menu"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex flex-col py-4">
          <div className="mb-6 flex flex-col space-y-3 border-b border-gray-200 px-6 pb-6 sm:hidden">
            <Link
              href="/admin/login"
              onClick={() => onOpenChange(false)}
              className="flex w-full items-center justify-center space-x-2 rounded bg-black px-4 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-gray-800"
            >
              <User className="h-[18px] w-[18px]" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/#newsletter"
              onClick={() => onOpenChange(false)}
              className="w-full rounded border border-gray-300 bg-white px-4 py-2.5 text-center text-[14px] font-bold text-black transition-colors hover:bg-gray-50"
            >
              Subscribe
            </Link>
          </div>

          <nav className="flex flex-col">
            <div className="mb-2 px-6">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Editions
              </span>
            </div>
            <Link
              href="/"
              onClick={() => onOpenChange(false)}
              className="px-6 py-3 text-left text-[15px] font-bold text-gray-900 transition-colors hover:bg-gray-50 hover:text-blue-600"
            >
              Home
            </Link>
            <Link
              href="/today"
              onClick={() => onOpenChange(false)}
              className="group flex w-full items-center justify-between px-6 py-3 text-left transition-colors hover:bg-gray-50"
            >
              <span className="text-[15px] font-medium text-gray-700 group-hover:text-blue-600">
                Today&apos;s News
              </span>
              <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600" />
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat._id}
                href={`/category/${cat.slug}`}
                onClick={() => onOpenChange(false)}
                className="group flex w-full items-center justify-between px-6 py-3 text-left transition-colors hover:bg-gray-50"
              >
                <span className="text-[15px] font-medium text-gray-700 group-hover:text-blue-600">
                  {cat.name}
                </span>
                <ChevronRight className="h-4 w-4 text-gray-300 group-hover:text-blue-600" />
              </Link>
            ))}
          </nav>

          <div className="mt-8 border-t border-gray-200 px-6 pt-6">
            <nav className="flex flex-col space-y-4">
              <Link href="/search" className="text-[14px] text-gray-600 hover:text-black">
                Search
              </Link>
              <Link href="/#newsletter" className="text-[14px] text-gray-600 hover:text-black">
                Newsletters
              </Link>
              <Link href="/today" className="text-[14px] text-gray-600 hover:text-black">
                Live Briefing
              </Link>
              <Link href="/privacy" className="text-[14px] text-gray-600 hover:text-black">
                Privacy
              </Link>
            </nav>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
