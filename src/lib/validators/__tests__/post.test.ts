import { describe, expect, it } from "vitest";
import {
  categorySchema,
  createPostSchema,
  postQuerySchema,
  publishPostSchema,
  tagSchema,
} from "@/lib/validators/post";

describe("createPostSchema", () => {
  it("accepts valid post input", () => {
    const result = createPostSchema.safeParse({
      title: "Why This World Cup Changed Everything",
      content: { type: "doc", content: [] },
      tagIds: [],
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.status).toBe("DRAFT");
    }
  });

  it("rejects titles that are too short", () => {
    const result = createPostSchema.safeParse({
      title: "Hi",
      content: { type: "doc", content: [] },
    });

    expect(result.success).toBe(false);
  });

  it("rejects invalid slug format", () => {
    const result = createPostSchema.safeParse({
      title: "Valid Title Here",
      slug: "Invalid Slug",
      content: { type: "doc", content: [] },
    });

    expect(result.success).toBe(false);
  });
});

describe("publishPostSchema", () => {
  it("accepts publish actions", () => {
    const result = publishPostSchema.safeParse({
      id: "clxyz1234567890123456789012",
      status: "PUBLISHED",
    });

    expect(result.success).toBe(true);
  });
});

describe("postQuerySchema", () => {
  it("applies defaults for pagination", () => {
    const result = postQuerySchema.safeParse({});

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.page).toBe(1);
      expect(result.data.limit).toBe(12);
      expect(result.data.sort).toBe("latest");
    }
  });
});

describe("categorySchema", () => {
  it("accepts valid category data", () => {
    const result = categorySchema.safeParse({
      name: "Sports",
      color: "#0f766e",
    });

    expect(result.success).toBe(true);
  });

  it("rejects invalid hex colors", () => {
    const result = categorySchema.safeParse({
      name: "Sports",
      color: "teal",
    });

    expect(result.success).toBe(false);
  });
});

describe("tagSchema", () => {
  it("accepts valid tag names", () => {
    const result = tagSchema.safeParse({ name: "Football" });
    expect(result.success).toBe(true);
  });
});
