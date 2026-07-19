import { Suspense } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { getMyPostsAction } from "@/actions/dashboard";
import { PageHeader } from "@/features/dashboard/page-header";
import { PostsTable } from "@/features/dashboard/posts-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { FileText } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type PageProps = {
  searchParams: Promise<{ page?: string; status?: string; q?: string }>;
};

export default async function DashboardPostsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const result = await getMyPostsAction({
    page: Number(params.page) || 1,
    status: params.status,
    q: params.q,
  });

  const posts = result.success ? result.data!.data : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="My posts"
        description="Manage and filter all your stories."
        actions={
          <Button asChild>
            <Link href="/dashboard/posts/new">
              <Plus className="mr-2 size-4" />
              New post
            </Link>
          </Button>
        }
      />

      {posts.length === 0 && !params.q && !params.status ? (
        <EmptyState
          icon={FileText}
          title="No posts yet"
          description="Create your first post to get started."
          actionLabel="Write a post"
          actionHref="/dashboard/posts/new"
        />
      ) : (
        <Suspense fallback={<Skeleton className="h-64 w-full rounded-xl" />}>
          <PostsTable posts={posts} />
        </Suspense>
      )}
    </div>
  );
}
