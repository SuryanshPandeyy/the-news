dotenv.config({ path: ".env.local" });
dotenv.config({ path: ".env" });

/**
 *
 * Usage:
 *   npm run seed           # upsert by slug (safe re-run)
 *   npm run seed:reset     # wipe articles then seed
 *
 * Requires MONGODB_URI (and optional MONGODB_DB) in .env
 */
import dotenv from "dotenv";
import mongoose from "mongoose";
import { Article } from "../src/lib/models/Article";
import { Category } from "../src/lib/models/Category";
import { Settings } from "../src/lib/models/Settings";
import { Subscriber } from "../src/lib/models/Subscriber";
import {
  buildArticleBody,
  HEADLINE_TEMPLATES,
  SEED_AUTHORS,
  SEED_CATEGORIES,
  SEED_IMAGES,
} from "./seed-data";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/** Noon IST on a given offset day from today */
function publishedAtDaysAgo(daysAgo: number, hourIst = 12): Date {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - daysAgo);
  const yyyy = d.getUTCFullYear();
  const mm = String(d.getUTCMonth() + 1).padStart(2, "0");
  const dd = String(d.getUTCDate()).padStart(2, "0");
  const hh = String(hourIst).padStart(2, "0");
  return new Date(`${yyyy}-${mm}-${dd}T${hh}:00:00+05:30`);
}

async function connect() {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error("MONGODB_URI is required");
  const dbName = process.env.MONGODB_DB ?? "thenews";
  await mongoose.connect(uri, { dbName });
}

async function seedCategories() {
  for (const cat of SEED_CATEGORIES) {
    await Category.updateOne(
      { slug: cat.slug },
      {
        $set: {
          name: cat.name,
          description: cat.description,
          displayOrder: cat.displayOrder,
          isActive: true,
        },
      },
      { upsert: true },
    );
  }
  const cats = await Category.find().lean();
  return new Map(
    cats.map((c) => [c.slug, c._id] as [string, mongoose.Types.ObjectId]),
  );
}

async function seedSettings() {
  await Settings.findOneAndUpdate(
    { key: "main" },
    {
      siteName: "The News",
      siteDescription: "Independent journalism for a connected world.",
      defaultSeoTitle: "The News — Latest Headlines",
      defaultSeoDescription: "Breaking news, markets, politics, technology, and culture.",
      newsletterFromName: "The News",
      footerText: "© The News. All Rights Reserved.",
    },
    { upsert: true, setDefaultsOnInsert: true },
  );
}

type SeedArticle = {
  title: string;
  slug: string;
  categorySlug: string;
  excerpt: string;
  subtitle: string;
  content: string;
  featuredImage: string;
  featuredImageAlt: string;
  imageCaption: string;
  sectionLabel?: string;
  author: string;
  authorRole: string;
  tags: string[];
  featured: boolean;
  trending: boolean;
  breaking: boolean;
  editorsPick: boolean;
  views: number;
  publishedAt: Date;
};

