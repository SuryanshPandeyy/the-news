import { connectDB } from "@/lib/db/connect";
import { Banner, type BannerPosition } from "@/lib/models/Banner";

export type BannerItem = {
  _id: string;
  title: string;
  image: string;
  link?: string;
  position: BannerPosition;
};

export async function getActiveBanners(position: BannerPosition): Promise<BannerItem[]> {
  await connectDB();
  const now = new Date();
  const docs = await Banner.find({
    position,
    isActive: true,
    $and: [
      { $or: [{ startDate: { $exists: false } }, { startDate: null }, { startDate: { $lte: now } }] },
      { $or: [{ endDate: { $exists: false } }, { endDate: null }, { endDate: { $gte: now } }] },
    ],
  })
    .sort({ displayOrder: 1 })
    .lean();

  return docs.map((d) => ({
    _id: String(d._id),
    title: d.title,
    image: d.image,
    link: d.link ?? undefined,
    position: d.position as BannerPosition,
  }));
}
