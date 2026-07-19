import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { BadgeCheck, Clock } from "lucide-react";
import { Container } from "@/components/shared/container";
import { ReadingProgress } from "@/components/shared/reading-progress";
import { ProseRenderer } from "@/components/blog/prose-renderer";
import { TableOfContents } from "@/components/blog/table-of-contents";
import { LikeButton } from "@/components/blog/like-button";
import { BookmarkButton } from "@/components/blog/bookmark-button";
import { ShareButtons } from "@/components/blog/share-buttons";
import { CommentForm } from "@/components/blog/comment-form";
import { CommentThread } from "@/components/blog/comment-thread";
import { RelatedPosts } from "@/components/blog/related-posts";
import { PostNavigation } from "@/components/blog/post-navigation";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { safeCall, safeCallNullable } from "@/lib/safe-data";
import { mockPostDetail, mockPostCards } from "@/lib/mock-data";
import { authorProfileUrl } from "@/lib/username";
import { absoluteUrl, formatDate } from "@/lib/utils";
import * as postsService from "@/services/posts";
import * as commentsService from "@/services/comments";
import { createArticleMetadata } from "@/lib/metadata";
import { siteConfig } from "@/config/site";
import type { PostCard } from "@/types";

type BlogPostPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = await safeCallNullable(
    () => postsService.getPostBySlug(slug),
    slug === mockPostDetail.slug ? mockPostDetail : null,
  );
  if (!post) return createArticleMetadata({ title: "Not found", path: `/blog/${slug}` });
  return createArticleMetadata({
    title: post.seoTitle ?? post.title,
    description: post.seoDescription ?? post.subtitle ?? undefined,
    path: `/blog/${slug}`,
    image: post.coverImage,
    publishedAt: post.publishedAt,
    author: post.author.name,
    tags: post.tags.map((t) => t.tag.name),
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;

  const post = await safeCallNullable(
    () => postsService.getPostBySlug(slug),
    slug === mockPostDetail.slug ? mockPostDetail : null,
  );

  if (!post) notFound();

  const [related, adjacent, commentsResult] = await Promise.all([
    safeCall(() => postsService.getRelatedPosts(post.id, 4), mockPostCards.slice(1, 5)),
    safeCall(
      () => postsService.getAdjacentPosts(slug),
      { previous: null, next: null },
    ),
    safeCall(
      () => commentsService.getCommentsByPost({ postId: post.id, page: 1, limit: 20 }),
      { data: [], meta: { page: 1, limit: 20, total: 0, totalPages: 1, hasNext: false, hasPrev: false } },
    ),
  ]);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.subtitle,
    image: post.coverImage,
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    author: { "@type": "Person", name: post.author.name },
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    mainEntityOfPage: absoluteUrl(`/blog/${slug}`),
  };

  const initials = post.author.name.split(" ").map((n) => n[0]).join("").slice(0, 2);

  return (
    <>
      <ReadingProgress target="article" />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {post.coverImage && (
        <div className="relative aspect-[21/9] max-h-[480px] w-full overflow-hidden">
          <Image src={post.coverImage} alt="" fill priority className="object-cover" sizes="100vw" />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent" />
        </div>
      )}

      <Container className="py-12">
        <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_240px]">
          <article id="article">
            <header className="mb-10 space-y-6">
              {post.category && (
                <Link href={`/categories/${post.category.slug}`}>
                  <Badge variant="secondary">{post.category.name}</Badge>
                </Link>
              )}
              <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">{post.title}</h1>
              {post.subtitle && (
                <p className="text-xl text-muted-foreground">{post.subtitle}</p>
              )}
              <div className="flex flex-wrap items-center gap-4">
                <Link href={authorProfileUrl(post.author)} className="flex items-center gap-3">
                  <Avatar className="size-10">
                    <AvatarImage src={post.author.image ?? undefined} />
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-medium">{post.author.name}</span>
                      {post.author.verified && <BadgeCheck className="size-4 text-primary" />}
                    </div>
                    {post.publishedAt && (
                      <time className="text-sm text-muted-foreground">{formatDate(post.publishedAt)}</time>
                    )}
                  </div>
                </Link>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="size-4" />
                  {post.readingTime} min read
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <LikeButton postId={post.id} initialCount={post.likesCount} />
                <BookmarkButton postId={post.id} />
                <ShareButtons title={post.title} slug={post.slug} />
              </div>
            </header>

            <ProseRenderer html={post.contentHtml ?? ""} className="mb-12" />

            {post.tags.length > 0 && (
              <div className="mb-12 flex flex-wrap gap-2">
                {post.tags.map(({ tag }) => (
                  <Link key={tag.id} href={`/tags/${tag.slug}`}>
                    <Badge variant="outline">#{tag.name}</Badge>
                  </Link>
                ))}
              </div>
            )}

            <PostNavigation previous={adjacent.previous} next={adjacent.next} className="mb-16" />

            <section className="border-t border-border/50 pt-12">
              <h2 className="mb-6 text-2xl font-semibold">
                Comments ({post.commentsCount})
              </h2>
              <CommentForm postId={post.id} className="mb-8" />
              <CommentThread comments={commentsResult.data} postId={post.id} />
            </section>
          </article>

          <aside className="hidden lg:block">
            <div className="sticky top-24 space-y-8">
              <TableOfContents html={post.contentHtml ?? ""} />
            </div>
          </aside>
        </div>

        <RelatedPosts posts={related as PostCard[]} className="mt-20 border-t border-border/50 pt-16" />
      </Container>
    </>
  );
}
