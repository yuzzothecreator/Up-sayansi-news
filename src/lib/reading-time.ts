import readingTimeLib from "reading-time";
import { READING_WPM } from "@/lib/constants";

export type ReadingTimeResult = {
  text: string;
  minutes: number;
  words: number;
};

export function calculateReadingTime(
  content: string | Record<string, unknown>,
  wpm = READING_WPM,
): ReadingTimeResult {
  const text =
    typeof content === "string" ? content : extractTextFromTipTap(content);

  const stats = readingTimeLib(text, { wordsPerMinute: wpm });

  return {
    text: stats.text,
    minutes: Math.max(1, Math.ceil(stats.minutes)),
    words: stats.words,
  };
}

function extractTextFromTipTap(content: Record<string, unknown>): string {
  const parts: string[] = [];

  function walk(node: unknown) {
    if (!node || typeof node !== "object") return;

    const record = node as Record<string, unknown>;

    if (typeof record.text === "string") {
      parts.push(record.text);
    }

    if (Array.isArray(record.content)) {
      for (const child of record.content) {
        walk(child);
      }
    }
  }

  walk(content);
  return parts.join(" ");
}

export function formatReadingTime(minutes: number): string {
  if (minutes < 1) return "Less than 1 min read";
  if (minutes === 1) return "1 min read";
  return `${minutes} min read`;
}
