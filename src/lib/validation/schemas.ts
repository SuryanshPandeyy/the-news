import { z } from "zod";

const articleImageSchema = z.object({
  url: z.string().min(1),
  publicId: z.string().optional(),
});

export const articleSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  images: z.array(articleImageSchema).optional(),
  featuredImage: z.string().optional(),
  featuredImagePublicId: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  author: z.string().optional(),
  status: z.enum(["draft", "published"]).optional(),
  featured: z.boolean().optional(),
  breaking: z.boolean().optional(),
  trending: z.boolean().optional(),
  editorsPick: z.boolean().optional(),
  views: z.number().int().min(0).optional(),
  publishedAt: z.string().optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().optional(),
  image: z.string().optional(),
  isActive: z.boolean().optional(),
  displayOrder: z.number().optional(),
});

export const bannerSchema = z.object({
  title: z.string().min(2),
  image: z.string().min(1),
  imagePublicId: z.string().optional(),
  link: z.string().optional(),
  position: z.enum([
    "home-top",
    "home-middle",
    "home-bottom",
    "article",
    "sidebar",
  ]),
  isActive: z.boolean().optional(),
  startDate: z.string().optional().nullable(),
  endDate: z.string().optional().nullable(),
  displayOrder: z.number().optional(),
});

export const subscriberSchema = z.object({
  email: z.string().email(),
});

export const settingsSchema = z.object({
  siteName: z.string().min(1),
  siteDescription: z.string().optional(),
  logo: z.string().optional(),
  favicon: z.string().optional(),
  defaultAuthor: z.string().optional(),
  defaultLocale: z.enum(["hi", "en"]).optional(),
  contactEmail: z.string().email().optional().or(z.literal("")),
  socialFacebook: z.string().optional(),
  socialTwitter: z.string().optional(),
  socialInstagram: z.string().optional(),
  socialLinkedin: z.string().optional(),
  socialYoutube: z.string().optional(),
  socialWhatsapp: z.string().optional(),
  footerText: z.string().optional(),
  defaultSeoTitle: z.string().optional(),
  defaultSeoDescription: z.string().optional(),
  defaultSeoImage: z.string().optional(),
  newsletterFromName: z.string().optional(),
});
