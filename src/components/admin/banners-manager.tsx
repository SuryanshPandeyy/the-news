"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { deleteBanner, saveBanner } from "@/lib/actions/banners";
import type { BannerPosition } from "@/lib/models/Banner";

type BannerRow = {
  _id: string;
  title: string;
  image: string;
  link?: string;
  position: BannerPosition;
  isActive: boolean;
};

export function BannersManager({ banners }: { banners: BannerRow[] }) {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [position, setPosition] = useState<BannerPosition>("home-middle");

  async function upload(file: File) {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error);
      return;
    }
    setImage(data.url);
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    const res = await saveBanner({ title, image, position, isActive: true });
    if (!res.success) toast.error(res.message);
    else window.location.reload();
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onCreate} className="grid max-w-lg gap-3 rounded-lg border p-4">
        <h2 className="font-semibold">Add banner</h2>
        <div className="space-y-1">
          <Label>Title</Label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        <div className="space-y-1">
          <Label>Position</Label>
          <select
            className="w-full rounded-lg border px-2 py-2 text-sm"
            value={position}
            onChange={(e) => setPosition(e.target.value as BannerPosition)}
          >
            <option value="home-top">Home top</option>
            <option value="home-middle">Home middle</option>
            <option value="home-bottom">Home bottom</option>
            <option value="article">Article</option>
            <option value="sidebar">Sidebar</option>
          </select>
        </div>
        <Input type="file" accept="image/*" onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void upload(f);
        }} />
        {image && <img src={image} alt="" className="max-h-32 rounded" />}
        <Button type="submit" disabled={!image}>Save banner</Button>
      </form>

      <ul className="divide-y rounded-lg border">
        {banners.map((b) => (
          <li key={b._id} className="flex items-center justify-between gap-4 p-4">
            <div className="flex items-center gap-3">
              <img src={b.image} alt="" className="h-12 w-24 rounded object-cover" />
              <div>
                <p className="font-medium">{b.title}</p>
                <p className="text-xs text-muted-foreground">{b.position}</p>
              </div>
            </div>
            <Button
              variant="destructive"
              size="sm"
              onClick={async () => {
                if (!confirm("Delete banner?")) return;
                await deleteBanner(b._id);
                window.location.reload();
              }}
            >
              Delete
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