function buildArticles(): SeedArticle[] {
  const articles: SeedArticle[] = [];
  let imageIndex = 0;
  let globalIndex = 0;

  for (const cat of SEED_CATEGORIES) {
    const headlines = HEADLINE_TEMPLATES[cat.slug] ?? [
      `Key Developments in ${cat.name} This Week`,
      `${cat.name} Leaders Face Pressure Over New Policy`,
    ];

    headlines.forEach((title, i) => {
      const author = SEED_AUTHORS[globalIndex % SEED_AUTHORS.length];
      const slug = slugify(title);
      const image = SEED_IMAGES[imageIndex % SEED_IMAGES.length];
      imageIndex += 1;

      const daysAgo = i === 0 && globalIndex < 6 ? 0 : randomInt(1, 28);
      const excerpt = `${title.split(" ").slice(0, 12).join(" ")}… Officials and analysts are watching closely as the story develops across ${cat.name.toLowerCase()} desks worldwide.`;
      const subtitle = `A closer look at how ${cat.name.toLowerCase()} leaders, markets, and communities are responding to the latest turn of events.`;

      articles.push({
        title,
        slug,
        categorySlug: cat.slug,
        excerpt,
        subtitle,
        content: buildArticleBody(title, cat.name),
        featuredImage: image,
        featuredImageAlt: title,
        imageCaption: `Image via Unsplash · ${cat.name}`,
        sectionLabel: i === 0 ? cat.name : undefined,
        author: author.name,
        authorRole: author.role,
        tags: [cat.name, cat.slug, "news", "analysis"].slice(0, 4),
        featured: globalIndex < 8,
        trending: globalIndex % 3 === 0,
        breaking: globalIndex < 4,
        editorsPick: globalIndex % 4 === 0,
        views: randomInt(1200, 78000),
        publishedAt: publishedAtDaysAgo(daysAgo, 9 + (globalIndex % 10)),
      });
      globalIndex += 1;
    });
  }

  // Extra market / politics depth
  const extras = [
    {
      title: "Elon Musk Also Threatened to Buy My Company. Here's How We Handled It",
      categorySlug: "technology",
      sectionLabel: "Pursuits",
      featured: true,
    },
    {
      title: "Central Banks Hold Rates Steady as Inflation Cools Gradually",
      categorySlug: "markets",
      featured: true,
    },
    {
      title: "India's Manufacturing Output Hits Multi-Year High on Export Demand",
      categorySlug: "business",
      featured: false,
    },
  ] as const;

  for (const extra of extras) {
    const author = SEED_AUTHORS[randomInt(0, SEED_AUTHORS.length - 1)];
    const image = SEED_IMAGES[imageIndex % SEED_IMAGES.length];
    imageIndex += 1;
    articles.push({
      title: extra.title,
      slug: slugify(extra.title),
      categorySlug: extra.categorySlug,
      excerpt: `${extra.title} — executives and investors weigh in on what it means for the industry.`,
      subtitle: "Insiders describe a fast-moving situation with implications far beyond a single headline.",
      content: buildArticleBody(extra.title, extra.categorySlug),
      featuredImage: image,
      featuredImageAlt: extra.title,
      imageCaption: "Image via Unsplash",
      sectionLabel: "sectionLabel" in extra ? extra.sectionLabel : undefined,
      author: author.name,
      authorRole: author.role,
      tags: ["exclusive", extra.categorySlug],
      featured: extra.featured,
      trending: true,
      breaking: false,
      editorsPick: true,
      views: randomInt(40000, 95000),
      publishedAt: publishedAtDaysAgo(0, 14),
    });
  }

  return articles;
}

async function seedArticles(categoryIds: Map<string, mongoose.Types.ObjectId>, reset: boolean) {
  if (reset) {
    await Article.deleteMany({});
    console.log("Cleared existing articles.");
  }

  const payloads = buildArticles();
  let created = 0;
  let updated = 0;

  for (const item of payloads) {
    const categoryId = categoryIds.get(item.categorySlug);
    if (!categoryId) continue;

    const doc = {
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      subtitle: item.subtitle,
      content: item.content,
      featuredImage: item.featuredImage,
      featuredImageAlt: item.featuredImageAlt,
      imageCaption: item.imageCaption,
      sectionLabel: item.sectionLabel,
      category: categoryId,
      author: item.author,
      authorRole: item.authorRole,
      status: "published" as const,
      featured: item.featured,
      trending: item.trending,
      breaking: item.breaking,
      editorsPick: item.editorsPick,
      views: item.views,
      publishedAt: item.publishedAt,
      tags: item.tags,
      seoTitle: item.title,
      seoDescription: item.excerpt.slice(0, 155),
    };

    const result = await Article.updateOne({ slug: item.slug }, { $set: doc }, { upsert: true });
    if (result.upsertedCount) created += 1;
    else if (result.modifiedCount) updated += 1;
  }

  console.log(`Articles: ${created} created, ${updated} updated (${payloads.length} total in seed).`);
}

async function seedSubscribers() {
  const emails = ["reader@example.com", "editorial@example.com", "markets@example.com"];
  for (const email of emails) {
    await Subscriber.updateOne({ email }, { $setOnInsert: { email, isActive: true } }, { upsert: true });
  }
}

async function main() {
  const reset = process.argv.includes("--reset");
  await connect();
  console.log("Connected to MongoDB.");

  await seedSettings();
  const categoryIds = await seedCategories();
  console.log(`Categories: ${categoryIds.size}`);

  await seedArticles(categoryIds, reset);
  await seedSubscribers();

  const count = await Article.countDocuments({ status: "published" });
  console.log(`Published articles in database: ${count}`);
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
