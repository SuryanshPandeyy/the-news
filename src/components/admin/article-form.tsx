"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveArticle } from "@/lib/actions/articles";
import { slugify } from "@/lib/utils/slug";
import type { ArticleDetail, ArticleImageItem } from "@/lib/types";
import { AdminLabel } from "@/components/admin/admin-label";
import { useLocale } from "@/components/providers/locale-provider";

type CategoryOption = { _id: string; name: string };

function initialImages(article?: ArticleDetail): ArticleImageItem[] {
  if (article?.images?.length) return article.images;
  if (article?.featuredImage) {
    return [{ url: article.featuredImage, publicId: article.featuredImagePublicId }];
  }
  return [];
}

export function ArticleForm({
  categories,
  article,
  defaultAuthor = "Editorial Desk",
}: {
  categories: CategoryOption[];
  article?: ArticleDetail;
  defaultAuthor?: string;
}) {
  const router = useRouter();
  const { t } = useLocale();
  const isNew = !article;
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugManual, setSlugManual] = useState(Boolean(article));
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "<p></p>");
  const [category, setCategory] = useState(article?.category._id ?? "");
  const [author, setAuthor] = useState(article?.author ?? defaultAuthor);
  const [images, setImages] = useState<ArticleImageItem[]>(() => initialImages(article));
  const [status, setStatus] = useState<"draft" | "published">(
    article?.status ?? "published",
  );
  const [featured, setFeatured] = useState(article?.featured ?? false);
  const [breaking, setBreaking] = useState(article?.breaking ?? false);
  const [trending, setTrending] = useState(article?.trending ?? false);
  const [editorsPick, setEditorsPick] = useState(article?.editorsPick ?? false);
  const [views, setViews] = useState(String(article?.views ?? 0));
  const [publishedAt, setPublishedAt] = useState(
    article?.publishedAt
      ? new Date(article.publishedAt).toISOString().slice(0, 16)
      : "",
  );

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugManual) {
      setSlug(slugify(value));
    }
  }

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setUploading(true);
    const added: ArticleImageItem[] = [];
    for (const file of Array.from(fileList)) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Upload failed");
        continue;
      }
      added.push({ url: data.url, publicId: data.publicId });
    }
    setUploading(false);
    if (added.length) {
      setImages((prev) => [...prev, ...added]);
      toast.success(`${added.length} image(s) uploaded`);
    }
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  function moveImage(index: number, direction: -1 | 1) {
    setImages((prev) => {
      const next = [...prev];
      const target = index + direction;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next;
    });
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await saveArticle(
      {
        title,
        slug: slug.trim() || undefined,
        excerpt,
        content,
        category,
        author,
        images,
        status,
        featured,
        breaking,
        trending,
        editorsPick,
        views: Number(views) || 0,
        publishedAt: publishedAt || null,
      },
      article?._id,
    );
    setLoading(false);
    if (!result.success) {
      toast.error(result.message);
      return;
    }
    toast.success(result.message);
    router.push("/admin/news");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="mx-auto max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-black">{t("story")}</CardTitle>
          <CardDescription>{t("storyDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <AdminLabel htmlFor="title">{t("title")}</AdminLabel>
            <Input
              id="title"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder={t("titlePlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <AdminLabel htmlFor="slug">{t("slugOptional")}</AdminLabel>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => {
                setSlugManual(true);
                setSlug(e.target.value);
              }}
              placeholder={t("slugPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <AdminLabel htmlFor="excerpt">{t("shortDescription")}</AdminLabel>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder={t("excerptPlaceholder")}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-black">{t("images")}</CardTitle>
          <CardDescription>{t("imagesDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <AdminLabel>{t("uploadImages")}</AdminLabel>
            <Input
              type="file"
              accept="image/*"
              multiple
              disabled={uploading}
              onChange={(e) => {
                void uploadFiles(e.target.files);
                e.target.value = "";
              }}
            />
          </div>
          {images.length > 0 && (
            <ul className="grid gap-3 sm:grid-cols-2">
              {images.map((img, index) => (
                <li key={`${img.url}-${index}`} className="relative overflow-hidden rounded-md border">
                  <img src={img.url} alt="" className="aspect-video w-full object-cover" />
                  <div className="flex flex-wrap items-center gap-2 border-t bg-muted/30 p-2 text-xs">
                    {index === 0 && (
                      <span className="font-semibold text-primary">{t("hero")}</span>
                    )}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={index === 0}
                      onClick={() => moveImage(index, -1)}
                    >
                      {t("up")}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      disabled={index === images.length - 1}
                      onClick={() => moveImage(index, 1)}
                    >
                      {t("down")}
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() => removeImage(index)}
                    >
                      {t("remove")}
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-black">{t("details")}</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <AdminLabel>{t("categories")}</AdminLabel>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">{t("selectCategory")}</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <AdminLabel htmlFor="author">{t("authorName")}</AdminLabel>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-black">{t("storyBody")}</CardTitle>
          <CardDescription className="font-bold text-black">{t("bodyPlaceholderHint")}</CardDescription>
        </CardHeader>
        <CardContent>
          <RichTextEditor value={content} onChange={setContent} />
        </CardContent>
      </Card>

      <details className="rounded-lg border bg-card">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold">
          {t("placementOptional")}
        </summary>
        <div className="space-y-4 border-t px-4 py-4">
          <p className="text-sm text-muted-foreground">{t("placementHint")}</p>
          <div className="flex flex-wrap gap-6">
            <Toggle label={t("featuredHero")} checked={featured} onChange={setFeatured} />
            <Toggle label={t("trending")} checked={trending} onChange={setTrending} />
            <Toggle label={t("breaking")} checked={breaking} onChange={setBreaking} />
            <Toggle label={t("editorsPick")} checked={editorsPick} onChange={setEditorsPick} />
          </div>
          <Separator />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <AdminLabel>{t("status")}</AdminLabel>
              <select
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              >
                <option value="draft">{t("draft")}</option>
                <option value="published">{t("published")}</option>
              </select>
            </div>
            <div className="space-y-2">
              <AdminLabel htmlFor="publishedAt">{t("publishedAt")}</AdminLabel>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <AdminLabel htmlFor="views">{t("viewCount")}</AdminLabel>
              <Input
                id="views"
                type="number"
                min={0}
                value={views}
                onChange={(e) => setViews(e.target.value)}
              />
            </div>
          </div>
        </div>
      </details>

      <Button type="submit" disabled={loading || uploading} size="lg">
        {loading ? t("saving") : isNew ? t("publishStory") : t("updateStory")}
      </Button>
    </form>
  );
}

function Toggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Switch checked={checked} onCheckedChange={(v) => onChange(Boolean(v))} />
      <AdminLabel className="font-normal">{label}</AdminLabel>
    </div>
  );
}
