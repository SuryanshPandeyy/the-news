"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { deleteCategory, saveCategory } from "@/lib/actions/categories";
import { slugify } from "@/lib/utils/slug";

type CategoryRow = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  isActive: boolean;
  displayOrder: number;
};

export function CategoriesManager({ categories }: { categories: CategoryRow[] }) {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await saveCategory({
      name,
      slug: slug || slugify(name),
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
        <Button type="submit">Create</Button>
      </form>

      <ul className="divide-y rounded-lg border">
        {categories.map((cat) => (
          <li key={cat._id} className="flex items-center justify-between gap-4 p-4">
            <div>
              <p className="font-medium">{cat.name}</p>
              <p className="text-sm text-muted-foreground">/{cat.slug}</p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={cat.isActive}
                onCheckedChange={async (active) => {
                  await saveCategory({ ...cat, isActive: active }, cat._id);
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
          </li>
        ))}
      </ul>
    </div>
  );
}
