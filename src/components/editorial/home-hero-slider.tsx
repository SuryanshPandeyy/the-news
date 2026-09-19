"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { ArticleImage } from "@/components/editorial/article-image";

export type HeroSlide = {
  _id: string;
  slug: string;
  title: string;
  excerpt?: string;
  featuredImage?: string;
  categoryName: string;
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
    <div className="relative w-full overflow-hidden bg-[#0a192f]">
      <div
        className="flex h-[400px] transition-transform duration-700 ease-in-out md:h-[500px]"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {slides.map((slide) => (
          <Link
            key={slide._id}
            href={`/news/${slide.slug}`}
            className="group relative h-full w-full flex-shrink-0 cursor-pointer"
          >
            <div className="absolute inset-0 bg-black">
              <ArticleImage
                src={slide.featuredImage}
                alt={slide.title}
                seed={slide._id}
                fill
                priority
                sizes="100vw"
                className="opacity-60 mix-blend-overlay transition-transform duration-1000 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a192f] via-[#0a192f]/60 to-transparent" />
              <div className="absolute inset-0 w-2/3 bg-gradient-to-r from-[#0a192f]/80 to-transparent" />
            </div>

            <div className="absolute inset-0 mx-auto flex w-full max-w-[1440px] flex-col justify-end p-6 md:p-12">
              <div className="max-w-3xl translate-y-4 transition-transform duration-500 group-hover:translate-y-0">
                <span className="mb-4 inline-block rounded-sm bg-blue-600 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white shadow-lg">
                  {slide.categoryName}
                </span>
                <h2 className="mb-4 font-serif text-3xl font-bold leading-tight text-white drop-shadow-md md:text-5xl lg:text-6xl">
                  {slide.title}
                </h2>
                {slide.excerpt && (
                  <p className="line-clamp-2 hidden max-w-2xl font-sans text-lg text-gray-200 opacity-0 transition-opacity delay-100 duration-500 group-hover:opacity-100 md:block md:text-xl">
                    {slide.excerpt}
                  </p>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>

      {slides.length > 1 && (
        <div className="absolute bottom-6 right-6 z-20 flex items-center space-x-4 md:bottom-12 md:right-12">
          <div className="mr-4 flex space-x-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === index ? "w-8 bg-blue-500" : "w-2 bg-white/40 hover:bg-white/80"
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
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Previous slide"
          >
            <ChevronLeft size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              nextSlide();
            }}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-white/10 text-white backdrop-blur-sm transition-colors hover:bg-white/20"
            aria-label="Next slide"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </div>
  );
}
