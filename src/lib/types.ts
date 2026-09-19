export type ArticleImageItem = {
  url: string;
  publicId?: string;
};

export type CategorySummary = {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
};

export type ArticleListItem = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  subtitle?: string;
  featuredImage?: string;
  featuredImageAlt?: string;
  author?: string;
  authorRole?: string;
  sectionLabel?: string;
  status: "draft" | "published";
  featured: boolean;
  breaking: boolean;
  trending: boolean;
  editorsPick: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category?: CategorySummary;
  tags?: string[];
  views?: number;
};

export type ArticleDetail = ArticleListItem & {
  content: string;
  featuredImagePublicId?: string;
  images?: ArticleImageItem[];
  imageCaption?: string;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
};

export type PaginatedResult<T> = {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
};
