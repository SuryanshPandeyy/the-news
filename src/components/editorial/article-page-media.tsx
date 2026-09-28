"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from "lucide-react";
import { Autoplay, Navigation, Pagination, A11y } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { useLocale } from "@/components/providers/locale-provider";
import { articleImageUrl } from "@/lib/images/placeholders";
import type { ArticleImageItem } from "@/lib/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./article-page-media.css";

const ZOOM_STEP = 0.25;
const ZOOM_MIN = 1;
const ZOOM_MAX = 3;

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
  const urls = Array.from(
    new Set(images.map((img) => img.url?.trim()).filter(Boolean) as string[]),
  );
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [zoom, setZoom] = useState(1);

  const open = lightboxIndex !== null;
  const currentUrl = open ? urls[lightboxIndex] : null;
  const multi = urls.length > 1;

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

  return (
    <>
      <div className="article-media-swiper relative mb-10 w-full overflow-hidden rounded-md bg-gray-100">
        <Swiper
          modules={[Autoplay, Pagination, Navigation, A11y]}
          spaceBetween={0}
          slidesPerView={1}
          loop={multi}
          autoplay={
            multi
              ? {
                  delay: 4500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }
              : false
          }
          pagination={multi ? { clickable: true } : false}
          navigation={multi}
          className="w-full"
        >
          {urls.map((src, index) => {
            const url = articleImageUrl(src, `${articleId}-slide-${index}`);
            const alt = index === 0 ? heroAlt : `${title} — ${index + 1}`;

            return (
              <SwiperSlide key={`${src}-${index}`}>
                <button
                  type="button"
                  onClick={() => setLightboxIndex(index)}
                  className="group relative block aspect-[4/3] w-full cursor-zoom-in overflow-hidden bg-gray-100 text-left sm:aspect-[16/10] md:aspect-[2/1]"
                  aria-label={alt}
                >
                  <Image
                    src={url}
                    alt={alt}
                    fill
                    priority={index === 0}
                    sizes="(max-width: 640px) 100vw, (max-width: 896px) 100vw, 896px"
                    className="object-contain transition-transform duration-300 group-hover:scale-[1.02] sm:object-cover"
                  />
                </button>
              </SwiperSlide>
            );
          })}
        </Swiper>

        {multi && (
          <div className="pointer-events-none absolute bottom-3 right-3 z-10 rounded bg-black/60 px-2 py-1 text-[11px] font-semibold text-white sm:text-xs">
            {urls.length} {t("gallery")}
          </div>
        )}
      </div>

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

          {multi && (
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
