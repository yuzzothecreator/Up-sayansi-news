import { afterEach, describe, expect, it, vi } from "vitest";
import {
  absoluteUrl,
  cn,
  formatDate,
  formatRelativeTime,
  getInitials,
  truncate,
} from "@/lib/utils";

describe("cn", () => {
  it("merges class names and resolves Tailwind conflicts", () => {
    expect(cn("px-2", "px-4", "text-sm")).toBe("px-4 text-sm");
  });
});

describe("formatDate", () => {
  it("formats Date objects", () => {
    const formatted = formatDate(new Date("2026-01-15T12:00:00Z"));
    expect(formatted).toMatch(/Jan/);
    expect(formatted).toMatch(/15/);
    expect(formatted).toMatch(/2026/);
  });

  it("formats ISO date strings", () => {
    expect(formatDate("2026-03-01T00:00:00.000Z")).toMatch(/Mar/);
  });
});

describe("formatRelativeTime", () => {
  it("returns relative time for recent dates", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-20T12:00:00Z"));

    const twoHoursAgo = new Date("2026-07-20T10:00:00Z");
    const result = formatRelativeTime(twoHoursAgo);

    expect(result).toMatch(/hour/i);
    vi.useRealTimers();
  });
});

describe("truncate", () => {
  it("returns the original string when within length", () => {
    expect(truncate("hello", 10)).toBe("hello");
  });

  it("truncates long strings with an ellipsis", () => {
    expect(truncate("hello world", 5)).toBe("hello…");
  });
});

describe("absoluteUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("builds an absolute URL from a path", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulse.app");
    expect(absoluteUrl("/blog")).toBe("https://pulse.app/blog");
  });

  it("normalizes paths without a leading slash", () => {
    vi.stubEnv("NEXT_PUBLIC_APP_URL", "https://pulse.app/");
    expect(absoluteUrl("blog")).toBe("https://pulse.app/blog");
  });
});

describe("getInitials", () => {
  it("returns up to two uppercase initials", () => {
    expect(getInitials("Alex Morgan")).toBe("AM");
    expect(getInitials("Pulse")).toBe("P");
  });
});
