"use client";

import { Check, Copy, Share2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useLocale } from "@/components/providers/locale-provider";
import { cn } from "@/lib/utils";

export function SocialShare({ url, title }: { url: string; title: string }) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);
  const [sharing, setSharing] = useState(false);

  const copyLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success(t("linkCopied"));
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error(t("copyLinkFailed"));
    }
  }, [url, t]);

  async function nativeShare() {
    if (typeof navigator === "undefined") return;

    if (navigator.share) {
      setSharing(true);
      try {
        await navigator.share({
          title,
          text: title,
          url,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== "AbortError") {
          toast.error(t("shareFailed"));
        }
      } finally {
        setSharing(false);
      }
      return;
    }

    await copyLink();
    toast.message(t("shareFallbackCopy"));
  }

  const buttonClass =
    "inline-flex items-center gap-2 rounded-full border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-800 transition-colors hover:bg-gray-50 disabled:opacity-50";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => void nativeShare()}
        disabled={sharing}
        className={cn(buttonClass, "border-[#0a192f] text-[#0a192f] hover:bg-[#0a192f]/5")}
        aria-label={t("share")}
      >
        <Share2 className="h-4 w-4 shrink-0" />
        {t("share")}
      </button>
      <button
        type="button"
        onClick={() => void copyLink()}
        className={buttonClass}
        aria-label={t("copyLink")}
      >
        {copied ? (
          <Check className="h-4 w-4 shrink-0 text-green-600" />
        ) : (
          <Copy className="h-4 w-4 shrink-0" />
        )}
        {copied ? t("linkCopied") : t("copyLink")}
      </button>
    </div>
  );
}
