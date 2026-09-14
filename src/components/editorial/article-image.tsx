import Image from "next/image";
import { articleImageUrl } from "@/lib/images/placeholders";
import { cn } from "@/lib/utils";

export function ArticleImage({
  src,
  alt,
  seed,
  className,
  fill,
  width,
  height,
  priority,
  sizes,
}: {
  src?: string | null;
  alt: string;
  seed?: string | number;
  className?: string;
  fill?: boolean;
  width?: number;
  height?: number;
  priority?: boolean;
  sizes?: string;
}) {
  const url = articleImageUrl(src, seed ?? alt);

  if (fill) {
    return (
      <Image
        src={url}
        alt={alt}
        fill
        priority={priority}
        sizes={sizes ?? "100vw"}
        className={cn("object-cover", className)}
      />
    );
  }

  return (
    <Image
      src={url}
      alt={alt}
      width={width ?? 800}
      height={height ?? 500}
      priority={priority}
      className={cn("object-cover", className)}
    />
  );
}
