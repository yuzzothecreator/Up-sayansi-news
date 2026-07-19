import { notFound } from "next/navigation";
import { Container } from "@/components/shared/container";
import { SectionHeading } from "@/components/shared/section-heading";
import { PostCardComponent } from "@/components/blog/post-card";
import { Pagination } from "@/components/blog/pagination";
import { safeCall, safeCallNullable } from "@/lib/safe-data";
import { mockCategories, mockPostCards, mockPaginationMeta } from "@/lib/mock-data";
import * as categoriesService from "@/services/categories";
import * as postsService from "@/services/posts";
import { createMetadata } from "@/lib/metadata";

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ page?: string }>;
};

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await safeCallNullable(
    () => categoriesService.getCategoryBySlug(slug),
    mockCategories.find((c) => c.slug === slug) ?? null,
  );
  if (!category) return createMetadata({ title: "Category not found", noIndex: true });
  return createMetadata({
    title: category.name,
    description: category.description ?? `Stories in ${category.name}`,
    path: `/categories/${slug}`,
  });
}

export default async function CategoryPage({ params, searchParams }: CategoryPageProps) {
  const { slug } = await params;
  const { page: pageStr } = await searchParams;
  const page = Number(pageStr) || 1;

  const category = await safeCallNullable(
    () => categoriesService.getCategoryBySlug(slug),
    mockCategories.find((c) => c.slug === slug) ?? null,
  );

  if (!category) notFound();

  const posts = await safeCall(
    () => postsService.listPosts({ category: slug, page, limit: 12, sort: "latest" }),
    {
      data: mockPostCards.filter((p) => p.category?.slug === slug),
      meta: mockPaginationMeta,
    },
  );

  return (
    <Container className="py-16">
      <SectionHeading
        title={category.name}
        description={category.description ?? `${category._count?.posts ?? 0} stories`}
        className="mb-12"
      />
      {posts.data.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.data.map((post, i) => (
              <PostCardComponent key={post.id} post={post} index={i} />
            ))}
          </div>
          <Pagination page={posts.meta.page} totalPages={posts.meta.totalPages} basePath={`/categories/${slug}`} className="mt-12" />
        </>
      ) : (
        <p className="text-center text-muted-foreground">No stories in this category yet.</p>
      )}
    </Container>
  );
}
