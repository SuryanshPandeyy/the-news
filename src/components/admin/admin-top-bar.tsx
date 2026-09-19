"use client";

import { SignOutButton } from "@/components/admin/sign-out-button";
import { useLocale } from "@/components/providers/locale-provider";

export function AdminTopBar() {
  const { t } = useLocale();
  return (
    <header className="flex items-center justify-between border-b bg-background px-4 py-3 md:px-6">
      <p className="text-sm font-medium text-muted-foreground">{t("adminCms")}</p>
      <SignOutButton />
    </header>
  );
}
