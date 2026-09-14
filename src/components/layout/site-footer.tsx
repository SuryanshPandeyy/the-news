import Link from "next/link";
import type { CategorySummary } from "@/lib/types";

type SettingsFooter = {
  siteName: string;
  siteDescription?: string;
  footerText?: string;
};

export function SiteFooter({
  settings,
}: {
  settings: SettingsFooter;
  categories: CategorySummary[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 w-full border-t-4 border-black bg-white px-8 py-12">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center justify-between text-[13px] font-medium text-gray-500 md:flex-row">
        <div className="mb-4 md:mb-0">
          {settings.footerText ??
            `© ${year} ${settings.siteName}. All Rights Reserved`}
        </div>
        <div className="flex space-x-6">
          <Link href="/terms" className="hover:text-black">Terms of Service</Link>
          <Link href="/privacy" className="hover:text-black">Privacy Policy</Link>
          <Link href="/search" className="hover:text-black">Search</Link>
        </div>
      </div>
    </footer>
  );
}
