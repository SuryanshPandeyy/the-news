"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocaleAction } from "@/lib/actions/locale";
import type { Locale } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/locale-provider";

export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale, t } = useLocale();
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  function switchTo(next: Locale) {
    if (next === locale || pending) return;
    startTransition(async () => {
      await setLocaleAction(next);
      router.refresh();
    });
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
        {t("language")}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => switchTo("hi")}
          className={cn(
            "flex-1 rounded-md border px-3 py-2 text-sm font-bold transition-colors",
            locale === "hi"
              ? "border-[#0a192f] bg-[#0a192f] text-white"
              : "border-gray-200 text-gray-700 hover:bg-gray-50",
          )}
        >
          {t("hindi")}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => switchTo("en")}
          className={cn(
            "flex-1 rounded-md border px-3 py-2 text-sm font-bold transition-colors",
            locale === "en"
              ? "border-[#0a192f] bg-[#0a192f] text-white"
              : "border-gray-200 text-gray-700 hover:bg-gray-50",
          )}
        >
          {t("english")}
        </button>
      </div>
    </div>
  );
}
