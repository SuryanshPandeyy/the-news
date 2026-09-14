import { MediaGrid } from "@/components/admin/media-grid";
import { connectDB } from "@/lib/db/connect";
import { Media } from "@/lib/models/Media";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await connectDB();
  const items = await Media.find().sort({ createdAt: -1 }).limit(60).lean();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Media library</h1>
      <MediaGrid
        items={items.map((m) => ({
          _id: String(m._id),
          url: m.url,
          publicId: m.publicId,
          createdAt: m.createdAt?.toISOString() ?? "",
        }))}
      />
    </div>
  );
}
