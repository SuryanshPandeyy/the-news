import { BannersManager } from "@/components/admin/banners-manager";
import { connectDB } from "@/lib/db/connect";
import { Banner } from "@/lib/models/Banner";

export const dynamic = "force-dynamic";

export default async function AdminBannersPage() {
  await connectDB();
  const banners = await Banner.find().sort({ displayOrder: 1 }).lean();
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Banners</h1>
      <BannersManager
        banners={banners.map((b) => ({
          _id: String(b._id),
          title: b.title,
          image: b.image,
          link: b.link ?? undefined,
          position: b.position,
          isActive: Boolean(b.isActive),
        }))}
      />
    </div>
  );
}
