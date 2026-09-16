"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { deleteCategory, saveCategory } from "@/lib/actions/categories";
import { slugify } from "@/lib/utils/slug";

type CategoryRow = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  isActive: boolean;
  displayOrder: number;
};

export function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await saveCategory({
      name,
      slug: slug || slugify(name),
      description: description || undefined,
      image: image || undefined,
      isActive: true,
      displayOrder: categories.length,
    });
    if (!res.success) toast.error(res.message);
    else {
      toast.success("Category created");
      window.location.reload();
    }
  }

  return (
    <div className="space-y-8">
      <p className="text-sm text-muted-foreground">
        Active categories appear in the site header and at{" "}
        <code className="text-xs">/category/[slug]</code>. Description is used for SEO on category
        pages.
      </p>

      <form onSubmit={onCreate} className="grid max-w-lg gap-3 rounded-lg border p-4">
        <h2 className="font-semibold">Add category</h2>
        <div className="space-y-1">
          <Label>Name</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>Slug</Label>
          <Input value={slug} onChange={(e) => setSlug(e.target.value)} placeholder="auto from name" />
        </div>
        <div className="space-y-1">
          <Label>Description (SEO)</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-1">
          <Label>Cover image URL (optional)</Label>
          <Input value={image} onChange={(e) => setImage(e.target.value)} placeholder="https://..." />
        </div>
        <Button type="submit">Create</Button>
      </form>

      <ul className="divide-y rounded-lg border">
        {categories.map((cat) => (
          <CategoryRowEditor key={cat._id} cat={cat} />
        ))}
      </ul>
    </div>
  );
}

function CategoryRowEditor({ cat }: { cat: CategoryRow }) {
  const [description, setDescription] = useState(cat.description ?? "");
  const [image, setImage] = useState(cat.image ?? "");
  const [saving, setSaving] = useState(false);

  async function onSaveDetails() {
    setSaving(true);
    const res = await saveCategory(
      {
        name: cat.name,
        slug: cat.slug,
        description: description || undefined,
        image: image || undefined,
        isActive: cat.isActive,
        displayOrder: cat.displayOrder,
      },
      cat._id,
    );
    setSaving(false);
    if (!res.success) toast.error(res.message);
    else toast.success("Category updated");
  }

  return (
    <li className="space-y-3 p-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="font-medium">{cat.name}</p>
          <p className="text-sm text-muted-foreground">/category/{cat.slug}</p>
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={cat.isActive}
            onCheckedChange={async (active) => {
              await saveCategory(
                {
                  name: cat.name,
                  slug: cat.slug,
                  description: description || undefined,
                  image: image || undefined,
                  isActive: active,
                  displayOrder: cat.displayOrder,
                },
                cat._id,
              );
              window.location.reload();
            }}
          />
          <Button
            variant="destructive"
            size="sm"
            onClick={async () => {
              if (!confirm("Delete category?")) return;
              const res = await deleteCategory(cat._id);
              if (!res.success) toast.error(res.message);
              else window.location.reload();
            }}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="grid max-w-2xl gap-3 md:grid-cols-2">
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs">Description</Label>
          <Textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
        </div>
        <div className="space-y-1 md:col-span-2">
          <Label className="text-xs">Cover image URL</Label>
          <Input value={image} onChange={(e) => setImage(e.target.value)} />
        </div>
        <Button type="button" size="sm" variant="secondary" disabled={saving} onClick={onSaveDetails}>
          {saving ? "Saving…" : "Save details"}
        </Button>
      </div>
    </li>
  );
}
