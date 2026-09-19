/**
 * Regenerates excerpt from article HTML body for all stories.
 * Usage: npm run db:backfill-excerpts
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import { excerptFromContent } from "../src/lib/articles/excerpt";
import { Article } from "../src/lib/models/Article";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  const dbName = process.env.MONGODB_DB ?? "thenews";
  await mongoose.connect(uri, { dbName });

  const docs = await Article.find().select("content").lean();
  let updated = 0;
  for (const doc of docs) {
    const excerpt = excerptFromContent(doc.content ?? "");
    await Article.updateOne({ _id: doc._id }, { $set: { excerpt } });
    updated += 1;
  }
  console.log(`Updated excerpt on ${updated} articles.`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
