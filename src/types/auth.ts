export const ROLES = {
  READER: "READER",
  AUTHOR: "AUTHOR",
  EDITOR: "EDITOR",
  ADMINISTRATOR: "ADMINISTRATOR",
} as const;

export type Role = (typeof ROLES)[keyof typeof ROLES];

/** Unauthenticated visitors — not stored in the database */
export type GuestRole = "GUEST";

export type AppRole = Role | GuestRole;

export const ROLE_HIERARCHY: Record<Role, number> = {
  READER: 1,
  AUTHOR: 2,
  EDITOR: 3,
  ADMINISTRATOR: 4,
};

export const PERMISSIONS = {
  // Posts
  "post:read": "Read published posts",
  "post:create": "Create posts",
  "post:update:own": "Update own posts",
  "post:update:any": "Update any post",
  "post:delete:own": "Delete own posts",
  "post:delete:any": "Delete any post",
  "post:publish": "Publish posts directly",
  "post:feature": "Feature or pin posts",
  "post:review": "Review and approve posts",

  // Comments
  "comment:create": "Create comments",
  "comment:update:own": "Update own comments",
  "comment:delete:own": "Delete own comments",
  "comment:delete:any": "Delete any comment",
  "comment:moderate": "Moderate comments",

  // Engagement
  "like:create": "Like posts and comments",
  "bookmark:create": "Bookmark posts",
  "follow:create": "Follow authors",

  // Users
  "user:read": "View user profiles",
  "user:update:own": "Update own profile",
  "user:ban": "Ban users",
  "user:role": "Change user roles",

  // Platform
  "category:manage": "Manage categories and tags",
  "report:review": "Review reports",
  "ad:manage": "Manage advertisements",
  "audit:read": "View audit logs",
  "newsletter:manage": "Manage newsletter subscribers",
  "settings:manage": "Manage platform settings",
} as const;

export type Permission = keyof typeof PERMISSIONS;

export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  READER: [
    "post:read",
    "comment:create",
    "comment:update:own",
    "comment:delete:own",
    "like:create",
    "bookmark:create",
    "follow:create",
    "user:read",
    "user:update:own",
  ],
  AUTHOR: [
    "post:read",
    "post:create",
    "post:update:own",
    "post:delete:own",
    "comment:create",
    "comment:update:own",
    "comment:delete:own",
    "like:create",
    "bookmark:create",
    "follow:create",
    "user:read",
    "user:update:own",
  ],
  EDITOR: [
    "post:read",
    "post:create",
    "post:update:own",
    "post:update:any",
    "post:delete:own",
    "post:delete:any",
    "post:publish",
    "post:feature",
    "post:review",
    "comment:create",
    "comment:update:own",
    "comment:delete:own",
    "comment:delete:any",
    "comment:moderate",
    "like:create",
    "bookmark:create",
    "follow:create",
    "user:read",
    "user:update:own",
    "category:manage",
    "report:review",
  ],
  ADMINISTRATOR: Object.keys(PERMISSIONS) as Permission[],
};

export type SessionUser = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: Role;
  banned: boolean;
  banReason?: string | null;
  verified: boolean;
};

export type AuthContext = {
  user: SessionUser | null;
  role: AppRole;
  isAuthenticated: boolean;
};

export function isRole(value: string): value is Role {
  return Object.values(ROLES).includes(value as Role);
}

export function hasMinimumRole(userRole: Role, requiredRole: Role): boolean {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
}

export function getPermissionsForRole(role: Role): Permission[] {
  return ROLE_PERMISSIONS[role];
}

export function roleHasPermission(role: Role, permission: Permission): boolean {
  return ROLE_PERMISSIONS[role].includes(permission);
}

export function getRoleLabel(role: AppRole): string {
  const labels: Record<AppRole, string> = {
    GUEST: "Guest",
    READER: "Reader",
    AUTHOR: "Author",
    EDITOR: "Editor",
    ADMINISTRATOR: "Administrator",
  };
  return labels[role];
}
