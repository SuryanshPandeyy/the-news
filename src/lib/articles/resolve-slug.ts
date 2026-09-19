import mongoose from "mongoose";
import { latinSlugFromTitle } from "@/lib/utils/slug";

export function resolveArticleSlug(
  title: string,
  manualSlug: string | undefined,
  documentId?: string,
): { slug: string; presetId?: mongoose.Types.ObjectId } {
  const latin = latinSlugFromTitle(title, manualSlug);
  if (latin) {
    return { slug: latin };
  }
  if (documentId) {
    return { slug: documentId };
  }
  const presetId = new mongoose.Types.ObjectId();
  return { slug: presetId.toString(), presetId };
}
