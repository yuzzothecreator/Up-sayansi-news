"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-utils";
import { requirePermission } from "@/lib/permissions";
import { updateProfileSchema } from "@/lib/validators/profile";
import * as usersService from "@/services/users";

export async function updateProfileAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "user:update:own");

    const parsed = updateProfileSchema.parse(input);
    await usersService.updateProfile(user.id, parsed);

    revalidatePath(`/authors/${user.id}`);
    revalidatePath("/dashboard/settings");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function getProfileAction(userId: string) {
  try {
    const profile = await usersService.getUserProfile(userId);
    if (!profile) return actionError(new Error("User not found"));
    return actionSuccess(profile);
  } catch (error) {
    return actionError(error);
  }
}

export async function getMyProfileAction() {
  try {
    const user = await requireAuth();
    const profile = await usersService.getUserProfile(user.id);
    return actionSuccess(profile);
  } catch (error) {
    return actionError(error);
  }
}
