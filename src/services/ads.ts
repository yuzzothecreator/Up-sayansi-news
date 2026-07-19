import type { AdvertisementPlacement, Prisma } from "@prisma/client";
import prisma from "@/lib/prisma";
import { ServiceError } from "@/lib/service-utils";

export type CreateAdInput = {
  title: string;
  imageUrl?: string;
  linkUrl: string;
  placement: AdvertisementPlacement;
  active?: boolean;
  priority?: number;
  startDate?: Date;
  endDate?: Date;
};

export type UpdateAdInput = Partial<CreateAdInput> & { id: string };

export async function createAdvertisement(input: CreateAdInput) {
  return prisma.advertisement.create({ data: input });
}

export async function updateAdvertisement(input: UpdateAdInput) {
  const { id, ...data } = input;
  const existing = await prisma.advertisement.findUnique({ where: { id } });
  if (!existing) throw new ServiceError("Advertisement not found", 404);

  return prisma.advertisement.update({ where: { id }, data });
}

export async function deleteAdvertisement(id: string) {
  await prisma.advertisement.delete({ where: { id } });
}

export async function getActiveAds(placement: AdvertisementPlacement) {
  const now = new Date();

  return prisma.advertisement.findMany({
    where: {
      placement,
      active: true,
      OR: [
        { startDate: null, endDate: null },
        { startDate: { lte: now }, endDate: null },
        { startDate: null, endDate: { gte: now } },
        { startDate: { lte: now }, endDate: { gte: now } },
      ],
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
  });
}

export async function listAdvertisements(filters?: {
  placement?: AdvertisementPlacement;
  active?: boolean;
}) {
  const where: Prisma.AdvertisementWhereInput = {
    ...(filters?.placement ? { placement: filters.placement } : {}),
    ...(filters?.active !== undefined ? { active: filters.active } : {}),
  };

  return prisma.advertisement.findMany({
    where,
    orderBy: [{ placement: "asc" }, { priority: "desc" }],
  });
}

export async function toggleAdvertisement(id: string, active: boolean) {
  return prisma.advertisement.update({
    where: { id },
    data: { active },
  });
}

export async function getAdvertisementById(id: string) {
  return prisma.advertisement.findUnique({ where: { id } });
}
