"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-utils";
import { CACHE_TAGS, RATE_LIMITS } from "@/lib/constants";
import {
  can,
  canDeletePost,
  canEditPost,
  canPublishPost,
  PermissionError,
  requirePermission,
} from "@/lib/permissions";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";
import {
  createPostSchema,
  deletePostSchema,
  postQuerySchema,
  publishPostSchema,
  updatePostSchema,
} from "@/lib/validators/post";
import * as postsService from "@/services/posts";
import { writeAuditLog } from "@/services/audit";

export async function createPostAction(input: unknown): Promise<ActionResult<{ id: string; slug: string }>> {
  try {
    const user = await requireAuth();
    requirePermission(user, "post:create");

    const rl = rateLimit(getRateLimitKey("post", user.id), RATE_LIMITS.post);
    if (!rl.success) return actionError(new Error("Too many requests. Please try again later."));

    const parsed = createPostSchema.parse(input);
    const status = canPublishPost(user) ? parsed.status : "DRAFT";

    const post = await postsService.createPost({ ...parsed, status }, user.id);

    await writeAuditLog({
      userId: user.id,
      action: "CREATE",
      entityType: "post",
      entityId: post.id,
    });

    revalidateTag(CACHE_TAGS.posts, "max");
    revalidatePath("/");
    return actionSuccess({ id: post.id, slug: post.slug });
  } catch (error) {
    return actionError(error);
  }
}

export async function updatePostAction(input: unknown): Promise<ActionResult<{ slug: string }>> {
  try {
    const user = await requireAuth();
    const parsed = updatePostSchema.parse(input);

    const { prisma } = await import("@/lib/prisma");
    const post = await prisma.post.findUnique({ where: { id: parsed.id } });
    if (!post) return actionError(new Error("Post not found"));

    if (!canEditPost(user, post.authorId)) {
      throw new PermissionError("You cannot edit this post");
    }

    const updated = await postsService.updatePost(
      parsed,
      user.id,
      can(user, "post:update:any"),
    );

    await writeAuditLog({
      userId: user.id,
      action: "UPDATE",
      entityType: "post",
      entityId: updated.id,
    });

    revalidateTag(CACHE_TAGS.posts, "max");
    revalidateTag(CACHE_TAGS.post(updated.slug), "max");
    revalidatePath(`/posts/${updated.slug}`);
    return actionSuccess({ slug: updated.slug });
  } catch (error) {
    return actionError(error);
  }
}

export async function deletePostAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    const parsed = deletePostSchema.parse(input);

    const { prisma } = await import("@/lib/prisma");
    const post = await prisma.post.findUnique({ where: { id: parsed.id } });
    if (!post) return actionError(new Error("Post not found"));

    if (!canDeletePost(user, post.authorId)) {
      throw new PermissionError("You cannot delete this post");
    }

    await postsService.deletePost(
      parsed.id,
      user.id,
      can(user, "post:delete:any"),
    );

    await writeAuditLog({
      userId: user.id,
      action: "DELETE",
      entityType: "post",
      entityId: parsed.id,
    });

    revalidateTag(CACHE_TAGS.posts, "max");
    revalidateTag(CACHE_TAGS.post(post.slug), "max");
    revalidatePath("/");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function publishPostAction(input: unknown): Promise<ActionResult<{ slug: string }>> {
  try {
    const user = await requireAuth();
    const parsed = publishPostSchema.parse(input);

    const { prisma } = await import("@/lib/prisma");
    const post = await prisma.post.findUnique({ where: { id: parsed.id } });
    if (!post) return actionError(new Error("Post not found"));

    if (!canEditPost(user, post.authorId)) {
      throw new PermissionError("You cannot publish this post");
    }

    const status = canPublishPost(user)
      ? parsed.status
      : parsed.status === "PUBLISHED"
        ? "PENDING_REVIEW"
        : parsed.status;

    const updated = await postsService.publishPost(
      { ...parsed, status },
      user.id,
    );

    await writeAuditLog({
      userId: user.id,
      action: "PUBLISH",
      entityType: "post",
      entityId: updated.id,
      metadata: { status },
    });

    revalidateTag(CACHE_TAGS.posts, "max");
    revalidateTag(CACHE_TAGS.featured, "max");
    revalidateTag(CACHE_TAGS.post(updated.slug), "max");
    revalidatePath("/");
    return actionSuccess({ slug: updated.slug });
  } catch (error) {
    return actionError(error);
  }
}

export async function featurePostAction(input: {
  id: string;
  featured: boolean;
}): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "post:feature");

    await postsService.featurePost(input.id, input.featured);

    revalidateTag(CACHE_TAGS.featured, "max");
    revalidateTag(CACHE_TAGS.posts, "max");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function pinPostAction(input: {
  id: string;
  pinned: boolean;
}): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "post:feature");

    await postsService.pinPost(input.id, input.pinned);

    revalidateTag(CACHE_TAGS.posts, "max");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function getPostsAction(input: unknown) {
  try {
    const parsed = postQuerySchema.parse(input);
    const result = await postsService.listPosts(parsed);
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}

export async function getPostBySlugAction(slug: string) {
  try {
    const user = await requireAuth().catch(() => null);
    const post = await postsService.getPostBySlug(slug, {
      includeDraft: Boolean(user),
      authorId: user?.id,
    });
    if (!post) return actionError(new Error("Post not found"));
    return actionSuccess(post);
  } catch (error) {
    return actionError(error);
  }
}
