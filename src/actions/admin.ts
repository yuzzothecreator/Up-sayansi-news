"use server";

import { revalidatePath, revalidateTag } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-utils";
import { AD_PLACEMENTS, CACHE_TAGS } from "@/lib/constants";
import { requirePermission } from "@/lib/permissions";
import { banUserSchema, updateRoleSchema } from "@/lib/validators/auth";
import { categorySchema, tagSchema } from "@/lib/validators/post";
import { resolveReportSchema } from "@/lib/validators/common";
import * as usersService from "@/services/users";
import * as categoriesService from "@/services/categories";
import * as reportsService from "@/services/reports";
import * as analyticsService from "@/services/analytics";
import * as adsService from "@/services/ads";
import { writeAuditLog, listAuditLogs } from "@/services/audit";
import { z } from "zod";

const createAdSchema = z.object({
  title: z.string().min(2).max(100),
  imageUrl: z.string().url().optional(),
  linkUrl: z.string().url(),
  placement: z.enum(AD_PLACEMENTS),
  active: z.boolean().optional().default(true),
  priority: z.number().int().optional().default(0),
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

const updateAdSchema = createAdSchema.partial().extend({
  id: z.string().cuid(),
});

export async function banUserAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "user:ban");

    const parsed = banUserSchema.parse(input);
    await usersService.banUser(parsed);

    await writeAuditLog({
      userId: user.id,
      action: "BAN",
      entityType: "user",
      entityId: parsed.userId,
      metadata: { reason: parsed.reason },
    });

    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function unbanUserAction(userId: string): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "user:ban");

    await usersService.unbanUser(userId);

    await writeAuditLog({
      userId: user.id,
      action: "UNBAN",
      entityType: "user",
      entityId: userId,
    });

    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function updateUserRoleAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "user:role");

    const parsed = updateRoleSchema.parse(input);
    await usersService.updateUserRole(parsed);

    await writeAuditLog({
      userId: user.id,
      action: "UPDATE",
      entityType: "user",
      entityId: parsed.userId,
      metadata: { role: parsed.role },
    });

    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function createCategoryAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireAuth();
    requirePermission(user, "category:manage");

    const parsed = categorySchema.parse(input);
    const category = await categoriesService.createCategory(parsed);

    revalidateTag(CACHE_TAGS.posts, "max");
    return actionSuccess({ id: category.id });
  } catch (error) {
    return actionError(error);
  }
}

export async function updateCategoryAction(
  id: string,
  input: unknown,
): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "category:manage");

    const parsed = categorySchema.partial().parse(input);
    await categoriesService.updateCategory(id, parsed);

    revalidateTag(CACHE_TAGS.posts, "max");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteCategoryAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "category:manage");

    await categoriesService.deleteCategory(id);
    revalidateTag(CACHE_TAGS.posts, "max");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function createTagAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireAuth();
    requirePermission(user, "category:manage");

    const parsed = tagSchema.parse(input);
    const tag = await categoriesService.createTag(parsed);
    return actionSuccess({ id: tag.id });
  } catch (error) {
    return actionError(error);
  }
}

export async function resolveReportAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "report:review");

    const parsed = resolveReportSchema.parse(input);
    await reportsService.resolveReport(parsed.id, user.id, parsed.status);
    revalidatePath("/admin/reports");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function getAdminStatsAction() {
  try {
    const user = await requireAuth();
    requirePermission(user, "settings:manage");

    const stats = await analyticsService.getAdminStats();
    return actionSuccess(stats);
  } catch (error) {
    return actionError(error);
  }
}

export async function getAuditLogsAction(page = 1) {
  try {
    const user = await requireAuth();
    requirePermission(user, "audit:read");

    const logs = await listAuditLogs(page);
    return actionSuccess(logs);
  } catch (error) {
    return actionError(error);
  }
}

export async function createAdAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireAuth();
    requirePermission(user, "ad:manage");

    const parsed = createAdSchema.parse(input);
    const ad = await adsService.createAdvertisement(parsed);
    return actionSuccess({ id: ad.id });
  } catch (error) {
    return actionError(error);
  }
}

export async function updateAdAction(input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "ad:manage");

    const parsed = updateAdSchema.parse(input);
    await adsService.updateAdvertisement(parsed);
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteAdAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "ad:manage");

    await adsService.deleteAdvertisement(id);
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function listUsersAction(page = 1, search?: string) {
  try {
    const user = await requireAuth();
    requirePermission(user, "user:role");

    const result = await usersService.listUsers(page, 20, search);
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}

export async function listReportsAction(page = 1) {
  try {
    const user = await requireAuth();
    requirePermission(user, "report:review");

    const result = await reportsService.listReports(page);
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}

export async function listCategoriesAction() {
  try {
    const user = await requireAuth();
    requirePermission(user, "category:manage");
    const categories = await categoriesService.listCategories();
    return actionSuccess(categories);
  } catch (error) {
    return actionError(error);
  }
}

export async function listTagsAction() {
  try {
    const user = await requireAuth();
    requirePermission(user, "category:manage");
    const tags = await categoriesService.listTags();
    return actionSuccess(tags);
  } catch (error) {
    return actionError(error);
  }
}

export async function deleteTagAction(id: string): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "category:manage");
    await categoriesService.deleteTag(id);
    revalidateTag(CACHE_TAGS.posts, "max");
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function updateTagAction(id: string, input: unknown): Promise<ActionResult> {
  try {
    const user = await requireAuth();
    requirePermission(user, "category:manage");
    const parsed = tagSchema.parse(input);
    await categoriesService.updateTag(id, parsed);
    return actionSuccess();
  } catch (error) {
    return actionError(error);
  }
}

export async function listAdminPostsAction(input: {
  page?: number;
  status?: string;
  q?: string;
}) {
  try {
    const user = await requireAuth();
    requirePermission(user, "post:review");

    const { listPosts } = await import("@/services/posts");
    const result = await listPosts({
      page: input.page ?? 1,
      limit: 20,
      status: input.status as never,
      q: input.q,
      sort: "latest",
    });
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}

export async function listAdminCommentsAction(page = 1) {
  try {
    const user = await requireAuth();
    requirePermission(user, "comment:moderate");

    const { prisma } = await import("@/lib/prisma");
    const limit = 20;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.comment.findMany({
        include: {
          author: { select: { id: true, name: true, image: true, email: true } },
          post: { select: { id: true, title: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.comment.count(),
    ]);

    return actionSuccess({
      data,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    return actionError(error);
  }
}

export async function listAdsAction() {
  try {
    const user = await requireAuth();
    requirePermission(user, "ad:manage");
    const ads = await adsService.listAdvertisements();
    return actionSuccess(ads);
  } catch (error) {
    return actionError(error);
  }
}

export async function listNewsletterSubscribersAction(page = 1) {
  try {
    const user = await requireAuth();
    requirePermission(user, "newsletter:manage");
    const { listSubscribers } = await import("@/services/newsletter");
    const result = await listSubscribers(page);
    return actionSuccess(result);
  } catch (error) {
    return actionError(error);
  }
}

export async function getAdminAnalyticsAction(days = 30) {
  try {
    const user = await requireAuth();
    requirePermission(user, "settings:manage");

    const [stats, viewsOverTime] = await Promise.all([
      analyticsService.getAdminStats(),
      analyticsService.getViewsOverTime(days),
    ]);

    return actionSuccess({ stats, viewsOverTime });
  } catch (error) {
    return actionError(error);
  }
}
