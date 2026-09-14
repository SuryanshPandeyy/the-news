import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const bannerPositions = [
  "home-top",
  "home-middle",
  "home-bottom",
  "article",
  "sidebar",
] as const;

const bannerSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    imagePublicId: { type: String },
    link: { type: String, trim: true },
    position: {
      type: String,
      enum: bannerPositions,
      required: true,
    },
    isActive: { type: Boolean, default: true },
    startDate: { type: Date },
    endDate: { type: Date },
    displayOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

bannerSchema.index({ position: 1, isActive: 1, displayOrder: 1 });

export type BannerPosition = (typeof bannerPositions)[number];
export type BannerDocument = InferSchemaType<typeof bannerSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Banner: Model<BannerDocument> =
  mongoose.models.Banner ?? mongoose.model<BannerDocument>("Banner", bannerSchema);
