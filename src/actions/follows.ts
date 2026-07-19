"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-utils";
import { RATE_LIMITS } from "@/lib/constants";
import { requirePermission } from "@/lib/permissions";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";
import { followUserSchema } from "@/lib/validators/common";
import * as usersService from "@/services/users";
import { createNotification } from "@/services/notifications";

export async function followUserAction(input: unknown): Promise<ActionResult<{ following: boolean }>> {
  try {
    const user = await requireAuth();
    requirePermission(user, "follow:create");

    const rl = rateLimit(getRateLimitKey("follow", user.id), RATE_LIMITS.like);
    if (!rl.success) return actionError(new Error("Too many requests. Please slow down."));

    const parsed = followUserSchema.parse(input);
    const result = await usersService.followUser(user.id, parsed.userId);

    await createNotification({
      userId: parsed.userId,
      actorId: user.id,
      type: "FOLLOW",
      title: "New follower",
      message: `${user.name} started following you`,
      link: `/authors/${user.id}`,
    });

    revalidatePath(`/authors/${parsed.userId}`);
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}

export async function unfollowUserAction(input: unknown): Promise<ActionResult<{ following: boolean }>> {
  try {
    const user = await requireAuth();
    const parsed = followUserSchema.parse(input);
    const result = await usersService.unfollowUser(user.id, parsed.userId);
    revalidatePath(`/authors/${parsed.userId}`);
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}

export async function getFollowersAction(userId: string, page = 1) {
  try {
    const result = await usersService.getFollowers(userId, page);
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}

export async function getFollowingAction(userId: string, page = 1) {
  try {
    const result = await usersService.getFollowing(userId, page);
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}
