import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDateIST } from "@/lib/timezone";
import type { ArticleListItem } from "@/lib/types";
import { cn } from "@/lib/utils";
import { newsArticlePath } from "@/lib/utils/slug";

type Variant = "standard" | "compact" | "featured" | "horizontal";

export function NewsCard({
  article,
  variant = "standard",
  className,
  priority,
}: {
  article: ArticleListItem;
  variant?: Variant;
  className?: string;
  priority?: boolean;
}) {
  const date = article.publishedAt ?? article.createdAt;

  if (variant === "compact") {
    return (
      <Link
        href={newsArticlePath(article.slug)}
        className={cn("group flex gap-3 py-2", className)}
      >
        {article.featuredImage && (
          <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-md">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="96px"
            />
          </div>
        )}
        <div className="min-w-0">
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug group-hover:text-primary">
            {article.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDateIST(date, { dateStyle: "medium" })}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "horizontal") {
    return (
      <Link
        href={newsArticlePath(article.slug)}
        className={cn(
          "group flex gap-4 rounded-lg border bg-card p-3 transition-shadow hover:shadow-md",
          className,
        )}
      >
        {article.featuredImage && (
          <div className="relative h-24 w-36 shrink-0 overflow-hidden rounded-md">
            <Image
              src={article.featuredImage}
              alt={article.title}
              fill
              className="object-cover"
              sizes="144px"
            />
          </div>
        )}
        <div className="min-w-0 flex-1">
          {article.category && (
            <Badge variant="secondary" className="mb-2 text-[10px] uppercase">
              {article.category.name}
            </Badge>
          )}
          <h3 className="line-clamp-2 font-semibold group-hover:text-primary">
            {article.title}
          </h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {formatDateIST(date, { dateStyle: "medium" })}
          </p>
        </div>
      </Link>
    );
  }

  if (variant === "featured") {
    return (
      <Link
        href={newsArticlePath(article.slug)}
        className={cn(
          "group relative block aspect-[16/10] overflow-hidden rounded-xl",
          className,
        )}
      >
        {article.featuredImage ? (
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        ) : (
          <div className="absolute inset-0 bg-muted" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
          {article.category && (
            <Badge className="mb-2 bg-[#DC2626] text-white hover:bg-[#DC2626]">
              {article.category.name}
            </Badge>
          )}
          <h3 className="font-serif text-2xl font-bold leading-tight md:text-3xl">
            {article.title}
          </h3>
          <p className="mt-2 text-sm text-white/80">
            {formatDateIST(date, { dateStyle: "medium" })}
          </p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={newsArticlePath(article.slug)}
      className={cn(
        "group flex flex-col overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-md",
        className,
      )}
    >
      {article.featuredImage && (
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={article.featuredImage}
            alt={article.title}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        {article.category && (
          <Badge variant="outline" className="mb-2 w-fit text-[10px] uppercase">
            {article.category.name}
          </Badge>
        )}
        <h3 className="line-clamp-2 font-semibold leading-snug group-hover:text-primary">
          {article.title}
        </h3>
        {article.excerpt && (
          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
            {article.excerpt}
          </p>
        )}
        <p className="mt-auto pt-3 text-xs text-muted-foreground">
          {formatDateIST(date, { dateStyle: "medium" })}
          {article.author ? ` · ${article.author}` : ""}
        </p>
      </div>
    </Link>
  );
}
