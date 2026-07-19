import type { ReportReason, ReportStatus } from "@prisma/client";
import prisma from "@/lib/prisma";
import { buildPaginationMeta, normalizePagination, ServiceError } from "@/lib/service-utils";
import type { PaginatedResult, ReportTarget } from "@/types";

export type CreateReportInput = {
  reporterId: string;
  reason: ReportReason;
  description?: string;
} & ReportTarget;

export async function createReport(input: CreateReportInput) {
  const hasTarget = input.postId || input.commentId || input.targetUserId;
  if (!hasTarget) {
    throw new ServiceError("Report target is required", 400);
  }

  return prisma.report.create({
    data: {
      reporterId: input.reporterId,
      reason: input.reason,
      description: input.description,
      postId: input.postId,
      commentId: input.commentId,
      targetUserId: input.targetUserId,
    },
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      post: { select: { id: true, title: true, slug: true } },
      comment: { select: { id: true, content: true } },
      targetUser: { select: { id: true, name: true, email: true } },
    },
  });
}

export async function resolveReport(
  reportId: string,
  resolverId: string,
  status: ReportStatus,
) {
  const report = await prisma.report.findUnique({ where: { id: reportId } });
  if (!report) throw new ServiceError("Report not found", 404);

  return prisma.report.update({
    where: { id: reportId },
    data: {
      status,
      resolvedById: resolverId,
      resolvedAt: new Date(),
    },
  });
}

export async function listReports(
  page = 1,
  limit = 20,
  status?: ReportStatus,
): Promise<PaginatedResult<Awaited<ReturnType<typeof createReport>>>> {
  const { skip, page: p, limit: l } = normalizePagination(page, limit);
  const where = status ? { status } : {};

  const [data, total] = await Promise.all([
    prisma.report.findMany({
      where,
      include: {
        reporter: { select: { id: true, name: true, email: true } },
        post: { select: { id: true, title: true, slug: true } },
        comment: { select: { id: true, content: true } },
        targetUser: { select: { id: true, name: true, email: true } },
        resolvedBy: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: l,
    }),
    prisma.report.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(p, l, total) };
}

export async function getReportById(id: string) {
  return prisma.report.findUnique({
    where: { id },
    include: {
      reporter: { select: { id: true, name: true, email: true } },
      post: { select: { id: true, title: true, slug: true } },
      comment: { select: { id: true, content: true } },
      targetUser: { select: { id: true, name: true, email: true } },
      resolvedBy: { select: { id: true, name: true } },
    },
  });
}

export async function getPendingReportCount() {
  return prisma.report.count({ where: { status: "PENDING" } });
}
