import type { PostStatus, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { calculateReadingTime } from "@/lib/reading-time";
import { generateUniqueSlug, slugify } from "@/lib/slug";
import { sanitizeHtml, stripHtml } from "@/lib/sanitize";
import type {
  CreatePostInput,
  PostQueryInput,
  PublishPostInput,
  UpdatePostInput,
} from "@/lib/validators/post";
import {
  buildPaginationMeta,
  normalizePagination,
  postAuthorSelect,
  postCardSelect,
  ServiceError,
} from "@/lib/service-utils";
import type { PaginatedResult, PostWithRelations, TipTapContent } from "@/types";

function tipTapToHtml(content: TipTapContent): string {
  const parts: string[] = [];

  function walk(node: unknown) {
    if (!node || typeof node !== "object") return;
    const record = node as Record<string, unknown>;

    if (typeof record.text === "string") {
      parts.push(record.text);
    }

    if (Array.isArray(record.content)) {
      for (const child of record.content) {
        walk(child);
      }
    }
  }

  walk(content);
  const text = parts.join(" ");
  return `<p>${sanitizeHtml(text.replace(/\n/g, "<br/>"))}</p>`;
}

function buildPostWhere(filters: PostQueryInput, viewerId?: string): Prisma.PostWhereInput {
  const where: Prisma.PostWhereInput = {};

  if (filters.status) {
    where.status = filters.status;
  } else if (!viewerId) {
    where.status = "PUBLISHED";
  }

  if (filters.category) {
    where.category = { slug: filters.category };
  }

  if (filters.tag) {
    where.tags = { some: { tag: { slug: filters.tag } } };
  }

  if (filters.author) {
    where.author = { id: filters.author };
  }

  if (filters.featured !== undefined) {
    where.featured = filters.featured;
  }

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q, mode: "insensitive" } },
      { subtitle: { contains: filters.q, mode: "insensitive" } },
      { contentHtml: { contains: filters.q, mode: "insensitive" } },
    ];
  }

  return where;
}

function buildPostOrderBy(sort: PostQueryInput["sort"]): Prisma.PostOrderByWithRelationInput[] {
  switch (sort) {
    case "popular":
      return [{ likesCount: "desc" }, { viewsCount: "desc" }];
    case "trending":
      return [{ viewsCount: "desc" }, { likesCount: "desc" }, { publishedAt: "desc" }];
    default:
      return [{ pinned: "desc" }, { publishedAt: "desc" }];
  }
}

const postInclude = {
  author: { select: postAuthorSelect },
  category: true,
  tags: { include: { tag: true } },
  _count: { select: { comments: true, likes: true, views: true } },
} satisfies Prisma.PostInclude;

export async function createPost(input: CreatePostInput, authorId: string) {
  const slug =
    input.slug ??
    (await generateUniqueSlug(input.title, async (candidate) => {
      const existing = await prisma.post.findUnique({ where: { slug: candidate } });
      return Boolean(existing);
    }));

  const reading = calculateReadingTime(input.content);
  const contentHtml = tipTapToHtml(input.content);

  const status = input.status ?? "DRAFT";
  const publishedAt = status === "PUBLISHED" ? new Date() : null;

  return prisma.post.create({
    data: {
      title: input.title,
      slug,
      subtitle: input.subtitle,
      content: input.content as Prisma.InputJsonValue,
      contentHtml,
      coverImage: input.coverImage,
      status,
      publishedAt,
      scheduledAt: input.scheduledAt,
      readingTime: reading.minutes,
      featured: input.featured ?? false,
      pinned: input.pinned ?? false,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      authorId,
      categoryId: input.categoryId,
      tags: input.tagIds?.length
        ? {
            create: input.tagIds.map((tagId) => ({ tagId })),
          }
        : undefined,
    },
    include: postInclude,
  });
}

export async function updatePost(input: UpdatePostInput, userId: string, canEditAny: boolean) {
  const existing = await prisma.post.findUnique({ where: { id: input.id } });
  if (!existing) throw new ServiceError("Post not found", 404);
  if (!canEditAny && existing.authorId !== userId) {
    throw new ServiceError("Forbidden", 403);
  }

  const content = input.content ?? (existing.content as TipTapContent);
  const reading = input.content ? calculateReadingTime(content) : undefined;

  let slug = existing.slug;
  if (input.title && !input.slug) {
    slug = await generateUniqueSlug(input.title, async (candidate) => {
      const found = await prisma.post.findFirst({
        where: { slug: candidate, NOT: { id: input.id } },
      });
      return Boolean(found);
    });
  } else if (input.slug) {
    slug = input.slug;
  }

  if (input.tagIds) {
    await prisma.postTag.deleteMany({ where: { postId: input.id } });
  }

  return prisma.post.update({
    where: { id: input.id },
    data: {
      title: input.title,
      slug,
      subtitle: input.subtitle,
      content: input.content ? (input.content as Prisma.InputJsonValue) : undefined,
      contentHtml: input.content ? tipTapToHtml(content) : undefined,
      coverImage: input.coverImage,
      status: input.status,
      scheduledAt: input.scheduledAt,
      readingTime: reading?.minutes,
      featured: input.featured,
      pinned: input.pinned,
      seoTitle: input.seoTitle,
      seoDescription: input.seoDescription,
      categoryId: input.categoryId,
      tags: input.tagIds
        ? { create: input.tagIds.map((tagId) => ({ tagId })) }
        : undefined,
    },
    include: postInclude,
  });
}

