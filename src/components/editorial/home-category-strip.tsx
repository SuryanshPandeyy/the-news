import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ArticleImage } from "@/components/editorial/article-image";
import type { CategorySummary } from "@/lib/types";
import { categoryPath } from "@/lib/utils/slug";

export function HomeCategoryStrip({
  categories,
  categoryImages,
}: {
  categories: CategorySummary[];
  categoryImages: Record<string, string | undefined>;
}) {
  if (!categories.length) return null;

  return (
    <section className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
      {categories.map((cat) => (
        <Link
          key={cat._id}
          href={categoryPath(cat.slug)}
          className="group relative block h-[120px] overflow-hidden bg-black"
        >
          <ArticleImage
            src={categoryImages[cat._id] ?? cat.image}
            alt={cat.name}
            seed={cat._id}
            fill
            sizes="(max-width: 640px) 50vw, 16vw"
            className="object-cover opacity-80 transition duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 flex items-center justify-between p-3">
            <h3 className="text-base font-black text-white sm:text-lg">{cat.name}</h3>
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-white text-black">
              <ChevronRight size={16} />
            </span>
          </div>
        </Link>
      ))}
    </section>
  );
}
