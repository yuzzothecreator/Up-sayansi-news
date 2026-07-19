import Link from "next/link";
import { Search } from "lucide-react";
import { PostCardComponent } from "@/components/blog/post-card";
import { Pagination } from "@/components/blog/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { safeCall } from "@/lib/safe-data";
import { mockPostCards, mockPaginationMeta } from "@/lib/mock-data";
import * as postsService from "@/services/posts";

type SearchResultsProps = {
  query: string;
  page: number;
  sort: "latest" | "popular" | "trending";
};

export async function SearchResults({ query, page, sort }: SearchResultsProps) {
  if (!query) {
    return (
      <div className="mx-auto max-w-md space-y-6 text-center">
        <Search className="mx-auto size-12 text-muted-foreground/40" />
        <p className="text-muted-foreground">Enter a search term to find stories</p>
        <form action="/search" method="GET" className="flex gap-2">
          <Input name="q" placeholder="Search stories…" className="rounded-xl" required />
          <Button type="submit" className="rounded-xl">Search</Button>
        </form>
      </div>
    );
  }

  const result = await safeCall(
    () => postsService.searchPosts(query, page, 12),
    { data: mockPostCards.filter((p) => p.title.toLowerCase().includes(query.toLowerCase())), meta: mockPaginationMeta },
  );

  return (
    <div className="space-y-8">
      <form action="/search" method="GET" className="flex gap-2">
        <Input name="q" defaultValue={query} placeholder="Search stories…" className="rounded-xl" />
        <input type="hidden" name="sort" value={sort} />
        <Button type="submit" className="rounded-xl">Search</Button>
      </form>

      {result.data.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.data.map((post, i) => (
              <PostCardComponent key={post.id} post={post} index={i} />
            ))}
          </div>
          <Pagination
            page={result.meta.page}
            totalPages={result.meta.totalPages}
            basePath="/search"
            searchParams={{ q: query, sort }}
          />
        </>
      ) : (
        <div className="py-16 text-center">
          <p className="text-muted-foreground">No results found for &ldquo;{query}&rdquo;</p>
          <Button variant="link" asChild className="mt-4">
            <Link href="/blog">Browse all stories</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
