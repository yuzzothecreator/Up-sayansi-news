import type { Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { buildPaginationMeta, normalizePagination, postCardSelect } from "@/lib/service-utils";
import type { PaginatedResult, SearchFilters } from "@/types";

export type GlobalSearchResult = {
  posts: PaginatedResult<{
    id: string;
    title: string;
    slug: string;
    subtitle: string | null;
    author: { id: string; name: string; image: string | null };
    category: { name: string; slug: string } | null;
  }>;
  authors: Array<{ id: string; name: string; image: string | null; verified: boolean }>;
  categories: Array<{ id: string; name: string; slug: string; color: string | null }>;
  tags: Array<{ id: string; name: string; slug: string }>;
};

export async function globalSearch(
  filters: SearchFilters,
): Promise<GlobalSearchResult> {
  const query = filters.query?.trim();
  const { page, limit, skip } = normalizePagination(filters.page, filters.limit);

  const postWhere: Prisma.PostWhereInput = {
    status: filters.status ?? "PUBLISHED",
    ...(filters.featured !== undefined ? { featured: filters.featured } : {}),
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.tag ? { tags: { some: { tag: { slug: filters.tag } } } } : {}),
    ...(filters.author ? { authorId: filters.author } : {}),
    ...(query
      ? {
          OR: [
            { title: { contains: query } },
            { subtitle: { contains: query } },
            { contentHtml: { contains: query } },
            { author: { name: { contains: query } } },
            { category: { name: { contains: query } } },
            { tags: { some: { tag: { name: { contains: query } } } } },
          ],
        }
      : {}),
  };

  const orderBy: Prisma.PostOrderByWithRelationInput[] =
    filters.sort === "popular"
      ? [{ likesCount: "desc" }, { viewsCount: "desc" }]
      : filters.sort === "trending"
        ? [{ viewsCount: "desc" }, { publishedAt: "desc" }]
        : [{ publishedAt: "desc" }];

  const [posts, postsTotal, authors, categories, tags] = await Promise.all([
    prisma.post.findMany({
      where: postWhere,
      select: {
        id: true,
        title: true,
        slug: true,
        subtitle: true,
        author: { select: { id: true, name: true, image: true } },
        category: { select: { name: true, slug: true } },
      },
      orderBy,
      skip,
      take: limit,
    }),
    prisma.post.count({ where: postWhere }),
    query
      ? prisma.user.findMany({
          where: {
            OR: [
              { name: { contains: query } },
              { profile: { bio: { contains: query } } },
            ],
            role: { in: ["AUTHOR", "EDITOR", "ADMINISTRATOR"] },
          },
          select: { id: true, name: true, image: true, verified: true },
          take: 5,
        })
      : Promise.resolve([]),
    query
      ? prisma.category.findMany({
          where: { name: { contains: query } },
          select: { id: true, name: true, slug: true, color: true },
          take: 5,
        })
      : Promise.resolve([]),
    query
      ? prisma.tag.findMany({
          where: { name: { contains: query } },
          select: { id: true, name: true, slug: true },
          take: 5,
        })
      : Promise.resolve([]),
  ]);

  return {
    posts: {
      data: posts,
      meta: buildPaginationMeta(page, limit, postsTotal),
    },
    authors,
    categories,
    tags,
  };
}

export async function searchPostsOnly(query: string, page = 1, limit = 12) {
  const { page: p, limit: l, skip } = normalizePagination(page, limit);

  const where: Prisma.PostWhereInput = {
    status: "PUBLISHED",
    OR: [
      { title: { contains: query } },
      { subtitle: { contains: query } },
      { contentHtml: { contains: query } },
    ],
  };

  const [data, total] = await Promise.all([
    prisma.post.findMany({
      where,
      select: postCardSelect,
      orderBy: { publishedAt: "desc" },
      skip,
      take: l,
    }),
    prisma.post.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(p, l, total) };
}
