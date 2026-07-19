"use server";

import { requireAuth } from "@/lib/auth";
import { actionError, actionSuccess } from "@/lib/action-utils";
import * as analyticsService from "@/services/analytics";
import * as postsService from "@/services/posts";
import * as notificationsService from "@/services/notifications";
import prisma from "@/lib/prisma";

export async function getDashboardStatsAction() {
  try {
    const user = await requireAuth();
    const stats = await analyticsService.getDashboardStats(user.id);
    return actionSuccess(stats);
  } catch (error) {
    return actionError(error);
  }
}

export async function getDashboardAnalyticsAction(days = 30) {
  try {
    const user = await requireAuth();
    const viewsOverTime = await analyticsService.getViewsOverTime(days);

    const authorViews = await prisma.view.findMany({
      where: {
        createdAt: { gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) },
        post: { authorId: user.id },
      },
      select: { createdAt: true },
    });

    const buckets = new Map<string, number>();
    for (const view of authorViews) {
      const key = view.createdAt.toISOString().slice(0, 10);
      buckets.set(key, (buckets.get(key) ?? 0) + 1);
    }

    const authorViewsOverTime = Array.from(buckets.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));

    const topPosts = await prisma.post.findMany({
      where: { authorId: user.id, status: "PUBLISHED" },
      select: {
        id: true,
        title: true,
        slug: true,
        viewsCount: true,
        likesCount: true,
        commentsCount: true,
      },
      orderBy: { viewsCount: "desc" },
      take: 5,
    });

    return actionSuccess({ viewsOverTime: authorViewsOverTime, topPosts, siteViews: viewsOverTime });
  } catch (error) {
    return actionError(error);
  }
}

export async function getRecentActivityAction() {
  try {
    const user = await requireAuth();

    const [recentPosts, recentComments, notifications] = await Promise.all([
      prisma.post.findMany({
        where: { authorId: user.id },
        select: {
          id: true,
          title: true,
          slug: true,
          status: true,
          updatedAt: true,
        },
        orderBy: { updatedAt: "desc" },
        take: 5,
      }),
      prisma.comment.findMany({
        where: { post: { authorId: user.id } },
        include: {
          author: { select: { id: true, name: true, image: true } },
          post: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      notificationsService.listNotifications(user.id, 1, 5),
    ]);

    return actionSuccess({ recentPosts, recentComments, notifications: notifications.data });
  } catch (error) {
    return actionError(error);
  }
}

export async function getMyPostsAction(input: {
  page?: number;
  status?: string;
  q?: string;
}) {
  try {
    const user = await requireAuth();
    const result = await postsService.listPosts(
      {
        page: input.page ?? 1,
        limit: 20,
        author: user.id,
        status: input.status as never,
        q: input.q,
        sort: "latest",
      },
      user.id,
    );
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}

export async function getPostByIdAction(id: string) {
  try {
    const user = await requireAuth();
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        category: true,
        tags: { include: { tag: true } },
      },
    });

    if (!post) return actionError(new Error("Post not found"));
    if (post.authorId !== user.id && user.role !== "EDITOR" && user.role !== "ADMINISTRATOR") {
      return actionError(new Error("Forbidden"));
    }

    return actionSuccess(post);
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteAccountAction() {
  try {
    const user = await requireAuth();
    await prisma.user.delete({ where: { id: user.id } });
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}
