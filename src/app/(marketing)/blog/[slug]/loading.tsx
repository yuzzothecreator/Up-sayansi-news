import { Container } from "@/components/shared/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <Container className="py-12">
      <Skeleton className="mb-8 aspect-[21/9] w-full rounded-2xl" />
      <div className="mx-auto max-w-3xl space-y-6">
        <Skeleton className="h-6 w-24" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-6 w-2/3" />
        <div className="flex gap-3">
          <Skeleton className="size-10 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-24" />
          </div>
        </div>
        <div className="space-y-3 pt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className="h-4 w-full" style={{ width: `${85 + (i % 3) * 5}%` }} />
          ))}
        </div>
      </div>
    </Container>
  );
}
