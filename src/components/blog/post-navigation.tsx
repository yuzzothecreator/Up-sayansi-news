import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
type PostNavItem = { slug: string; title: string };

type PostNavigationProps = {
  previous: PostNavItem | null;
  next: PostNavItem | null;
  className?: string;
};

export function PostNavigation({ previous, next, className }: PostNavigationProps) {
  if (!previous && !next) return null;

  return (
    <nav className={cn("grid gap-4 sm:grid-cols-2", className)}>
      {previous ? (
        <Link
          href={`/blog/${previous.slug}`}
          className="group flex items-center gap-3 rounded-2xl border border-border/50 bg-card p-5 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
        >
          <ChevronLeft className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:-translate-x-1" />
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Previous</p>
            <p className="truncate font-medium transition-colors group-hover:text-primary">
              {previous.title}
            </p>
          </div>
        </Link>
      ) : (
        <div />
      )}
      {next ? (
        <Link
          href={`/blog/${next.slug}`}
          className="group flex items-center justify-end gap-3 rounded-2xl border border-border/50 bg-card p-5 text-right shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-elevated"
        >
          <div className="min-w-0">
            <p className="text-xs text-muted-foreground">Next</p>
            <p className="truncate font-medium transition-colors group-hover:text-primary">
              {next.title}
            </p>
          </div>
          <ChevronRight className="size-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </Link>
      ) : null}
    </nav>
  );
}
