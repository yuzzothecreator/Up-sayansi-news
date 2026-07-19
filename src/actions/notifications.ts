"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-utils";
import * as notificationsService from "@/services/notifications";

export async function getNotificationsAction(page = 1, unreadOnly = false) {
  try {
    const user = await requireAuth();
    const result = await notificationsService.listNotifications(
      user.id,
      page,
      20,
      unreadOnly,
    );
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}

export async function getUnreadNotificationCountAction() {
  try {
    const user = await requireAuth();
    const count = await notificationsService.getUnreadCount(user.id);
    return actionSuccess({ count });
  } catch (error) {
    return actionError(error);
  }
}

export async function markNotificationReadAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    await notificationsService.markNotificationRead(id, user.id);
    revalidatePath("/dashboard/notifications");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function markAllNotificationsReadAction(): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    await notificationsService.markAllNotificationsRead(user.id);
    revalidatePath("/dashboard/notifications");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteNotificationAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    await notificationsService.deleteNotification(id, user.id);
    revalidatePath("/dashboard/notifications");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}
