"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, A11y } from "swiper/modules";
import { NewsCard } from "@/components/news/news-card";
import type { ArticleListItem } from "@/lib/types";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

export function FeaturedCarousel({ articles }: { articles: ArticleListItem[] }) {
  if (!articles.length) return null;

  return (
    <Swiper
      modules={[Navigation, Pagination, A11y]}
      spaceBetween={20}
      slidesPerView={1}
      navigation
      pagination={{ clickable: true }}
      breakpoints={{
        640: { slidesPerView: 2 },
        1024: { slidesPerView: 3 },
      }}
      className="pb-10!"
    >
      {articles.map((article) => (
        <SwiperSlide key={article._id}>
          <NewsCard article={article} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
