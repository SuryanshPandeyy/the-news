"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { useLocale } from "@/components/providers/locale-provider";
import { articleImageUrl } from "@/lib/images/placeholders";
import type { ArticleImageItem } from "@/lib/types";
import { cn } from "@/lib/utils";

const ZOOM_STEP = 0.25;
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;

function MediaThumb({
  src,
  alt,
  seed,
  priority,
  sizes,
  className,
  onOpen,
}: {
  src: string;
  alt: string;
  seed: string;
  priority?: boolean;
  sizes: string;
  className?: string;
  onOpen: () => void;
}) {
  const url = articleImageUrl(src, seed);

  return (
    <button
      type="button"
      onClick={onOpen}
      className={cn(
        "group relative w-full cursor-zoom-in overflow-hidden bg-gray-100 text-left ring-offset-2 transition-shadow hover:shadow-md focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600",
        className,
      )}
      aria-label={alt}
    >
      <Image
        src={url}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes}
        className="object-contain transition-transform duration-300 group-hover:scale-[1.02]"
      />
    </button>
  );
}

export function ArticlePageMedia({
  images,
  title,
  articleId,
  heroAlt,
}: {
  images: ArticleImageItem[];
  title: string;
  articleId: string;
  heroAlt: string;
}) {
  const { t } = useLocale();
  const urls = images.map((img) => img.url).filter(Boolean);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const open = lightboxIndex !== null;
  const currentUrl = open ? urls[lightboxIndex] : null;

  const close = useCallback(() => {
    setLightboxIndex(null);
    setZoom(1);
  }, []);

  const goPrev = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i > 0 ? i - 1 : i));
    setZoom(1);
  }, []);

  const goNext = useCallback(() => {
    setLightboxIndex((i) => (i !== null && i < urls.length - 1 ? i + 1 : i));
    setZoom(1);
  }, [urls.length]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [open, close, goPrev, goNext]);

  if (urls.length === 0) return null;

  const hero = urls[0];
  const gallery = urls.slice(1);

  return (
    <>
      <figure className="relative mb-10 aspect-[16/9] w-full md:aspect-[2/1]">
        <MediaThumb
          src={hero}
          alt={heroAlt}
          seed={articleId}
          priority
          sizes="(max-width: 896px) 100vw, 896px"
          className="absolute inset-0 h-full rounded-sm"
          onOpen={() => setLightboxIndex(0)}
        />
      </figure>

      {gallery.length > 0 && (
        <div className="mx-auto mb-10 max-w-2xl">
          <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">
            {t("gallery")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {gallery.map((url, i) => (
              <figure
                key={`${url}-${i}`}
                className="relative aspect-[4/3] w-full overflow-hidden rounded-sm"
              >
                <MediaThumb
                  src={url}
                  alt={title}
                  seed={`${articleId}-gallery-${i}`}
                  sizes="(max-width: 640px) 100vw, 50vw"
                  className="absolute inset-0 h-full"
                  onOpen={() => setLightboxIndex(i + 1)}
                />
              </figure>
            ))}
          </div>
        </div>
      )}

      {open && currentUrl && (
        <div
          className="fixed inset-0 z-[100] flex flex-col bg-black/95"
          role="dialog"
          aria-modal="true"
          aria-label={title}
        >
          <div className="flex shrink-0 items-center justify-between gap-2 px-3 py-3 text-white md:px-6">
            <span className="truncate text-sm font-medium text-white/90">
              {lightboxIndex + 1} / {urls.length}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
                disabled={zoom <= ZOOM_MIN}
                className="rounded-full p-2 text-white/90 hover:bg-white/10 disabled:opacity-40"
                aria-label={t("zoomOut")}
              >
                <ZoomOut className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
                disabled={zoom >= ZOOM_MAX}
                className="rounded-full p-2 text-white/90 hover:bg-white/10 disabled:opacity-40"
                aria-label={t("zoomIn")}
              >
                <ZoomIn className="h-5 w-5" />
              </button>
              <button
                type="button"
                onClick={close}
                className="ml-1 rounded-full p-2 text-white/90 hover:bg-white/10"
                aria-label={t("closeImage")}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>

          <div
            className="relative min-h-0 flex-1 overflow-auto"
            onClick={(e) => {
              if (e.target === e.currentTarget) close();
            }}
          >
            <div className="flex min-h-full min-w-full items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element -- zoom/pan in lightbox */}
              <img
                src={articleImageUrl(currentUrl, `${articleId}-lb-${lightboxIndex}`)}
                alt={heroAlt}
                className="max-h-[85vh] max-w-full object-contain transition-transform duration-200 ease-out"
                style={{ transform: `scale(${zoom})` }}
                draggable={false}
              />
            </div>
          </div>

          {urls.length > 1 && (
            <>
              <button
                type="button"
                onClick={goPrev}
                disabled={lightboxIndex === 0}
                className="absolute left-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 disabled:opacity-30 md:left-4"
                aria-label={t("previousImage")}
              >
                <ChevronLeft className="h-7 w-7" />
              </button>
              <button
                type="button"
                onClick={goNext}
                disabled={lightboxIndex === urls.length - 1}
                className="absolute right-2 top-1/2 z-10 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white hover:bg-black/70 disabled:opacity-30 md:right-4"
                aria-label={t("nextImage")}
              >
                <ChevronRight className="h-7 w-7" />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
