import prisma from "@/lib/prisma";
import { sanitizePlainText } from "@/lib/sanitize";
import type {
  CommentQueryInput,
  CreateCommentInput,
  UpdateCommentInput,
} from "@/lib/validators/comment";
import {
  buildPaginationMeta,
  commentAuthorSelect,
  normalizePagination,
  ServiceError,
} from "@/lib/service-utils";
import type { CommentWithAuthor, PaginatedResult } from "@/types";

export async function createComment(input: CreateCommentInput, authorId: string) {
  const post = await prisma.post.findUnique({ where: { id: input.postId } });
  if (!post || post.status !== "PUBLISHED") {
    throw new ServiceError("Post not found", 404);
  }

  if (input.parentId) {
    const parent = await prisma.comment.findUnique({ where: { id: input.parentId } });
    if (!parent || parent.postId !== input.postId) {
      throw new ServiceError("Parent comment not found", 404);
    }
  }

  const content = sanitizePlainText(input.content);

  const [comment] = await prisma.$transaction([
    prisma.comment.create({
      data: {
        content,
        postId: input.postId,
        authorId,
        parentId: input.parentId,
      },
      include: {
        author: { select: commentAuthorSelect },
        _count: { select: { likes: true } },
      },
    }),
    prisma.post.update({
      where: { id: input.postId },
      data: { commentsCount: { increment: 1 } },
    }),
  ]);

  return comment as CommentWithAuthor;
}

export async function updateComment(
  input: UpdateCommentInput,
  userId: string,
  canEditAny: boolean,
) {
  const existing = await prisma.comment.findUnique({ where: { id: input.id } });
  if (!existing) throw new ServiceError("Comment not found", 404);
  if (!canEditAny && existing.authorId !== userId) {
    throw new ServiceError("Forbidden", 403);
  }

  return prisma.comment.update({
    where: { id: input.id },
    data: { content: sanitizePlainText(input.content) },
    include: {
      author: { select: commentAuthorSelect },
      _count: { select: { likes: true } },
    },
  });
}

export async function deleteComment(id: string, userId: string, canDeleteAny: boolean) {
  const existing = await prisma.comment.findUnique({
    where: { id },
    include: { replies: { select: { id: true } } },
  });
  if (!existing) throw new ServiceError("Comment not found", 404);
  if (!canDeleteAny && existing.authorId !== userId) {
    throw new ServiceError("Forbidden", 403);
  }

  const replyCount = existing.replies.length;
  await prisma.$transaction([
    prisma.comment.delete({ where: { id } }),
    prisma.post.update({
      where: { id: existing.postId },
      data: { commentsCount: { decrement: 1 + replyCount } },
    }),
  ]);
}

export async function getCommentsByPost(
  filters: CommentQueryInput,
): Promise<PaginatedResult<CommentWithAuthor>> {
  const { page, limit, skip } = normalizePagination(filters.page, filters.limit);

  const where = {
    postId: filters.postId,
    parentId: filters.parentId ?? null,
  };

  const [data, total] = await Promise.all([
    prisma.comment.findMany({
      where,
      include: {
        author: { select: commentAuthorSelect },
        replies: {
          include: {
            author: { select: commentAuthorSelect },
            _count: { select: { likes: true } },
          },
          orderBy: { createdAt: "asc" },
        },
        _count: { select: { likes: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.comment.count({ where }),
  ]);

  return {
    data: data as CommentWithAuthor[],
    meta: buildPaginationMeta(page, limit, total),
  };
}

export async function likeComment(commentId: string, userId: string) {
  const comment = await prisma.comment.findUnique({ where: { id: commentId } });
  if (!comment) throw new ServiceError("Comment not found", 404);

  const existing = await prisma.like.findUnique({
    where: { userId_commentId: { userId, commentId } },
  });

  if (existing) {
    await prisma.like.delete({ where: { id: existing.id } });
    return { liked: false };
  }

  await prisma.like.create({ data: { userId, commentId } });
  return { liked: true };
}

export async function getCommentById(id: string) {
  return prisma.comment.findUnique({
    where: { id },
    include: {
      author: { select: commentAuthorSelect },
      _count: { select: { likes: true } },
    },
  });
}
