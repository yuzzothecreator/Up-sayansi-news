import { describe, expect, it } from "vitest";
import {
  can,
  canDeletePost,
  canEditPost,
  canPublishPost,
  PermissionError,
  requirePermission,
  requireRole,
} from "@/lib/permissions";
import type { SessionUser } from "@/types/auth";

const author: SessionUser = {
  id: "author-1",
  name: "Author",
  email: "author@pulse.app",
  emailVerified: true,
  role: "AUTHOR",
  banned: false,
  verified: true,
};

const editor: SessionUser = {
  id: "editor-1",
  name: "Editor",
  email: "editor@pulse.app",
  emailVerified: true,
  role: "EDITOR",
  banned: false,
  verified: true,
};

const bannedAuthor: SessionUser = {
  ...author,
  id: "banned-1",
  banned: true,
};

describe("can", () => {
  it("denies permissions for unauthenticated users", () => {
    expect(can(null, "post:create")).toBe(false);
  });

  it("denies permissions for banned users", () => {
    expect(can(bannedAuthor, "post:create")).toBe(false);
  });

  it("grants role-based permissions", () => {
    expect(can(author, "post:create")).toBe(true);
    expect(can(author, "post:publish")).toBe(false);
    expect(can(editor, "post:publish")).toBe(true);
  });

  it("allows readers to write their own posts", () => {
    const reader: SessionUser = {
      id: "reader-1",
      name: "Reader",
      email: "reader@pulse.app",
      emailVerified: true,
      role: "READER",
      banned: false,
      verified: false,
    };
    expect(can(reader, "post:create")).toBe(true);
    expect(can(reader, "post:update:own")).toBe(true);
    expect(can(reader, "post:publish")).toBe(false);
  });
});

describe("canEditPost", () => {
  it("allows authors to edit their own posts", () => {
    expect(canEditPost(author, "author-1")).toBe(true);
    expect(canEditPost(author, "other-author")).toBe(false);
  });

  it("allows editors to edit any post", () => {
    expect(canEditPost(editor, "author-1")).toBe(true);
  });
});

describe("canDeletePost", () => {
  it("allows authors to delete their own posts", () => {
    expect(canDeletePost(author, "author-1")).toBe(true);
    expect(canDeletePost(author, "other-author")).toBe(false);
  });
});

describe("canPublishPost", () => {
  it("requires editor-level permissions", () => {
    expect(canPublishPost(author)).toBe(false);
    expect(canPublishPost(editor)).toBe(true);
  });
});

describe("requirePermission", () => {
  it("passes when permission is granted", () => {
    expect(() => requirePermission(author, "post:create")).not.toThrow();
  });

  it("throws PermissionError when permission is missing", () => {
    expect(() => requirePermission(author, "post:publish")).toThrow(PermissionError);
  });
});

describe("requireRole", () => {
  it("passes when user meets minimum role", () => {
    expect(() => requireRole(editor, "AUTHOR")).not.toThrow();
  });

  it("throws when role is insufficient", () => {
    expect(() => requireRole(author, "EDITOR")).toThrow(PermissionError);
  });
});
