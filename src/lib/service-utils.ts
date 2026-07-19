import { DEFAULT_PAGE_SIZE, MAX_PAGE_SIZE } from "@/lib/constants";
import type { PaginationMeta } from "@/types";

export function normalizePagination(page = 1, limit = DEFAULT_PAGE_SIZE) {
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(Math.max(1, limit), MAX_PAGE_SIZE);
  const skip = (safePage - 1) * safeLimit;
  return { page: safePage, limit: safeLimit, skip };
}

export function buildPaginationMeta(
  page: number,
  limit: number,
  total: number,
): PaginationMeta {
  const totalPages = Math.max(1, Math.ceil(total / limit));
  return {
    page,
    limit,
    total,
    totalPages,
    hasNext: page < totalPages,
    hasPrev: page > 1,
  };
}

export class ServiceError extends Error {
  readonly statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.name = "ServiceError";
    this.statusCode = statusCode;
  }
}

export const postAuthorSelect = {
  id: true,
  name: true,
  image: true,
  verified: true,
  profile: { select: { bio: true } },
} as const;

export const postCardSelect = {
  id: true,
  title: true,
  slug: true,
  subtitle: true,
  coverImage: true,
  publishedAt: true,
  readingTime: true,
  viewsCount: true,
  likesCount: true,
  commentsCount: true,
  featured: true,
  author: { select: postAuthorSelect },
  category: { select: { id: true, name: true, slug: true, color: true } },
} as const;

export const commentAuthorSelect = {
  id: true,
  name: true,
  image: true,
  verified: true,
} as const;
