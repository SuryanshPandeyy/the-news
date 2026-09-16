"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RichTextEditor } from "@/components/editor/rich-text-editor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { saveArticle } from "@/lib/actions/articles";
import { slugify } from "@/lib/utils/slug";
import type { ArticleDetail } from "@/lib/types";

type CategoryOption = { _id: string; name: string };

export function ArticleForm({
  categories,
  article,
}: {
  categories: CategoryOption[];
  article?: ArticleDetail;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState(article?.title ?? "");
  const [slug, setSlug] = useState(article?.slug ?? "");
  const [slugManual, setSlugManual] = useState(Boolean(article?.slug));
  const [excerpt, setExcerpt] = useState(article?.excerpt ?? "");
  const [content, setContent] = useState(article?.content ?? "<p></p>");
  const [category, setCategory] = useState(article?.category._id ?? "");
  const [author, setAuthor] = useState(article?.author ?? "Editorial Desk");
  const [status, setStatus] = useState<"draft" | "published">(
    article?.status ?? "draft",
  );
  const [featured, setFeatured] = useState(article?.featured ?? false);
  const [breaking, setBreaking] = useState(article?.breaking ?? false);
  const [trending, setTrending] = useState(article?.trending ?? false);
  const [featuredImage, setFeaturedImage] = useState(article?.featuredImage ?? "");
  const [featuredImagePublicId, setFeaturedImagePublicId] = useState(
    article?.featuredImagePublicId ?? "",
  );
  const [seoTitle, setSeoTitle] = useState(article?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(article?.seoDescription ?? "");
  const [tags, setTags] = useState((article?.tags ?? []).join(", "));
  const [subtitle, setSubtitle] = useState(article?.subtitle ?? "");
  const [featuredImageAlt, setFeaturedImageAlt] = useState(
    article?.featuredImageAlt ?? "",
  );
  const [imageCaption, setImageCaption] = useState(article?.imageCaption ?? "");
  const [sectionLabel, setSectionLabel] = useState(article?.sectionLabel ?? "");
  const [authorRole, setAuthorRole] = useState(article?.authorRole ?? "");
  const [editorsPick, setEditorsPick] = useState(article?.editorsPick ?? false);
  const [views, setViews] = useState(String(article?.views ?? 0));
  const [publishedAt, setPublishedAt] = useState(
    article?.publishedAt
      ? new Date(article.publishedAt).toISOString().slice(0, 16)
      : "",
  );
  const [imageUrl, setImageUrl] = useState(article?.featuredImage ?? "");

  function onTitleChange(value: string) {
    setTitle(value);
    if (!slugManual) {
      setSlug(slugify(value));
    }
  }

  async function handleUpload(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error ?? "Upload failed");
      return;
    }
    setFeaturedImage(data.url);
    setImageUrl(data.url);
    setFeaturedImagePublicId(data.publicId);
    toast.success("Image uploaded");
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const result = await saveArticle(
      {
        title,
        slug,
        excerpt,
        subtitle,
        content,
        category,
        author,
        authorRole,
        status,
        featured,
        breaking,
        trending,
        editorsPick,
        views: Number(views) || 0,
        featuredImage: featuredImage || imageUrl,
        featuredImageAlt,
        featuredImagePublicId,
        imageCaption,
        sectionLabel,
        publishedAt: publishedAt || null,
        seoTitle,
        seoDescription,
        tags: tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
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
          <CardTitle>Headline</CardTitle>
          <CardDescription>Title and URL shown on the homepage and article page.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => onTitleChange(e.target.value)} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={slug}
                onChange={(e) => {
                  setSlugManual(true);
                  setSlug(e.target.value);
                }}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="excerpt">Card excerpt</Label>
            <Textarea
              id="excerpt"
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Short summary for homepage and category lists"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="subtitle">Subtitle / dek</Label>
            <Textarea
              id="subtitle"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="Larger intro line under the headline on the article page"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Hero image</CardTitle>
          <CardDescription>Featured image, badge label, and photo credit.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setFeaturedImage(e.target.value);
                }}
                placeholder="https://images.unsplash.com/..."
              />
            </div>
            <div className="space-y-2">
              <Label>Upload replacement</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) void handleUpload(file);
                }}
              />
            </div>
          </div>
          {(featuredImage || imageUrl) && (
            <img
              src={featuredImage || imageUrl}
              alt={featuredImageAlt || title}
              className="max-h-56 w-full rounded-md object-cover"
            />
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="featuredImageAlt">Alt text</Label>
              <Input
                id="featuredImageAlt"
                value={featuredImageAlt}
                onChange={(e) => setFeaturedImageAlt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sectionLabel">Section badge</Label>
              <Input
                id="sectionLabel"
                value={sectionLabel}
                onChange={(e) => setSectionLabel(e.target.value)}
                placeholder="e.g. Pursuits (defaults to category)"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="imageCaption">Image caption / credit</Label>
            <Input
              id="imageCaption"
              value={imageCaption}
              onChange={(e) => setImageCaption(e.target.value)}
              placeholder="Image via Getty Images"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Byline</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Category</Label>
            <select
              className="w-full rounded-lg border px-3 py-2 text-sm"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              required
            >
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c._id} value={c._id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="author">Author name</Label>
            <Input id="author" value={author} onChange={(e) => setAuthor(e.target.value)} />
          </div>
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="authorRole">Author role</Label>
            <Input
              id="authorRole"
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              placeholder="Senior Political Correspondent"
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Story body</CardTitle>
        </CardHeader>
        <CardContent>
          <RichTextEditor value={content} onChange={setContent} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Placement & publishing</CardTitle>
          <CardDescription>
            Featured → homepage hero column. Breaking → top ticker. Trending → badges and
            discovery. Editor&apos;s pick → category sidebar. View count → Most Read column
            (published stories only). Latest column uses newest published stories regardless of
            flags.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-6">
            <Toggle label="Featured (hero column)" checked={featured} onChange={setFeatured} />
            <Toggle label="Trending" checked={trending} onChange={setTrending} />
            <Toggle label="Breaking" checked={breaking} onChange={setBreaking} />
            <Toggle label="Editor&apos;s pick" checked={editorsPick} onChange={setEditorsPick} />
          </div>
          <Separator />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="space-y-2">
              <Label>Status</Label>
              <select
                className="w-full rounded-lg border px-3 py-2 text-sm"
                value={status}
                onChange={(e) => setStatus(e.target.value as "draft" | "published")}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="publishedAt">Published at</Label>
              <Input
                id="publishedAt"
                type="datetime-local"
                value={publishedAt}
                onChange={(e) => setPublishedAt(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="views">View count</Label>
              <Input
                id="views"
                type="number"
                min={0}
                value={views}
                onChange={(e) => setViews(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>SEO & tags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tags">Tags (comma separated)</Label>
            <Input id="tags" value={tags} onChange={(e) => setTags(e.target.value)} />
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="seoTitle">SEO title</Label>
              <Input id="seoTitle" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seoDescription">SEO description</Label>
              <Textarea
                id="seoDescription"
                value={seoDescription}
                onChange={(e) => setSeoDescription(e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button type="submit" disabled={loading} size="lg">
        {loading ? "Saving..." : article ? "Update article" : "Publish story"}
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
      <Label>{label}</Label>
    </div>
  );
}
