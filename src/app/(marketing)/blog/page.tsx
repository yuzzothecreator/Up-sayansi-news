import Link from "next/link";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PostCardComponent } from "@/components/blog/post-card";
import { Pagination } from "@/components/blog/pagination";
import { safeCall } from "@/lib/safe-data";
import { mockPostCards, mockPaginationMeta } from "@/lib/mock-data";
import { siteConfig } from "@/config/site";
import * as postsService from "@/services/posts";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({
  title: "Blog",
  path: "/blog",
  description: "All stories on Pulse",
});

type BlogPageProps = {
  searchParams: Promise<{ page?: string; sort?: string; featured?: string }>;
};

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const sort = (params.sort as "latest" | "popular" | "trending") ?? "latest";
  const featured = params.featured === "true";

  const posts = await safeCall(
    () =>
      postsService.listPosts({
        page,
        limit: siteConfig.postsPerPage,
        sort,
        featured: featured || undefined,
      }),
    { data: mockPostCards, meta: mockPaginationMeta },
  );

  return (
    <Container className="py-16">
      <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <SectionHeading title="All stories" description="Browse the full Pulse archive" />
        <div className="flex gap-2">
          {(["latest", "popular", "trending"] as const).map((s) => (
            <Link
              key={s}
              href={`/blog?sort=${s}${featured ? "&featured=true" : ""}`}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-colors ${
                sort === s ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {s.charAt(0).toUpperCase() + s.slice(1)}
            </Link>
          ))}
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.data.map((post, i) => (
          <PostCardComponent key={post.id} post={post} index={i} />
        ))}
      </div>

      <Pagination
        page={posts.meta.page}
        totalPages={posts.meta.totalPages}
        basePath="/blog"
        searchParams={{ sort, featured: featured ? "true" : undefined }}
        className="mt-12"
      />
    </Container>
  );
}
