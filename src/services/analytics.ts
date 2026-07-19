import prisma from "@/lib/prisma";

export async function recordView(
  postId: string,
  options?: { userId?: string; ipAddress?: string; userAgent?: string },
) {
  const post = await prisma.post.findUnique({ where: { id: postId } });
  if (!post || post.status !== "PUBLISHED") return null;

  const [view] = await prisma.$transaction([
    prisma.view.create({
      data: {
        postId,
        userId: options?.userId,
        ipAddress: options?.ipAddress,
        userAgent: options?.userAgent,
      },
    }),
    prisma.post.update({
      where: { id: postId },
      data: { viewsCount: { increment: 1 } },
    }),
  ]);

  return view;
}

export async function getPostViews(postId: string, days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [total, recent] = await Promise.all([
    prisma.view.count({ where: { postId } }),
    prisma.view.count({ where: { postId, createdAt: { gte: since } } }),
  ]);

  return { total, recent };
}

export async function getDashboardStats(userId: string) {
  const [posts, totalViews, totalLikes, followers, comments] = await Promise.all([
    prisma.post.count({ where: { authorId: userId } }),
    prisma.view.count({ where: { post: { authorId: userId } } }),
    prisma.like.count({ where: { post: { authorId: userId } } }),
    prisma.follow.count({ where: { followingId: userId } }),
    prisma.comment.count({ where: { post: { authorId: userId } } }),
  ]);

  const publishedPosts = await prisma.post.count({
    where: { authorId: userId, status: "PUBLISHED" },
  });

  return {
    posts,
    publishedPosts,
    totalViews,
    totalLikes,
    followers,
    comments,
  };
}

export async function getAdminStats() {
  const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

  const [
    users,
    posts,
    publishedPosts,
    comments,
    subscribers,
    pendingReports,
    viewsLast30Days,
    newUsersLast30Days,
  ] = await Promise.all([
    prisma.user.count(),
    prisma.post.count(),
    prisma.post.count({ where: { status: "PUBLISHED" } }),
    prisma.comment.count(),
    prisma.newsletterSubscriber.count({
      where: { confirmed: true, unsubscribedAt: null },
    }),
    prisma.report.count({ where: { status: "PENDING" } }),
    prisma.view.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
    prisma.user.count({ where: { createdAt: { gte: thirtyDaysAgo } } }),
  ]);

  const topPosts = await prisma.post.findMany({
    where: { status: "PUBLISHED" },
    select: {
      id: true,
      title: true,
      slug: true,
      viewsCount: true,
      likesCount: true,
    },
    orderBy: { viewsCount: "desc" },
    take: 5,
  });

  return {
    users,
    posts,
    publishedPosts,
    comments,
    subscribers,
    pendingReports,
    viewsLast30Days,
    newUsersLast30Days,
    topPosts,
  };
}

export async function getViewsOverTime(days = 30) {
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const views = await prisma.view.findMany({
    where: { createdAt: { gte: since } },
    select: { createdAt: true },
  });

  const buckets = new Map<string, number>();
  for (const view of views) {
    const key = view.createdAt.toISOString().slice(0, 10);
    buckets.set(key, (buckets.get(key) ?? 0) + 1);
  }

  return Array.from(buckets.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
