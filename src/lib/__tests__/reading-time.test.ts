import { describe, expect, it } from "vitest";
import { calculateReadingTime, formatReadingTime } from "@/lib/reading-time";

describe("calculateReadingTime", () => {
  it("calculates reading time from plain text", () => {
    const words = Array.from({ length: 400 }, (_, i) => `word${i}`).join(" ");
    const result = calculateReadingTime(words);

    expect(result.words).toBe(400);
    expect(result.minutes).toBeGreaterThanOrEqual(1);
    expect(result.text).toMatch(/min read/i);
  });

  it("extracts text from TipTap JSON content", () => {
    const content = {
      type: "doc",
      content: [
        {
          type: "paragraph",
          content: [{ type: "text", text: "Hello Pulse readers" }],
        },
      ],
    };

    const result = calculateReadingTime(content);
    expect(result.words).toBe(3);
    expect(result.minutes).toBe(1);
  });
});

describe("formatReadingTime", () => {
  it("formats minute labels", () => {
    expect(formatReadingTime(0)).toBe("Less than 1 min read");
    expect(formatReadingTime(1)).toBe("1 min read");
    expect(formatReadingTime(5)).toBe("5 min read");
  });
});
