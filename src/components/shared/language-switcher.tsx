"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { setLocaleAction } from "@/lib/actions/locale";
import type { Locale } from "@/lib/i18n/messages";
import { cn } from "@/lib/utils";
import { useLocale } from "@/components/providers/locale-provider";

export function LanguageSwitcher({
  className,
  variant = "default",
}: {
  className?: string;
  variant?: "default" | "compact" | "dark";
}) {
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

  const activeClass =
    variant === "dark"
      ? "border-[#e71920] bg-[#e71920] text-white"
      : variant === "compact"
        ? "border-white bg-white text-[#121212]"
        : "border-[#e71920] bg-[#e71920] text-white";

  const inactiveClass =
    variant === "dark"
      ? "border-white/20 text-gray-200 hover:bg-white/10"
      : variant === "compact"
        ? "border-white/30 text-gray-200 hover:bg-white/10"
        : "border-gray-200 text-gray-700 hover:bg-gray-50";

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1", className)}>
        <button
          type="button"
          disabled={pending}
          onClick={() => switchTo("hi")}
          className={cn(
            "rounded border px-2 py-0.5 text-[11px] font-bold transition-colors",
            locale === "hi" ? activeClass : inactiveClass,
          )}
        >
          {t("hindi")}
        </button>
        <button
          type="button"
          disabled={pending}
          onClick={() => switchTo("en")}
          className={cn(
            "rounded border px-2 py-0.5 text-[11px] font-bold transition-colors",
            locale === "en" ? activeClass : inactiveClass,
          )}
        >
          {t("english")}
        </button>
      </div>
    );
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <span
        className={cn(
          "text-xs font-bold uppercase tracking-wider",
          variant === "dark" ? "text-gray-400" : "text-gray-400",
        )}
      >
        {t("language")}
      </span>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => switchTo("hi")}
          className={cn(
            "flex-1 rounded-md border px-3 py-2 text-sm font-bold transition-colors",
            locale === "hi" ? activeClass : inactiveClass,
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
            locale === "en" ? activeClass : inactiveClass,
          )}
        >
          {t("english")}
        </button>
      </div>
    </div>
  );
}
