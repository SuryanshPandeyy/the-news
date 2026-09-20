import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const settingsSchema = new Schema(
  {
    key: { type: String, default: "main", unique: true },
    siteName: { type: String, default: "Maukhabar.in" },
    siteDescription: {
      type: String,
      default: "Trusted journalism for the modern reader.",
    },
    logo: { type: String, default: "/logo.png" },
    favicon: { type: String },
    defaultAuthor: { type: String, default: "Editorial Desk" },
    defaultLocale: { type: String, enum: ["hi", "en"], default: "hi" },
    contactEmail: { type: String },
    socialFacebook: { type: String },
    socialTwitter: { type: String },
    socialInstagram: { type: String },
    socialLinkedin: { type: String },
    socialYoutube: { type: String },
    socialWhatsapp: { type: String },
    footerText: { type: String },
    defaultSeoTitle: { type: String },
    defaultSeoDescription: { type: String },
    defaultSeoImage: { type: String },
    newsletterFromName: { type: String, default: "The News" },
  },
  { timestamps: true },
);

export type SettingsDocument = InferSchemaType<typeof settingsSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Settings: Model<SettingsDocument> =
  mongoose.models.Settings ??
  mongoose.model<SettingsDocument>("Settings", settingsSchema);

export async function getSettings(): Promise<SettingsDocument> {
  const { connectDB } = await import("@/lib/db/connect");
  await connectDB();
  const doc = await Settings.findOneAndUpdate(
    { key: "main" },
    {},
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return doc as SettingsDocument;
}
