import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const articleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, trim: true },
    /** Large dek under the headline on the article page */
    subtitle: { type: String, trim: true },
    content: { type: String, required: true, default: "" },
    featuredImage: { type: String },
    featuredImageAlt: { type: String, trim: true },
    featuredImagePublicId: { type: String },
    /** Gallery images; first item mirrors featuredImage on save */
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String },
      },
    ],
    /** Credit line under the hero image */
    imageCaption: { type: String, trim: true },
    /** Optional badge on homepage hero (e.g. Pursuits); falls back to category name */
    sectionLabel: { type: String, trim: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    author: { type: String, trim: true, default: "Editorial Desk" },
    authorRole: { type: String, trim: true },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    featured: { type: Boolean, default: false },
    breaking: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    editorsPick: { type: Boolean, default: false },
    publishedAt: { type: Date },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    seoKeywords: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);


articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1, status: 1, publishedAt: -1 });
articleSchema.index({ featured: 1, status: 1, publishedAt: -1 });
articleSchema.index({ trending: 1, status: 1, publishedAt: -1 });
articleSchema.index({ breaking: 1, status: 1, publishedAt: -1 });
articleSchema.index({ editorsPick: 1, status: 1, publishedAt: -1 });
articleSchema.index({ title: "text", excerpt: "text", tags: "text" });

export type ArticleDocument = InferSchemaType<typeof articleSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Article: Model<ArticleDocument> =
  mongoose.models.Article ?? mongoose.model<ArticleDocument>("Article", articleSchema);
