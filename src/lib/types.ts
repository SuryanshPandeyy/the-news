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
  featuredImage?: string;
  author?: string;
  status: "draft" | "published";
  featured: boolean;
  breaking: boolean;
  trending: boolean;
  publishedAt?: string;
  createdAt: string;
  updatedAt: string;
  category: CategorySummary;
  tags?: string[];
  views?: number;
};

export type ArticleDetail = ArticleListItem & {
  content: string;
  featuredImagePublicId?: string;
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
