"use client";

import { ArticleImage } from "@/components/editorial/article-image";
import { useLocale } from "@/components/providers/locale-provider";
import type { ArticleImageItem } from "@/lib/types";

export function ArticleImageGallery({
  images,
  title,
  articleId,
}: {
  images: ArticleImageItem[];
  title: string;
  articleId: string;
}) {
  const { t } = useLocale();
  const gallery = images.slice(1);
  if (gallery.length === 0) return null;

  return (
    <div className="mx-auto mb-10 max-w-2xl">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-500">
        {t("gallery")}
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {gallery.map((img, i) => (
          <figure
            key={`${img.url}-${i}`}
            className="relative aspect-[4/3] overflow-hidden bg-gray-100"
          >
            <ArticleImage
              src={img.url}
              alt={title}
              seed={`${articleId}-gallery-${i}`}
              fill
              sizes="(max-width: 640px) 100vw, 50vw"
              className="object-cover"
            />
          </figure>
        ))}
      </div>
    </div>
  );
}
