import Link from "next/link";
import { NewsletterForm } from "@/components/newsletter/newsletter-form";
import type { CategorySummary } from "@/lib/types";

type SettingsFooter = {
  siteName: string;
  siteDescription?: string;
  footerText?: string;
  contactEmail?: string;
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialLinkedin?: string;
};

export function SiteFooter({
  settings,
  categories,
}: {
  settings: SettingsFooter;
  categories: CategorySummary[];
}) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t bg-[#0F172A] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h2 className="font-serif text-lg font-bold">{settings.siteName}</h2>
          <p className="mt-2 text-sm text-white/70">
            {settings.siteDescription}
          </p>
          {settings.contactEmail && (
            <p className="mt-3 text-sm text-white/80">{settings.contactEmail}</p>
          )}
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Categories</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            {categories.map((cat) => (
              <li key={cat._id}>
                <Link href={`/category/${cat.slug}`} className="hover:text-white">
                  {cat.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm text-white/80">
            <li><Link href="/today" className="hover:text-white">Today&apos;s News</Link></li>
            <li><Link href="/search" className="hover:text-white">Search</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Use</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wide">Newsletter</h3>
          <p className="mt-2 text-sm text-white/70">Get headlines in your inbox.</p>
          <div className="mt-4">
            <NewsletterForm compact />
          </div>
        </div>
      </div>

      <div className="border-t border-white/10 py-4 text-center text-xs text-white/60">
        {settings.footerText ?? `© ${year} ${settings.siteName}. All rights reserved.`}
      </div>
    </footer>
  );
}
