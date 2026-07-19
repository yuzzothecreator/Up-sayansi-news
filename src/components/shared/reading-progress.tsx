"use client";

import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type ReadingProgressProps = {
  target?: string;
  className?: string;
};

export function ReadingProgress({
  target = "article",
  className,
}: ReadingProgressProps) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const element = document.querySelector(target);

    function handleScroll() {
      if (!element) {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? Math.min(100, (scrollTop / docHeight) * 100) : 0);
        return;
      }

      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + window.scrollY;
      const elementHeight = element.scrollHeight;
      const viewportBottom = window.scrollY + window.innerHeight;
      const read = viewportBottom - elementTop;
      const total = elementHeight + window.innerHeight;

      setProgress(Math.min(100, Math.max(0, (read / total) * 100)));
    }

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [target]);

  return (
    <div
      className={cn(
        "pointer-events-none fixed inset-x-0 top-0 z-50 h-0.5 bg-transparent",
        className,
      )}
      aria-hidden
    >
      <div
        className="h-full bg-primary transition-[width] duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
