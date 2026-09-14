import mongoose, { Schema, type InferSchemaType, type Model } from "mongoose";

const articleSchema = new Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    excerpt: { type: String, trim: true },
    content: { type: String, required: true, default: "" },
    featuredImage: { type: String },
    featuredImagePublicId: { type: String },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    author: { type: String, trim: true, default: "Editorial Desk" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    featured: { type: Boolean, default: false },
    breaking: { type: Boolean, default: false },
    trending: { type: Boolean, default: false },
    publishedAt: { type: Date },
    seoTitle: { type: String, trim: true },
    seoDescription: { type: String, trim: true },
    seoKeywords: [{ type: String, trim: true }],
    tags: [{ type: String, trim: true }],
    views: { type: Number, default: 0 },
  },
  { timestamps: true },
);

articleSchema.index({ slug: 1 });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1, status: 1, publishedAt: -1 });
articleSchema.index({ featured: 1, status: 1, publishedAt: -1 });
articleSchema.index({ trending: 1, status: 1, publishedAt: -1 });
articleSchema.index({ breaking: 1, status: 1, publishedAt: -1 });
articleSchema.index({ title: "text", excerpt: "text", tags: "text" });

export type ArticleDocument = InferSchemaType<typeof articleSchema> & {
  _id: mongoose.Types.ObjectId;
};

export const Article: Model<ArticleDocument> =
  mongoose.models.Article ?? mongoose.model<ArticleDocument>("Article", articleSchema);
