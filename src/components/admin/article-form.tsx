"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { saveArticle } from "@/lib/actions/articles";
import { latinSlugFromTitle } from "@/lib/utils/slug";
import type { ArticleDetail, ArticleImageItem } from "@/lib/types";
import { AdminLabel } from "@/components/admin/admin-label";
import { useLocale } from "@/components/providers/locale-provider";

type CategoryOption = { _id: string; name: string };

type PendingUpload = {
  id: string;
  previewUrl: string;
  fileName: string;
  progress: number;
  status: "uploading" | "error";
  errorMessage?: string;
};

function uploadFileWithProgress(
  file: File,
  onProgress: (percent: number) => void,
): Promise<{ url: string; publicId?: string }> {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", "/api/admin/upload");
    xhr.withCredentials = true;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      let data: { url?: string; publicId?: string; error?: string };
      try {
        data = JSON.parse(xhr.responseText) as typeof data;
      } catch {
        reject(new Error("Invalid response"));
        return;
      }
      if (xhr.status >= 200 && xhr.status < 300 && data.url) {
        resolve({ url: data.url, publicId: data.publicId });
        return;
      }
      reject(new Error(data.error ?? "Upload failed"));
    };
    xhr.onerror = () => reject(new Error("Upload failed"));
    const formData = new FormData();
    formData.append("file", file);
    xhr.send(formData);
  });
}

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
  const [content, setContent] = useState(article?.content ?? "<p></p>");
  const [category, setCategory] = useState(article?.category?._id ?? "");
  const [author, setAuthor] = useState(article?.author ?? defaultAuthor);
  const [images, setImages] = useState<ArticleImageItem[]>(() => initialImages(article));
  const [bannerImage, setBannerImage] = useState(article?.bannerImage ?? "");
  const [bannerImagePublicId, setBannerImagePublicId] = useState(
    article?.bannerImagePublicId ?? "",
  );
  const [bannerUploading, setBannerUploading] = useState(false);
  const [bannerProgress, setBannerProgress] = useState(0);
  const [pendingUploads, setPendingUploads] = useState<PendingUpload[]>([]);
  const pendingUploadsRef = useRef(pendingUploads);
  pendingUploadsRef.current = pendingUploads;
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
      setSlug(latinSlugFromTitle(value) ?? "");
    }
  }

  useEffect(() => {
    return () => {
      pendingUploadsRef.current.forEach((item) => URL.revokeObjectURL(item.previewUrl));
    };
  }, []);

  function dismissPendingUpload(id: string) {
    setPendingUploads((prev) => {
      const item = prev.find((p) => p.id === id);
      if (item) URL.revokeObjectURL(item.previewUrl);
      return prev.filter((p) => p.id !== id);
    });
  }

  async function uploadFiles(fileList: FileList | null) {
    if (!fileList?.length) return;
    setUploading(true);
    let successCount = 0;

    for (const file of Array.from(fileList)) {
      const id = crypto.randomUUID();
      const previewUrl = URL.createObjectURL(file);
      setPendingUploads((prev) => [
        ...prev,
        { id, previewUrl, fileName: file.name, progress: 0, status: "uploading" },
      ]);

      try {
        const result = await uploadFileWithProgress(file, (progress) => {
          setPendingUploads((prev) =>
            prev.map((p) => (p.id === id ? { ...p, progress } : p)),
          );
        });
        URL.revokeObjectURL(previewUrl);
        setPendingUploads((prev) => prev.filter((p) => p.id !== id));
        setImages((prev) => [...prev, { url: result.url, publicId: result.publicId }]);
        successCount += 1;
      } catch (err) {
        const message = err instanceof Error ? err.message : "Upload failed";
        setPendingUploads((prev) =>
          prev.map((p) =>
            p.id === id ? { ...p, status: "error" as const, errorMessage: message, progress: 0 } : p,
          ),
        );
        toast.error(`${file.name}: ${message}`);
      }
    }

    setUploading(false);
    if (successCount > 0) {
      toast.success(
        successCount === 1 ? "1 image uploaded" : `${successCount} images uploaded`,
      );
    }
  }

  async function uploadBannerFile(fileList: FileList | null) {
    const file = fileList?.[0];
    if (!file) return;
    setBannerUploading(true);
    setBannerProgress(0);
    try {
      const result = await uploadFileWithProgress(file, setBannerProgress);
      setBannerImage(result.url);
      setBannerImagePublicId(result.publicId ?? "");
      toast.success("Header banner uploaded");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setBannerUploading(false);
      setBannerProgress(0);
    }
  }

  function clearBannerImage() {
    setBannerImage("");
    setBannerImagePublicId("");
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
    const latinSlug = latinSlugFromTitle(title, slugManual ? slug : undefined);
    if (!slugManual && latinSlug) {
      setSlug(latinSlug);
    }
    setLoading(true);
    const result = await saveArticle(
      {
        title,
        slug: latinSlug ?? (slugManual ? slug : undefined),
        content,
        category: category || undefined,
        author,
        images,
        bannerImage: bannerImage.trim() || undefined,
        bannerImagePublicId: bannerImagePublicId.trim() || undefined,
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
    if (result.id && !latinSlug) {
      setSlug(result.id);
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
            <p className="text-xs text-muted-foreground">{t("slugAutoIdHint")}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-black">{t("images")}</CardTitle>
          <CardDescription>{t("imagesDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <AdminLabel>{t("uploadImages")}</AdminLabel>
              <Input
                type="file"
                accept="image/*"
                multiple
                disabled={uploading || bannerUploading}
                onChange={(e) => {
                  void uploadFiles(e.target.files);
                  e.target.value = "";
                }}
              />
            </div>
            <div className="space-y-2">
              <AdminLabel>{t("headerBanner")}</AdminLabel>
              <p className="text-xs text-muted-foreground">{t("headerBannerDesc")}</p>
              <Input
                type="file"
                accept="image/*"
                disabled={uploading || bannerUploading}
                onChange={(e) => {
                  void uploadBannerFile(e.target.files);
                  e.target.value = "";
                }}
              />
              {bannerUploading && (
                <div className="space-y-1">
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-[width]"
                      style={{ width: `${bannerProgress}%` }}
                    />
                  </div>
                  <p className="text-right text-xs tabular-nums text-muted-foreground">
                    {bannerProgress}%
                  </p>
                </div>
              )}
              {bannerImage && !bannerUploading && (
                <div className="relative mt-2 overflow-hidden rounded-md border">
                  <div className="relative aspect-[21/9] w-full">
                    <img src={bannerImage} alt="" className="h-full w-full object-cover" />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/90 shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                      aria-label={t("remove")}
                      onClick={clearBannerImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
          {(pendingUploads.length > 0 || images.length > 0) && (
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {pendingUploads.map((pending) => (
                <li
                  key={pending.id}
                  className="relative overflow-hidden rounded-md border bg-muted/20"
                >
                  <div className="relative aspect-video w-full">
                    <img
                      src={pending.previewUrl}
                      alt=""
                      className="h-full w-full object-cover opacity-90"
                    />
                    {pending.status === "uploading" && (
                      <div className="absolute inset-x-0 bottom-0 bg-black/50 px-2 py-2 text-white">
                        <p className="mb-1 truncate text-xs">{pending.fileName}</p>
                        <div className="h-1.5 overflow-hidden rounded-full bg-white/30">
                          <div
                            className="h-full rounded-full bg-primary transition-[width] duration-150"
                            style={{ width: `${pending.progress}%` }}
                          />
                        </div>
                        <p className="mt-1 text-right text-xs tabular-nums">{pending.progress}%</p>
                      </div>
                    )}
                    {pending.status === "error" && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/60 p-3 text-center text-white">
                        <p className="text-xs font-medium">{pending.errorMessage ?? "Upload failed"}</p>
                        <Button
                          type="button"
                          variant="secondary"
                          size="sm"
                          className="mt-2"
                          onClick={() => dismissPendingUpload(pending.id)}
                        >
                          {t("remove")}
                        </Button>
                      </div>
                    )}
                  </div>
                </li>
              ))}
              {images.map((img, index) => (
                <li key={`${img.url}-${index}`} className="relative overflow-hidden rounded-md border">
                  <div className="relative aspect-video w-full">
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                    <Button
                      type="button"
                      variant="secondary"
                      size="icon"
                      className="absolute right-2 top-2 h-8 w-8 rounded-full bg-background/90 shadow-sm hover:bg-destructive hover:text-destructive-foreground"
                      aria-label={t("remove")}
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                    {index === 0 && (
                      <span className="absolute left-2 top-2 rounded bg-primary px-2 py-0.5 text-xs font-semibold text-primary-foreground">
                        {t("hero")}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-2 border-t bg-muted/30 p-2 text-xs">
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
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive"
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
            <AdminLabel>{t("categoryOptional")}</AdminLabel>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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

      <Button type="submit" disabled={loading || uploading || bannerUploading} size="lg">
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
