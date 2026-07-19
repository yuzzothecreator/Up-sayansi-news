"use server";

import { revalidatePath } from "next/cache";
import { requireAuth } from "@/lib/auth";
import { actionError, actionSuccess, type ActionResult } from "@/lib/action-utils";
import { RATE_LIMITS } from "@/lib/constants";
import { requirePermission } from "@/lib/permissions";
import { getRateLimitKey, rateLimit } from "@/lib/rate-limit";
import { createReportSchema } from "@/lib/validators/common";
import * as reportsService from "@/services/reports";

export async function createReportAction(input: unknown): Promise<ActionResult<{ id: string }>> {
  try {
    const user = await requireAuth();
    requirePermission(user, "comment:create");

    const rl = rateLimit(getRateLimitKey("report", user.id), RATE_LIMITS.comment);
    if (!rl.success) return actionError(new Error("Too many reports. Please slow down."));

    const parsed = createReportSchema.parse(input);
    const report = await reportsService.createReport({
      ...parsed,
      reporterId: user.id,
    });

    revalidatePath("/admin/reports");
    return actionSuccess({ id: report.id });
  } catch (error) {
    return actionError(error);
  }
}

export async function getMyReportsAction(page = 1) {
  try {
    const user = await requireAuth();
    const { prisma } = await import("@/lib/prisma");
    const skip = (page - 1) * 20;

    const [data, total] = await Promise.all([
      prisma.report.findMany({
        where: { reporterId: user.id },
        orderBy: { createdAt: "desc" },
        skip,
        take: 20,
      }),
      prisma.report.count({ where: { reporterId: user.id } }),
    ]);

    return actionSuccess({ data, total, page });
  } catch (error) {
    return actionError(error);
  }
}
