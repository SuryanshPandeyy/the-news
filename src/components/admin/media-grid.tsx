"use client";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export function MediaGrid({
  items,
}: {
  items: { _id: string; url: string; publicId: string; createdAt: string }[];
}) {
  if (!items.length) {
    return <p className="text-muted-foreground">No media uploaded yet.</p>;
  }

  return (
    <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {items.map((item) => (
        <div key={item._id} className="overflow-hidden rounded-lg border">
          <img src={item.url} alt="" className="aspect-video w-full object-cover" />
          <div className="p-2">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={async () => {
                await navigator.clipboard.writeText(item.url);
                toast.success("URL copied");
              }}
            >
              Copy URL
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
