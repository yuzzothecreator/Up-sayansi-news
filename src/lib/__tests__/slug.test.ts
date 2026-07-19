import { describe, expect, it, vi } from "vitest";
import {
  generateUniqueSlug,
  isValidSlug,
  slugify,
  slugifyUnique,
} from "@/lib/slug";

describe("slugify", () => {
  it("lowercases and hyphenates text", () => {
    expect(slugify("Hello World!")).toBe("hello-world");
  });

  it("respects max length", () => {
    expect(slugify("a".repeat(250), 10)).toHaveLength(10);
  });
});

describe("slugifyUnique", () => {
  it("returns base slug without suffix", () => {
    expect(slugifyUnique("Hello World")).toBe("hello-world");
  });

  it("appends numeric suffix", () => {
    expect(slugifyUnique("Hello World", 2)).toBe("hello-world-2");
  });
});

describe("isValidSlug", () => {
  it("accepts valid slugs", () => {
    expect(isValidSlug("hello-world")).toBe(true);
    expect(isValidSlug("post-123")).toBe(true);
  });

  it("rejects invalid slugs", () => {
    expect(isValidSlug("ab")).toBe(false);
    expect(isValidSlug("Hello-World")).toBe(false);
    expect(isValidSlug("hello_world")).toBe(false);
  });
});

describe("generateUniqueSlug", () => {
  it("returns base slug when available", async () => {
    const exists = vi.fn().mockResolvedValue(false);
    await expect(generateUniqueSlug("My Post", exists)).resolves.toBe("my-post");
    expect(exists).toHaveBeenCalledWith("my-post");
  });

  it("increments suffix until a unique slug is found", async () => {
    const exists = vi
      .fn()
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(true)
      .mockResolvedValueOnce(false);

    await expect(generateUniqueSlug("My Post", exists)).resolves.toBe("my-post-3");
    expect(exists).toHaveBeenCalledTimes(3);
  });

  it("falls back to timestamp suffix after many collisions", async () => {
    const exists = vi.fn().mockResolvedValue(true);
    const dateSpy = vi.spyOn(Date, "now").mockReturnValue(1234567890);

    const slug = await generateUniqueSlug("My Post", exists);
    expect(slug).toBe("my-post-1234567890");

    dateSpy.mockRestore();
  });
});
