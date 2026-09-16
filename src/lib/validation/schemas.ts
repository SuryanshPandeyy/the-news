import { z } from "zod";

export const articleSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  excerpt: z.string().optional(),
  subtitle: z.string().optional(),
  content: z.string().min(1, "Content is required"),
  featuredImage: z.string().optional(),
  featuredImageAlt: z.string().optional(),
  featuredImagePublicId: z.string().optional(),
  imageCaption: z.string().optional(),
  sectionLabel: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  author: z.string().optional(),
  authorRole: z.string().optional(),
  status: z.enum(["draft", "published"]),
  featured: z.boolean().optional(),
  breaking: z.boolean().optional(),
  trending: z.boolean().optional(),
  editorsPick: z.boolean().optional(),
  views: z.number().int().min(0).optional(),
  publishedAt: z.string().optional().nullable(),
  seoTitle: z.string().optional(),
  seoDescription: z.string().optional(),
  seoKeywords: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
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
