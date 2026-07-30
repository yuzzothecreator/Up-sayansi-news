import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionHeading } from "@/components/shared/section-heading";
import { PostCardComponent } from "@/components/blog/post-card";
import type { PostCard } from "@/types";
import { cn } from "@/lib/utils";

type RelatedPostsProps = {
  posts: PostCard[];
  className?: string;
};

export function RelatedPosts({ posts, className }: RelatedPostsProps) {
  if (posts.length === 0) return null;

  return (
    <section className={cn("space-y-8", className)}>
      <div className="flex items-end justify-between">
        <SectionHeading title="Related stories" description="More from UpSayansi News" />
        <Link
          href="/blog"
          className="hidden items-center gap-1 text-sm font-medium text-primary hover:underline sm:flex"
        >
          View all
          <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {posts.map((post, i) => (
          <PostCardComponent key={post.id} post={post} index={i} />
        ))}
      </div>
    </section>
  );
}
