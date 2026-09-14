/**
 * Run with: npx tsx scripts/seed-categories.ts
 * Requires MONGODB_URI in environment.
 */
import mongoose from "mongoose";
import { Category } from "../src/lib/models/Category";

const defaults = [
  { name: "Politics", slug: "politics", displayOrder: 1 },
  { name: "Business", slug: "business", displayOrder: 2 },
  { name: "Technology", slug: "technology", displayOrder: 3 },
  { name: "Sports", slug: "sports", displayOrder: 4 },
  { name: "Entertainment", slug: "entertainment", displayOrder: 5 },
  { name: "World", slug: "world", displayOrder: 6 },
  { name: "Health", slug: "health", displayOrder: 7 },
  { name: "Science", slug: "science", displayOrder: 8 },
];

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI required");
  await mongoose.connect(uri);
  for (const cat of defaults) {
    await Category.updateOne({ slug: cat.slug }, { $setOnInsert: cat }, { upsert: true });
  }
  console.log("Seeded categories.");
  await mongoose.disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
