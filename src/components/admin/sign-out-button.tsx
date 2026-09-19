"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/components/providers/locale-provider";

export function SignOutButton() {
  const { t } = useLocale();
  return (
    <Button variant="outline" size="sm" onClick={() => signOut({ callbackUrl: "/admin/login" })}>
      {t("signOut")}
    </Button>
  );
}
