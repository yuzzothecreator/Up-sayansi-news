import type { AuditAction, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { buildPaginationMeta, normalizePagination } from "@/lib/service-utils";
import type { AuditLogEntry, PaginatedResult } from "@/types";

export type WriteAuditLogInput = {
  userId?: string;
  action: AuditAction;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
};

export async function writeAuditLog(input: WriteAuditLogInput) {
  return prisma.auditLog.create({
    data: {
      userId: input.userId,
      action: input.action,
      entityType: input.entityType,
      entityId: input.entityId,
      metadata: input.metadata as Prisma.InputJsonValue | undefined,
      ipAddress: input.ipAddress,
    },
  });
}

export async function listAuditLogs(
  page = 1,
  limit = 50,
  filters?: {
    userId?: string;
    action?: AuditAction;
    entityType?: string;
  },
): Promise<PaginatedResult<AuditLogEntry>> {
  const { skip, page: p, limit: l } = normalizePagination(page, limit);

  const where: Prisma.AuditLogWhereInput = {
    ...(filters?.userId ? { userId: filters.userId } : {}),
    ...(filters?.action ? { action: filters.action } : {}),
    ...(filters?.entityType ? { entityType: filters.entityType } : {}),
  };

  const [data, total] = await Promise.all([
    prisma.auditLog.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: l,
    }),
    prisma.auditLog.count({ where }),
  ]);

  return {
    data: data as AuditLogEntry[],
    meta: buildPaginationMeta(p, l, total),
  };
}

export async function getAuditLogsForEntity(entityType: string, entityId: string) {
  return prisma.auditLog.findMany({
    where: { entityType, entityId },
    include: {
      user: { select: { id: true, name: true, email: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}
