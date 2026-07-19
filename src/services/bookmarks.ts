import prisma from "@/lib/prisma";
import type {
  CreateBookmarkCollectionInput,
  UpdateBookmarkCollectionInput,
} from "@/lib/validators/profile";
import {
  buildPaginationMeta,
  normalizePagination,
  postCardSelect,
  ServiceError,
} from "@/lib/service-utils";
import type { BookmarkCollectionWithItems, BookmarkWithPost, PaginatedResult } from "@/types";

export async function bookmarkPost(userId: string, postId: string) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.status !== "PUBLISHED") {
    throw new ServiceError("Post not found", 404);
  }

  return prisma.bookmark.upsert({
    where: { userId_postId: { userId, postId } },
    create: { userId, postId },
    update: {},
    include: { post: { select: postCardSelect } },
  });
}

export async function removeBookmark(userId: string, postId: string) {
  await prisma.bookmark.deleteMany({ where: { userId, postId } });
}

export async function getBookmarks(
  userId: string,
  page = 1,
  limit = 20,
): Promise<PaginatedResult<BookmarkWithPost>> {
  const { skip, page: p, limit: l } = normalizePagination(page, limit);
  const where = { userId };

  const [data, total] = await Promise.all([
    prisma.bookmark.findMany({
      where,
      include: { post: { select: postCardSelect } },
      orderBy: { createdAt: "desc" },
      skip,
      take: l,
    }),
    prisma.bookmark.count({ where }),
  ]);

  return { data: data as BookmarkWithPost[], meta: buildPaginationMeta(p, l, total) };
}

export async function isBookmarked(userId: string, postId: string) {
  const bookmark = await prisma.bookmark.findUnique({
    where: { userId_postId: { userId, postId } },
  });
  return Boolean(bookmark);
}

export async function createCollection(userId: string, input: CreateBookmarkCollectionInput) {
  return prisma.bookmarkCollection.create({
    data: {
      userId,
      name: input.name,
      description: input.description,
      isPublic: input.isPublic ?? false,
    },
  });
}

export async function updateCollection(
  userId: string,
  input: UpdateBookmarkCollectionInput,
) {
  const collection = await prisma.bookmarkCollection.findUnique({
    where: { id: input.id },
  });
  if (!collection || collection.userId !== userId) {
    throw new ServiceError("Collection not found", 404);
  }

  return prisma.bookmarkCollection.update({
    where: { id: input.id },
    data: {
      name: input.name,
      description: input.description,
      isPublic: input.isPublic,
    },
  });
}

export async function deleteCollection(userId: string, collectionId: string) {
  const collection = await prisma.bookmarkCollection.findUnique({
    where: { id: collectionId },
  });
  if (!collection || collection.userId !== userId) {
    throw new ServiceError("Collection not found", 404);
  }
  await prisma.bookmarkCollection.delete({ where: { id: collectionId } });
}

export async function addToCollection(
  userId: string,
  collectionId: string,
  postId: string,
) {
  const collection = await prisma.bookmarkCollection.findUnique({
    where: { id: collectionId },
  });
  if (!collection || collection.userId !== userId) {
    throw new ServiceError("Collection not found", 404);
  }

  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post) throw new ServiceError("Post not found", 404);

  return prisma.bookmarkCollectionItem.upsert({
    where: { collectionId_postId: { collectionId, postId } },
    create: { collectionId, postId },
    update: {},
  });
}

export async function removeFromCollection(
  userId: string,
  collectionId: string,
  postId: string,
) {
  const collection = await prisma.bookmarkCollection.findUnique({
    where: { id: collectionId },
  });
  if (!collection || collection.userId !== userId) {
    throw new ServiceError("Collection not found", 404);
  }

  await prisma.bookmarkCollectionItem.deleteMany({
    where: { collectionId, postId },
  });
}

export async function getCollections(
  userId: string,
  page = 1,
  limit = 20,
): Promise<PaginatedResult<BookmarkCollectionWithItems>> {
  const { skip, page: p, limit: l } = normalizePagination(page, limit);
  const where = { userId };

  const [data, total] = await Promise.all([
    prisma.bookmarkCollection.findMany({
      where,
      include: {
        items: { include: { post: { select: postCardSelect } }, take: 5 },
        _count: { select: { items: true } },
      },
      orderBy: { updatedAt: "desc" },
      skip,
      take: l,
    }),
    prisma.bookmarkCollection.count({ where }),
  ]);

  return {
    data: data as BookmarkCollectionWithItems[],
    meta: buildPaginationMeta(p, l, total),
  };
}

export async function getReadingList(userId: string, page = 1, limit = 20) {
  return getBookmarks(userId, page, limit);
}

export async function getCollectionById(collectionId: string, viewerId?: string) {
  const collection = await prisma.bookmarkCollection.findUnique({
    where: { id: collectionId },
    include: {
      items: { include: { post: { select: postCardSelect } } },
      _count: { select: { items: true } },
    },
  });

  if (!collection) return null;
  if (!collection.isPublic && collection.userId !== viewerId) return null;
  return collection as BookmarkCollectionWithItems;
}
