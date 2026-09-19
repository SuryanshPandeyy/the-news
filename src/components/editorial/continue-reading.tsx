"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";

export function ContinueReading({ href }: { href: string }) {
  const { t } = useLocale();
  return (
    <Link
      href={href}
      className="group/btn flex items-center self-start text-[13px] font-bold text-blue-600 transition-colors hover:text-[#0a192f]"
    >
      {t("continueReading")}
      <ChevronRight className="ml-1 h-3.5 w-3.5 transition-transform group-hover/btn:translate-x-1" />
    </Link>
  );
}
