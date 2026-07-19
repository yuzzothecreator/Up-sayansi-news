import { Suspense } from "react";
import Link from "next/link";
import { PenLine, Plus } from "lucide-react";
import { getMyPostsAction } from "@/actions/dashboard";
import { PageHeader } from "@/features/dashboard/page-header";
import { PostsTable } from "@/features/dashboard/posts-table";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/empty-state";
import { Skeleton } from "@/components/ui/skeleton";

export default async function DashboardDraftsPage() {
  const result = await getMyPostsAction({ status: "DRAFT" });
  const posts = result.success ? result.data!.data : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Drafts"
        description="Unpublished stories waiting to be finished."
        actions={
          <Button asChild>
            <Link href="/dashboard/posts/new">
              <Plus className="mr-2 size-4" />
              New draft
            </Link>
          </Button>
        }
      />

      {posts.length === 0 ? (
        <EmptyState
          icon={PenLine}
          title="No drafts"
          description="Start writing and save as draft anytime."
          actionLabel="Create draft"
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
