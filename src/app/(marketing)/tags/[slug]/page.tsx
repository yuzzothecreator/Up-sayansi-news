import { notFound } from "next/navigation";
import Link from "next/link";
import { Container } from "@/components/shared/container";
import { PostCardComponent } from "@/components/blog/post-card";
import { Pagination } from "@/components/blog/pagination";
import { Badge } from "@/components/ui/badge";
import { safeCall, safeCallNullable } from "@/lib/safe-data";
import { mockPostCards, mockPaginationMeta, mockTags } from "@/lib/mock-data";
import * as categoriesService from "@/services/categories";
import * as postsService from "@/services/posts";
import { createMetadata } from "@/lib/metadata";

type TagPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: TagPageProps) {
  const { slug } = await params;
  const tag = await safeCallNullable(
    () => categoriesService.getTagBySlug(slug),
    mockTags.find((t) => t.slug === slug) ?? null,
  );
  if (!tag) return createMetadata({ title: "Tag not found", noIndex: true });
  return createMetadata({
    title: `#${tag.name}`,
    description: `Stories tagged with ${tag.name}`,
    path: `/tags/${slug}`,
  });
}

export default async function TagPage({ params, searchParams }: TagPageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;

  const tag = await safeCallNullable(
    () => categoriesService.getTagBySlug(slug),
    mockTags.find((t) => t.slug === slug) ?? null,
  );

  if (!tag) notFound();

  const posts = await safeCall(
    () => postsService.listPosts({ tag: slug, page, limit: 12, sort: "latest" }),
    { data: mockPostCards, meta: mockPaginationMeta },
  );

  return (
    <Container className="py-16">
      <div className="mb-12 flex items-center gap-3">
        <Badge variant="secondary" className="text-lg px-4 py-1">#{tag.name}</Badge>
        <span className="text-muted-foreground">{tag._count?.posts ?? 0} stories</span>
      </div>
      {posts.data.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.data.map((post, i) => (
              <PostCardComponent key={post.id} post={post} index={i} />
            ))}
          </div>
          <Pagination page={posts.meta.page} totalPages={posts.meta.totalPages} basePath={`/tags/${slug}`} className="mt-12" />
        </>
      ) : (
        <p className="text-center text-muted-foreground">
          No stories with this tag yet.{" "}
          <Link href="/blog" className="text-primary hover:underline">Browse all stories</Link>
        </p>
      )}
    </Container>
  );
}
