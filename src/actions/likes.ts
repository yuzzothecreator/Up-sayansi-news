"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import prisma from "@/lib/prisma";
import { requireAuth } from "@/lib/auth";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-utils";
import { CACHE_TAGS, RATE_LIMITS } from "@/lib/constants";
import { requirePermission } from "@/lib/permissions";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";
import { likeCommentSchema, likePostSchema } from "@/lib/validators/common";
import { createNotification } from "@/services/notifications";

export async function likePostAction(input: unknown): Promise<ActionResult<{ liked: boolean }>> {
  try {
    const user = await requireAuth();
    requirePermission(user, "like:create");

    const rl = rateLimit(getRateLimitKey("like", user.id), RATE_LIMITS.like);
    if (!rl.success) return actionError(new Error("Too many likes. Please slow down."));

    const parsed = likePostSchema.parse(input);

    const post = await prisma.post.findUnique({
      where: { id: parsed.postId },
      select: { id: true, authorId: true, slug: true, title: true, status: true },
    });

    if (!post || post.status !== "PUBLISHED") {
      return actionError(new Error("Post not found"));
    }

    const existing = await prisma.like.findUnique({
      where: { userId_postId: { userId: user.id, postId: parsed.postId } },
    });

    if (existing) {
      await prisma.$transaction([
        prisma.like.delete({ where: { id: existing.id } }),
        prisma.post.update({
          where: { id: parsed.postId },
          data: { likesCount: { decrement: 1 } },
        }),
      ]);

      revalidateTag(CACHE_TAGS.post(post.slug), "max");
      return actionSuccess({ liked: false });
    }

    await prisma.$transaction([
      prisma.like.create({ data: { userId: user.id, postId: parsed.postId } }),
      prisma.post.update({
        where: { id: parsed.postId },
        data: { likesCount: { increment: 1 } },
      }),
    ]);

    if (post.authorId !== user.id) {
      await createNotification({
        userId: post.authorId,
        actorId: user.id,
        type: "LIKE",
        title: "New like",
        message: `${user.name} liked "${post.title}"`,
        link: `/blog/${post.slug}`,
        postId: post.id,
      });
    }

    revalidateTag(CACHE_TAGS.post(post.slug), "max");
    revalidatePath(`/blog/${post.slug}`);
    return actionSuccess({ liked: true });
  } catch (error) {
    return actionError(error);
  }
}

export async function unlikePostAction(
  input: unknown,
): Promise<ActionResult<{ liked: boolean }>> {
  return likePostAction(input);
}

export async function toggleLikeCommentAction(
  input: unknown,
): Promise<ActionResult<{ liked: boolean }>> {
  try {
    const user = await requireAuth();
    requirePermission(user, "like:create");

    const rl = rateLimit(getRateLimitKey("like", user.id), RATE_LIMITS.like);
    if (!rl.success) return actionError(new Error("Too many likes. Please slow down."));

    const parsed = likeCommentSchema.parse(input);

    const existing = await prisma.like.findUnique({
      where: { userId_commentId: { userId: user.id, commentId: parsed.commentId } },
    });

    if (existing) {
      await prisma.like.delete({ where: { id: existing.id } });
      return actionSuccess({ liked: false });
    }

    await prisma.like.create({
      data: { userId: user.id, commentId: parsed.commentId },
    });

    return actionSuccess({ liked: true });
  } catch (error) {
    return actionError(error);
  }
}
