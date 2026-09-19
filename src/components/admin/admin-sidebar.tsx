"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ImageIcon,
  LayoutDashboard,
  Layers,
  Mail,
  Newspaper,
  Settings,
  Tags,
} from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import type { MessageKey } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";

const links: { href: string; labelKey: MessageKey; icon: typeof LayoutDashboard }[] = [
  { href: "/admin", labelKey: "dashboard", icon: LayoutDashboard },
  { href: "/admin/news", labelKey: "news", icon: Newspaper },
  { href: "/admin/categories", labelKey: "categories", icon: Tags },
  { href: "/admin/banners", labelKey: "banners", icon: Layers },
  { href: "/admin/media", labelKey: "media", icon: ImageIcon },
  { href: "/admin/subscribers", labelKey: "subscribers", icon: Mail },
  { href: "/admin/settings", labelKey: "settings", icon: Settings },
];

export function AdminSidebar() {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <aside className="hidden w-64 shrink-0 border-r bg-[#0F172A] text-white md:block">
      <div className="p-4 font-serif text-lg font-bold">{t("adminCms")}</div>
      <nav className="space-y-1 px-2">
        {links.map((link) => {
          const active =
            pathname === link.href ||
            (link.href !== "/admin" && pathname.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors",
                active ? "bg-[#2563EB] text-white" : "text-white/80 hover:bg-white/10",
              )}
            >
              <link.icon className="h-4 w-4" />
              {t(link.labelKey)}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
