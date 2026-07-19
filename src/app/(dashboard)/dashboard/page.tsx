import Link from "next/link";
import { Eye, FileText, Heart, MessageSquare, Users } from "lucide-react";
import { getDashboardStatsAction, getRecentActivityAction } from "@/actions/dashboard";
import { PageHeader } from "@/features/dashboard/page-header";
import { StatsCard } from "@/features/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/shared/empty-state";
import { formatRelativeTime } from "@/lib/utils";
import { PostStatusBadge } from "@/features/dashboard/posts-table";

export default async function DashboardOverviewPage() {
  const [statsResult, activityResult] = await Promise.all([
    getDashboardStatsAction(),
    getRecentActivityAction(),
  ]);

  const stats = statsResult.success ? statsResult.data! : {
    posts: 0,
    publishedPosts: 0,
    totalViews: 0,
    totalLikes: 0,
    followers: 0,
    comments: 0,
  };

  const activity = activityResult.success
    ? activityResult.data!
    : { recentPosts: [], recentComments: [], notifications: [] };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Overview"
        description="Your writing performance at a glance."
        actions={
          <Button asChild>
            <Link href="/dashboard/posts/new">Write a post</Link>
          </Button>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatsCard title="Posts" value={stats.posts} icon={FileText} description={`${stats.publishedPosts} published`} />
        <StatsCard title="Views" value={stats.totalViews.toLocaleString()} icon={Eye} />
        <StatsCard title="Likes" value={stats.totalLikes.toLocaleString()} icon={Heart} />
        <StatsCard title="Followers" value={stats.followers.toLocaleString()} icon={Users} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent posts</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/posts">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.recentPosts.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="No posts yet"
                description="Start writing your first story."
                actionLabel="Create post"
                actionHref="/dashboard/posts/new"
                className="py-8"
              />
            ) : (
              activity.recentPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                >
                  <div>
                    <Link
                      href={`/dashboard/posts/${post.id}/edit`}
                      className="font-medium hover:text-primary"
                    >
                      {post.title}
                    </Link>
                    <p className="text-xs text-muted-foreground">
                      Updated {formatRelativeTime(post.updatedAt)}
                    </p>
                  </div>
                  <PostStatusBadge status={post.status} />
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-base">Recent activity</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/dashboard/notifications">View all</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-3">
            {activity.recentComments.length === 0 &&
            activity.notifications.length === 0 ? (
              <EmptyState
                icon={MessageSquare}
                title="No recent activity"
                description="Comments and notifications will appear here."
                className="py-8"
              />
            ) : (
              <>
                {activity.recentComments.map((comment) => (
                  <div
                    key={comment.id}
                    className="rounded-lg border border-border/50 p-3 text-sm"
                  >
                    <p>
                      <span className="font-medium">{comment.author.name}</span> commented on{" "}
                      <Link href={`/posts/${comment.post.slug}`} className="text-primary">
                        {comment.post.title}
                      </Link>
                    </p>
                    <p className="mt-1 line-clamp-2 text-muted-foreground">{comment.content}</p>
                  </div>
                ))}
                {activity.notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-start justify-between rounded-lg border border-border/50 p-3 text-sm"
                  >
                    <div>
                      <p className="font-medium">{notification.title}</p>
                      {notification.message && (
                        <p className="text-muted-foreground">{notification.message}</p>
                      )}
                    </div>
                    {!notification.read && <Badge variant="secondary">New</Badge>}
                  </div>
                ))}
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
