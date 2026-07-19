"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type TocItem = {
  id: string;
  text: string;
  level: number;
};

type TableOfContentsProps = {
  html: string;
  className?: string;
};

export function TableOfContents({ html, className }: TableOfContentsProps) {
  const [items, setItems] = useState<TocItem[]>([]);
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const headings = doc.querySelectorAll("h2, h3");

    const tocItems: TocItem[] = Array.from(headings).map((heading) => ({
      id: heading.id || heading.textContent?.toLowerCase().replace(/\s+/g, "-") || "",
      text: heading.textContent || "",
      level: parseInt(heading.tagName[1]),
    }));

    setItems(tocItems);
  }, [html]);

  useEffect(() => {
    if (items.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        }
      },
      { rootMargin: "-80px 0px -80% 0px" },
    );

    for (const item of items) {
      const el = document.getElementById(item.id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav className={cn("space-y-1", className)}>
      <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        On this page
      </p>
      <ul className="space-y-1 border-l border-border/50">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={cn(
                "block border-l-2 py-1 text-sm transition-colors hover:text-foreground",
                item.level === 3 ? "pl-6" : "pl-4",
                activeId === item.id
                  ? "border-primary font-medium text-primary"
                  : "border-transparent text-muted-foreground",
              )}
            >
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
