"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-utils";
import { CACHE_TAGS, RATE_LIMITS } from "@/lib/constants";
import {
  can,
  canDeleteComment,
  canEditComment,
  PermissionError,
  requirePermission,
} from "@/lib/permissions";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";
import {
  createCommentSchema,
  deleteCommentSchema,
  updateCommentSchema,
} from "@/lib/validators/comment";
import * as commentsService from "@/services/comments";
import { createNotification } from "@/services/notifications";
import prisma from "@/lib/prisma";

export async function createCommentAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireAuth();
    requirePermission(user, "comment:create");

    const rl = rateLimit(getRateLimitKey("comment", user.id), RATE_LIMITS.comment);
    if (!rl.success) return actionError(new Error("Too many comments. Please slow down."));

    const parsed = createCommentSchema.parse(input);
    const comment = await commentsService.createComment(parsed, user.id);

    const post = await prisma.post.findUnique({
      where: { id: parsed.postId },
      select: { authorId: true, slug: true, title: true },
    });

    if (post && post.authorId !== user.id) {
      await createNotification({
        userId: post.authorId,
        actorId: user.id,
        type: parsed.parentId ? "REPLY" : "COMMENT",
        title: parsed.parentId ? "New reply" : "New comment",
        message: `${user.name} commented on "${post.title}"`,
        link: `/blog/${post.slug}#comment-${comment.id}`,
        postId: parsed.postId,
        commentId: comment.id,
      });
    }

    if (post) {
      revalidateTag(CACHE_TAGS.post(post.slug), "max");
      revalidatePath(`/blog/${post.slug}`);
    }
    return actionSuccess({ id: comment.id });
  } catch (error) {
    return actionError(error);
  }
}

export async function updateCommentAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    const parsed = updateCommentSchema.parse(input);

    const existing = await commentsService.getCommentById(parsed.id);
    if (!existing) return actionError(new Error("Comment not found"));

    if (!canEditComment(user, existing.authorId)) {
      throw new PermissionError("You cannot edit this comment");
    }

    await commentsService.updateComment(
      parsed,
      user.id,
      can(user, "comment:delete:any"),
    );

    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteCommentAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    const parsed = deleteCommentSchema.parse(input);

    const existing = await commentsService.getCommentById(parsed.id);
    if (!existing) return actionError(new Error("Comment not found"));

    if (!canDeleteComment(user, existing.authorId)) {
      throw new PermissionError("You cannot delete this comment");
    }

    const post = await prisma.post.findUnique({
      where: { id: existing.postId },
      select: { slug: true },
    });

    await commentsService.deleteComment(
      parsed.id,
      user.id,
      can(user, "comment:delete:any"),
    );

    if (post) {
      revalidateTag(CACHE_TAGS.post(post.slug), "max");
      revalidatePath(`/blog/${post.slug}`);
    }
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function likeCommentAction(commentId: string): Promise<ActionResult<{ liked: boolean }>> {
  try {
    const user = await requireAuth();
    requirePermission(user, "like:create");

    const rl = rateLimit(getRateLimitKey("like", user.id), RATE_LIMITS.like);
    if (!rl.success) return actionError(new Error("Too many likes. Please slow down."));

    const result = await commentsService.likeComment(commentId, user.id);
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}
