import { readFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getArticleBySlug } from "@/lib/queries/articles";
import {
  DEFAULT_SHARE_IMAGE_PATH,
  resolveArticleShareImage,
  toAbsoluteHttpsUrl,
} from "@/lib/seo/metadata";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

async function serveFallbackShareImage() {
  try {
    const filePath = path.join(process.cwd(), "public", "shareimg.jpeg");
    const file = await readFile(filePath);
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return NextResponse.redirect(toAbsoluteHttpsUrl(DEFAULT_SHARE_IMAGE_PATH), 302);
  }
}

/**
 * Same-origin OG helper.
 * Redirects to the article's Cloudinary/gallery/featured/banner image when present,
 * otherwise serves public/shareimg.jpeg.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const decodedSlug = decodeURIComponent(slug);
    const article = await getArticleBySlug(decodedSlug);
    if (!article) return serveFallbackShareImage();

    const imageUrl = resolveArticleShareImage(article);
    const fallbackUrl = toAbsoluteHttpsUrl(DEFAULT_SHARE_IMAGE_PATH);

    if (imageUrl === fallbackUrl) {
      return serveFallbackShareImage();
    }

    // Redirect to the real uploaded image (Cloudinary). WhatsApp follows this.
    return NextResponse.redirect(imageUrl, {
      status: 302,
      headers: {
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return serveFallbackShareImage();
  }
}
