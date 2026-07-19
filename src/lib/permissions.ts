import {
  getPermissionsForRole,
  hasMinimumRole,
  roleHasPermission,
  type AppRole,
  type Permission,
  type Role,
  type SessionUser,
} from "@/types/auth";

export function can(user: SessionUser | null, permission: Permission): boolean {
  if (!user) return false;
  if (user.banned) return false;
  return roleHasPermission(user.role, permission);
}

export function canAny(
  user: SessionUser | null,
  permissions: Permission[],
): boolean {
  return permissions.some((permission) => can(user, permission));
}

export function canAll(
  user: SessionUser | null,
  permissions: Permission[],
): boolean {
  return permissions.every((permission) => can(user, permission));
}

export function requirePermission(
  user: SessionUser | null,
  permission: Permission,
): asserts user is SessionUser {
  if (!can(user, permission)) {
    throw new PermissionError(`Missing permission: ${permission}`);
  }
}

export function requireRole(
  user: SessionUser | null,
  minimumRole: Role,
): asserts user is SessionUser {
  if (!user || user.banned) {
    throw new PermissionError("Authentication required");
  }
  if (!hasMinimumRole(user.role, minimumRole)) {
    throw new PermissionError(`Requires ${minimumRole} role or higher`);
  }
}

export function isOwner(userId: string | null | undefined, resourceOwnerId: string): boolean {
  return Boolean(userId && userId === resourceOwnerId);
}

export function canEditPost(
  user: SessionUser | null,
  authorId: string,
): boolean {
  if (!user || user.banned) return false;
  if (can(user, "post:update:any")) return true;
  return isOwner(user.id, authorId) && can(user, "post:update:own");
}

export function canDeletePost(
  user: SessionUser | null,
  authorId: string,
): boolean {
  if (!user || user.banned) return false;
  if (can(user, "post:delete:any")) return true;
  return isOwner(user.id, authorId) && can(user, "post:delete:own");
}

export function canEditComment(
  user: SessionUser | null,
  authorId: string,
): boolean {
  if (!user || user.banned) return false;
  if (can(user, "comment:delete:any")) return true;
  return isOwner(user.id, authorId) && can(user, "comment:update:own");
}

export function canDeleteComment(
  user: SessionUser | null,
  authorId: string,
): boolean {
  if (!user || user.banned) return false;
  if (can(user, "comment:delete:any")) return true;
  return isOwner(user.id, authorId) && can(user, "comment:delete:own");
}

export function canPublishPost(user: SessionUser | null): boolean {
  return can(user, "post:publish");
}

export function canReviewPosts(user: SessionUser | null): boolean {
  return can(user, "post:review");
}

export function getEffectiveRole(user: SessionUser | null): AppRole {
  if (!user) return "GUEST";
  return user.role;
}

export function listPermissions(user: SessionUser | null): Permission[] {
  if (!user || user.banned) return [];
  return getPermissionsForRole(user.role);
}

export class PermissionError extends Error {
  readonly statusCode = 403;

  constructor(message: string) {
    super(message);
    this.name = "PermissionError";
  }
}

export {
  hasMinimumRole,
  roleHasPermission,
  getPermissionsForRole,
};
