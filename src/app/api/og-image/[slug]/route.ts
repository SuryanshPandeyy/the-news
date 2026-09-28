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
 * Same-origin OG image for WhatsApp/Facebook.
 * Prefers gallery → featured → banner → public/shareimg.jpeg.
 */
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;

  try {
    const article = await getArticleBySlug(slug);
    const imageUrl = resolveArticleShareImage(article);
    const fallbackUrl = toAbsoluteHttpsUrl(DEFAULT_SHARE_IMAGE_PATH);

    if (!article || imageUrl === fallbackUrl) {
      return serveFallbackShareImage();
    }

    const upstream = await fetch(imageUrl, {
      headers: { "User-Agent": "MaukhabarOgBot/1.0" },
      next: { revalidate: 86400 },
      redirect: "follow",
    });

    if (!upstream.ok) {
      return serveFallbackShareImage();
    }

    const contentType = upstream.headers.get("content-type") || "image/jpeg";
    if (!contentType.startsWith("image/")) {
      return serveFallbackShareImage();
    }

    const buffer = await upstream.arrayBuffer();
    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
      },
    });
  } catch {
    return serveFallbackShareImage();
  }
}
