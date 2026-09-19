"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArticleImage } from "@/components/editorial/article-image";
import { newsArticlePath } from "@/lib/utils/slug";

export type HeroSlide = {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  image?: string;
  categoryName?: string;
};

export function HomeHeroSlider({ slides }: { slides: HeroSlide[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [slides.length]);

  if (slides.length === 0) return null;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrentSlide((prev) => (prev === 0 ? slides.length - 1 : prev - 1));

  return (
    <div className="relative w-full overflow-hidden bg-neutral-800">
      <div
        className="flex h-[280px] transition-transform duration-700 ease-in-out md:h-[360px]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <Link
            key={slide._id}
            href={newsArticlePath(slide.slug)}
            className="group relative h-full w-full flex-shrink-0 cursor-pointer"
          >
            <div className="absolute inset-0">
              <ArticleImage
                src={slide.image}
                alt={slide.title}
                seed={slide._id}
                fill
                priority
                sizes="100vw"
                className="object-cover transition-transform duration-1000 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gray-900/50" />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900/75 via-gray-900/35 to-gray-900/20" />
            </div>

            <div className="absolute inset-0 mx-auto flex w-full max-w-[1440px] flex-col justify-end p-5 md:p-10">
              <div className="max-w-2xl">
                {slide.categoryName && (
                  <span className="mb-2 inline-block rounded-sm bg-white/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                    {slide.categoryName}
                  </span>
                )}
                <h2 className="line-clamp-3 font-serif text-lg font-bold leading-snug text-white drop-shadow-sm md:text-xl lg:text-2xl">
                  {slide.title}
                </h2>
                {slide.excerpt && (
                  <p className="mt-2 line-clamp-2 hidden max-w-xl text-sm leading-snug text-white/90 md:block">
                    {slide.excerpt}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-4 right-4 z-20 flex items-center space-x-3 md:bottom-6 md:right-8">
          <div className="mr-2 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "w-6 bg-white" : "w-1.5 bg-white/45 hover:bg-white/70"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              prevSlide();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
            aria-label="Previous slide"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-black/25 text-white backdrop-blur-sm transition-colors hover:bg-black/40"
            aria-label="Next slide"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      )}
    </div>
  );
}
