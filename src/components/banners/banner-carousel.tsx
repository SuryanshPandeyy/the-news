"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, A11y } from "swiper/modules";
import type { BannerItem } from "@/lib/queries/banners";
import "swiper/css";
import "swiper/css/pagination";

export function BannerCarousel({ banners }: { banners: BannerItem[] }) {
  if (!banners.length) return null;

  return (
    <Swiper
      modules={[Autoplay, Pagination, A11y]}
      spaceBetween={16}
      slidesPerView={1}
      autoplay={{ delay: 5000, disableOnInteraction: true }}
      pagination={{ clickable: true }}
      className="overflow-hidden rounded-xl"
    >
      {banners.map((banner) => (
        <SwiperSlide key={banner._id}>
          {banner.link ? (
            <Link href={banner.link} className="block">
              <BannerImage banner={banner} />
            </Link>
          ) : (
            <BannerImage banner={banner} />
          )}
        </SwiperSlide>
      ))}
    </Swiper>
  );
}

function BannerImage({ banner }: { banner: BannerItem }) {
  return (
    <div className="relative aspect-[21/6] w-full bg-muted">
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        className="object-cover"
        sizes="100vw"
      />
    </div>
  );
}
