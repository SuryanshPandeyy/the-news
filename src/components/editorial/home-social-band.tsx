"use client";

import { useLocale } from "@/components/providers/locale-provider";
import { SocialIcon } from "@/components/shared/social-icon";

type SocialLinks = {
  socialFacebook?: string;
  socialTwitter?: string;
  socialInstagram?: string;
  socialYoutube?: string;
  socialWhatsapp?: string;
};

function SocialButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex h-9 w-9 items-center justify-center rounded-full bg-white text-black transition hover:scale-105"
    >
      {children}
    </a>
  );
}

export function HomeSocialBand({
  tagline,
  socials,
}: {
  tagline?: string;
  socials: SocialLinks;
}) {
  const { t } = useLocale();
  const links = [
    socials.socialYoutube && { href: socials.socialYoutube, icon: <SocialIcon network="youtube" /> },
    socials.socialFacebook && { href: socials.socialFacebook, icon: <SocialIcon network="facebook" /> },
    socials.socialTwitter && { href: socials.socialTwitter, icon: <SocialIcon network="twitter" /> },
    socials.socialInstagram && { href: socials.socialInstagram, icon: <SocialIcon network="instagram" /> },
    socials.socialWhatsapp && {
      href: socials.socialWhatsapp.startsWith("http")
        ? socials.socialWhatsapp
        : `https://wa.me/${socials.socialWhatsapp.replace(/\D/g, "")}`,
      icon: <SocialIcon network="whatsapp" />,
    },
  ].filter(Boolean) as { href: string; icon: React.ReactNode }[];

  if (!tagline && links.length === 0) return null;

  return (
    <section className="mt-8 bg-[#090909]">
      <div className="mx-auto flex max-w-[1500px] flex-col items-center justify-between gap-5 px-5 py-5 text-white md:flex-row">
        <div className="flex items-center gap-5">
          <div className="bg-[#e71920] px-5 py-3">
            <div className="text-4xl font-black leading-none">24×7</div>
            <div className="text-center text-lg font-bold text-yellow-300">LIVE</div>
          </div>
          {tagline && (
            <div className="hidden max-w-md border-l border-white/30 pl-5 sm:block">
              <p className="text-lg font-bold leading-snug">{tagline}</p>
            </div>
          )}
        </div>

        {links.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="mr-1 text-sm text-gray-300">{t("followUs")}</span>
            {links.map((link) => (
              <SocialButton key={link.href} href={link.href}>{link.icon}</SocialButton>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