export async function deletePost(id: string, userId: string, canDeleteAny: boolean) {
  const existing = await prisma.post.findUnique({ where: { id } });
  if (!existing) throw new ServiceError("Post not found", 404);
  if (!canDeleteAny && existing.authorId !== userId) {
    throw new ServiceError("Forbidden", 403);
  }
  await prisma.post.delete({ where: { id } });
}

export async function getPostBySlug(
  slug: string,
  options?: { includeDraft?: boolean; authorId?: string },
): Promise<PostWithRelations | null> {
  const post = await prisma.post.findUnique({
    where: { slug },
    include: postInclude,
  });

  if (!post) return null;
  if (post.status !== "PUBLISHED" && !options?.includeDraft) {
    if (!options?.authorId || post.authorId !== options.authorId) {
      return null;
    }
  }

  return post as PostWithRelations;
}

export async function listPosts(
  filters: PostQueryInput,
  viewerId?: string,
): Promise<PaginatedResult<PostWithRelations>> {
  const { page, limit, skip } = normalizePagination(filters.page, filters.limit);
  const where = buildPostWhere(filters, viewerId);

  const [data, total] = await Promise.all([
    prisma.post.findMany({
      where,
      include: postInclude,
      orderBy: buildPostOrderBy(filters.sort),
      skip,
      take: limit,
    }),
    prisma.post.count({ where }),
  ]);

  return {
    data: data as PostWithRelations[],
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function publishPost(input: PublishPostInput, userId: string) {
  const post = await prisma.post.findUnique({ where: { id: input.id } });
  if (!post) throw new ServiceError("Post not found", 404);

  const publishedAt =
    input.status === "PUBLISHED"
      ? new Date()
      : input.status === "SCHEDULED"
        ? null
        : post.publishedAt;

  return prisma.post.update({
    where: { id: input.id },
    data: {
      status: input.status,
      publishedAt,
      scheduledAt: input.status === "SCHEDULED" ? input.scheduledAt : null,
    },
    include: postInclude,
  });
}

export async function schedulePost(id: string, scheduledAt: Date) {
  return prisma.post.update({
    where: { id },
    data: { status: "SCHEDULED", scheduledAt, publishedAt: null },
    include: postInclude,
  });
}

export async function featurePost(id: string, featured: boolean) {
  return prisma.post.update({
    where: { id },
    data: { featured },
    include: postInclude,
  });
}

export async function pinPost(id: string, pinned: boolean) {
  return prisma.post.update({
    where: { id },
    data: { pinned },
    include: postInclude,
  });
}

export async function getRelatedPosts(postId: string, limit = 4) {
  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { tags: true, category: true },
  });
  if (!post) return [];

  return prisma.post.findMany({
    where: {
      id: { not: postId },
      status: "PUBLISHED",
      OR: [
        post.categoryId ? { categoryId: post.categoryId } : undefined,
        post.tags.length
          ? { tags: { some: { tagId: { in: post.tags.map((t) => t.tagId) } } } }
          : undefined,
      ].filter(Boolean) as Prisma.PostWhereInput[],
    },
    select: postCardSelect,
    orderBy: [{ viewsCount: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });
}

export async function getAdjacentPosts(slug: string) {
  const current = await prisma.post.findUnique({ where: { slug } });
  if (!current?.publishedAt) return { previous: null, next: null };

  const [previous, next] = await Promise.all([
    prisma.post.findFirst({
      where: {
        status: "PUBLISHED",
        publishedAt: { lt: current.publishedAt },
      },
      select: postCardSelect,
      orderBy: { publishedAt: "desc" },
    }),
    prisma.post.findFirst({
      where: {
        status: "PUBLISHED",
        publishedAt: { gt: current.publishedAt },
      },
      select: postCardSelect,
      orderBy: { publishedAt: "asc" },
    }),
  ]);

  return { previous, next };
}

export async function searchPosts(query: string, page = 1, limit = 12) {
  return listPosts({ q: query, page, limit, sort: "latest" });
}

export async function getTrendingPosts(limit = 10) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  return prisma.post.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { gte: weekAgo },
    },
    select: postCardSelect,
    orderBy: [{ viewsCount: "desc" }, { likesCount: "desc" }],
    take: limit,
  });
}

export async function getFeaturedPosts(limit = 6) {
  return prisma.post.findMany({
    where: { status: "PUBLISHED", featured: true },
    select: postCardSelect,
    orderBy: [{ pinned: "desc" }, { publishedAt: "desc" }],
    take: limit,
  });
}

export async function getPopularPosts(limit = 10) {
  return prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: postCardSelect,
    orderBy: [{ likesCount: "desc" }, { viewsCount: "desc" }],
    take: limit,
  });
}

export async function archivePost(id: string) {
  return prisma.post.update({
    where: { id },
    data: { status: "ARCHIVED" },
    include: postInclude,
  });
}

export { slugify, stripHtml };
