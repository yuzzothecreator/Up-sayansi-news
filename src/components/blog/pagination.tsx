import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type PaginationProps = {
  page: number;
  totalPages: number;
  basePath: string;
  searchParams?: Record<string, string | undefined>;
  className?: string;
};

export function Pagination({
  page,
  totalPages,
  basePath,
  searchParams = {},
  className,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  function buildHref(p: number) {
    const params = new URLSearchParams();
    for (const [key, value] of Object.entries(searchParams)) {
      if (value) params.set(key, value);
    }
    if (p > 1) params.set("page", String(p));
    const qs = params.toString();
    return qs ? `${basePath}?${qs}` : basePath;
  }

  return (
    <nav className={cn("flex items-center justify-center gap-2", className)} aria-label="Pagination">
      <Button variant="outline" size="sm" className="rounded-xl" disabled={page <= 1} asChild={page > 1}>
        {page > 1 ? (
          <Link href={buildHref(page - 1)}>
            <ChevronLeft className="size-4" />
            Previous
          </Link>
        ) : (
          <>
            <ChevronLeft className="size-4" />
            Previous
          </>
        )}
      </Button>
      <span className="px-4 text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button variant="outline" size="sm" className="rounded-xl" disabled={page >= totalPages} asChild={page < totalPages}>
        {page < totalPages ? (
          <Link href={buildHref(page + 1)}>
            Next
            <ChevronRight className="size-4" />
          </Link>
        ) : (
          <>
            Next
            <ChevronRight className="size-4" />
          </>
        )}
      </Button>
    </nav>
  );
}
