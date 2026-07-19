import type { NotificationType, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import {
  buildPaginationMeta,
  normalizePagination,
} from "@/lib/service-utils";
import type { NotificationWithActor, PaginatedResult } from "@/types";

export type CreateNotificationInput = {
  userId: string;
  actorId?: string;
  type: NotificationType;
  title: string;
  message?: string;
  link?: string;
  postId?: string;
  commentId?: string;
};

export async function createNotification(input: CreateNotificationInput) {
  if (input.actorId && input.actorId === input.userId) {
    return null;
  }

  return prisma.notification.create({
    data: input,
    include: {
      actor: { select: { id: true, name: true, image: true } },
    },
  });
}

export async function listNotifications(
  userId: string,
  page = 1,
  limit = 20,
  unreadOnly = false,
): Promise<PaginatedResult<NotificationWithActor>> {
  const { skip, page: p, limit: l } = normalizePagination(page, limit);

  const where: Prisma.NotificationWhereInput = {
    userId,
    ...(unreadOnly ? { read: false } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.notification.findMany({
      where,
      include: {
        actor: { select: { id: true, name: true, image: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: l,
    }),
    prisma.notification.count({ where }),
  ]);

  return {
    data: data as NotificationWithActor[],
    meta: buildPaginationMeta(p, l, total),
  };
}

export async function markNotificationRead(id: string, userId: string) {
  return prisma.notification.updateMany({
    where: { id, userId },
    data: { read: true },
  });
}

export async function markAllNotificationsRead(userId: string) {
  return prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}

export async function getUnreadCount(userId: string) {
  return prisma.notification.count({
    where: { userId, read: false },
  });
}

export async function deleteNotification(id: string, userId: string) {
  await prisma.notification.deleteMany({ where: { id, userId } });
}
