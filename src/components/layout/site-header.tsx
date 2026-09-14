"use client";

import Link from "next/link";
import { Menu, Search } from "lucide-react";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { CategorySummary } from "@/lib/types";

export function SiteHeader({
  siteName,
  categories,
}: {
  siteName: string;
  categories: CategorySummary[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b bg-[#0F172A] text-white shadow-md transition-shadow">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="font-serif text-xl font-bold tracking-tight">
          {siteName}
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          <Link href="/today" className="text-sm font-medium hover:text-[#93C5FD]">
            Today&apos;s News
          </Link>
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="text-sm text-white/80 hover:text-white"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/search"
            aria-label="Search"
            className="inline-flex size-8 items-center justify-center rounded-lg text-white hover:bg-white/10"
          >
            <Search className="h-5 w-5" />
          </Link>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger
              className="inline-flex size-8 items-center justify-center rounded-lg text-white hover:bg-white/10 lg:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </SheetTrigger>
            <SheetContent side="right" className="w-[300px]">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
              </SheetHeader>
              <nav className="mt-6 flex flex-col gap-3">
                <Link href="/today" onClick={() => setOpen(false)}>Today&apos;s News</Link>
                <Link href="/search" onClick={() => setOpen(false)}>Search</Link>
                {categories.map((cat) => (
                  <Link
                    key={cat._id}
                    href={`/category/${cat.slug}`}
                    onClick={() => setOpen(false)}
                  >
                    {cat.name}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
