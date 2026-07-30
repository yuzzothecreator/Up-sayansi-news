import type { PostStatus, Role } from "@prisma/client";
import prisma from "@/lib/prisma";
import type { UpdateProfileInput } from "@/lib/validators/profile";
import type { BanUserInput, UpdateRoleInput } from "@/lib/validators/auth";
import {
  buildPaginationMeta,
  normalizePagination,
  ServiceError,
} from "@/lib/service-utils";
import type { PaginatedResult, UserProfile } from "@/types";

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      profile: true,
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });
}

export async function getUserByEmail(email: string) {
  return prisma.user.findUnique({
    where: { email },
    include: { profile: true },
  });
}

export async function updateProfile(userId: string, input: UpdateProfileInput) {
  const { name, image, ...profileData } = input;

  return prisma.user.update({
    where: { id: userId },
    data: {
      name,
      image,
      profile: {
        upsert: {
          create: profileData,
          update: profileData,
        },
      },
    },
    include: {
      profile: true,
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });
}

export async function followUser(followerId: string, followingId: string) {
  if (followerId === followingId) {
    throw new ServiceError("You cannot follow yourself", 400);
  }

  const target = await prisma.user.findUnique({ where: { id: followingId } });
  if (!target) throw new ServiceError("User not found", 404);

  await prisma.follow.upsert({
    where: {
      followerId_followingId: { followerId, followingId },
    },
    create: { followerId, followingId },
    update: {},
  });

  return { following: true };
}

export async function unfollowUser(followerId: string, followingId: string) {
  await prisma.follow.deleteMany({
    where: { followerId, followingId },
  });
  return { following: false };
}

export async function getFollowers(userId: string, page = 1, limit = 20) {
  const { skip, page: p, limit: l } = normalizePagination(page, limit);

  const where = { followingId: userId };
  const [data, total] = await Promise.all([
    prisma.follow.findMany({
      where,
      include: {
        follower: {
          select: { id: true, name: true, image: true, verified: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: l,
    }),
    prisma.follow.count({ where }),
  ]);

  return {
    data: data.map((f) => f.follower),
    meta: buildPaginationMeta(p, l, total),
  };
}

export async function getFollowing(userId: string, page = 1, limit = 20) {
  const { skip, page: p, limit: l } = normalizePagination(page, limit);

  const where = { followerId: userId };
  const [data, total] = await Promise.all([
    prisma.follow.findMany({
      where,
      include: {
        following: {
          select: { id: true, name: true, image: true, verified: true, role: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: l,
    }),
    prisma.follow.count({ where }),
  ]);

  return {
    data: data.map((f) => f.following),
    meta: buildPaginationMeta(p, l, total),
  };
}

export async function isFollowing(followerId: string, followingId: string) {
  const follow = await prisma.follow.findUnique({
    where: { followerId_followingId: { followerId, followingId } },
  });
  return Boolean(follow);
}

export async function banUser(input: BanUserInput) {
  return prisma.user.update({
    where: { id: input.userId },
    data: {
      banned: true,
      banReason: input.reason,
      banExpires: input.banExpires,
    },
  });
}

export async function unbanUser(userId: string) {
  return prisma.user.update({
    where: { id: userId },
    data: {
      banned: false,
      banReason: null,
      banExpires: null,
    },
  });
}

export async function updateUserRole(input: UpdateRoleInput) {
  return prisma.user.update({
    where: { id: input.userId },
    data: { role: input.role as Role },
  });
}

export async function getUserByUsername(username: string): Promise<UserProfile | null> {
  const users = await prisma.user.findMany({
    where: {
      OR: [
        { id: username },
        { role: { in: ["AUTHOR", "EDITOR", "ADMINISTRATOR"] } },
      ],
    },
    include: {
      profile: true,
      _count: { select: { posts: true, followers: true, following: true } },
    },
  });

  const normalized = username.toLowerCase();
  return (
    users.find((u) => {
      const slug = u.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return slug === normalized || u.id === username;
    }) ?? null
  );
}

export async function listAuthors(page = 1, limit = 20): Promise<PaginatedResult<UserProfile>> {
  const { skip, page: p, limit: l } = normalizePagination(page, limit);

  const where = {
    role: { in: ["AUTHOR", "EDITOR", "ADMINISTRATOR"] as Role[] },
    posts: { some: { status: "PUBLISHED" as PostStatus } },
  };

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        profile: true,
        _count: { select: { posts: true, followers: true, following: true } },
      },
      orderBy: { posts: { _count: "desc" } },
      skip,
      take: l,
    }),
    prisma.user.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(p, l, total) };
}

export async function listUsers(page = 1, limit = 20, search?: string): Promise<PaginatedResult<UserProfile>> {
  const { skip, page: p, limit: l } = normalizePagination(page, limit);

  const where = search
    ? {
        OR: [
          { name: { contains: search } },
          { email: { contains: search } },
        ],
      }
    : {};

  const [data, total] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        profile: true,
        _count: { select: { posts: true, followers: true, following: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: l,
    }),
    prisma.user.count({ where }),
  ]);

  return { data, meta: buildPaginationMeta(p, l, total) };
}
