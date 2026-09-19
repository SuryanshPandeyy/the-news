/**
 * Removes demo/seed content from MongoDB (articles + newsletter subscribers).
 * Keeps categories, settings, and admin-created structure.
 *
 * Usage: npm run db:clear-seed
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Article } from "../src/lib/models/Article";
import { Subscriber } from "../src/lib/models/Subscriber";

dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  const dbName = process.env.MONGODB_DB ?? "thenews";
  await mongoose.connect(uri, { dbName });

  const [articles, subscribers] = await Promise.all([
    Article.deleteMany({}),
    Subscriber.deleteMany({}),
  ]);

  console.log(`Deleted ${articles.deletedCount} articles.`);
  console.log(`Deleted ${subscribers.deletedCount} subscribers.`);

  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
