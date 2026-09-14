import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const mediaSchema = new Schema(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: String, trim: true },
    width: { type: Number },
    height: { type: Number },
    format: { type: String },
    bytes: { type: Number },
  },
  { timestamps: true },
);

mediaSchema.index({ publicId: 1 });
mediaSchema.index({ createdAt: -1 });

export type MediaDocument = InferSchemaType<typeof mediaSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Media: Model<MediaDocument> =
  mongoose.models.Media ?? mongoose.model<MediaDocument>("Media", mediaSchema);
