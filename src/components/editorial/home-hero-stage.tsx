"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArticleImage } from "@/components/editorial/article-image";
import { formatDateIST } from "@/lib/timezone";
import { useLocale } from "@/components/providers/locale-provider";
import { newsArticlePath } from "@/lib/utils/slug";

export type HeroStageSlide = {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  image?: string;
  categoryName?: string;
  publishedAt?: string;
  createdAt: string;
};

export function HomeHeroStage({ slides }: { slides: HeroStageSlide[] }) {
  const { t } = useLocale();
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (!slides.length) return null;

  const slide = slides[index];
  const href = newsArticlePath(slide.slug);
  const date = slide.publishedAt ?? slide.createdAt;

  return (
    <article className="group relative min-h-[480px] overflow-hidden bg-black lg:min-h-[540px]">
      {slides.map((s, i) => (
        <div
          key={s._id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            i === index ? "opacity-100" : "pointer-events-none opacity-0"
          }`}
        >
          <ArticleImage
            src={s.image}
            alt={s.title}
            seed={s._id}
            fill
            priority={i === 0}
            sizes="(max-width: 1024px) 100vw, 66vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ))}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
        {slide.categoryName && (
          <span className="inline-flex bg-[#e71920] px-4 py-1.5 text-sm font-bold text-white">
            {slide.categoryName}
          </span>
        )}

        <Link href={href}>
          <h1 className="mt-3 max-w-4xl text-2xl font-black leading-[1.1] text-white sm:text-3xl lg:text-[40px]">
            {slide.title}
          </h1>
        </Link>

        {slide.excerpt && (
          <p className="mt-3 line-clamp-2 max-w-3xl text-sm leading-6 text-gray-200 sm:text-base">
            {slide.excerpt}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <Link
            href={href}
            className="inline-flex items-center gap-2 rounded-full bg-[#e71920] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#bd1117]"
          >
            {t("readFullStory")}
            <ChevronRight size={17} />
          </Link>

          <div className="flex items-center gap-3 text-sm text-gray-300">
            <span>{formatDateIST(date, { dateStyle: "medium" })}</span>
            {slides.length > 1 && (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i === 0 ? slides.length - 1 : i - 1))}
                  className="text-white/70 hover:text-white"
                  aria-label={t("previousImage")}
                >
                  <ChevronLeft size={21} />
                </button>
                {slides.map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setIndex(i)}
                    className={`h-2.5 rounded-full transition-all ${
                      i === index ? "w-6 bg-[#e71920]" : "w-2.5 bg-white/70"
                    }`}
                    aria-label={`Slide ${i + 1}`}
                  />
                ))}
                <button
                  type="button"
                  onClick={() => setIndex((i) => (i + 1) % slides.length)}
                  className="text-white/70 hover:text-white"
                  aria-label={t("nextImage")}
                >
                  <ChevronRight size={21} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
