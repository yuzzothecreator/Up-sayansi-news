import { getDashboardAnalyticsAction } from "@/actions/dashboard";
import { PageHeader } from "@/features/dashboard/page-header";
import { StatsCard } from "@/features/dashboard/stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { BarChart3, Eye, Heart, MessageSquare } from "lucide-react";
import Link from "next/link";

export default async function DashboardAnalyticsPage() {
  const result = await getDashboardAnalyticsAction(30);
  const data = result.success
    ? result.data!
    : { viewsOverTime: [], topPosts: [], siteViews: [] };

  const totalViews = data.viewsOverTime.reduce((sum, d) => sum + d.count, 0);
  const maxViews = Math.max(...data.viewsOverTime.map((d) => d.count), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Analytics"
        description="Track how your stories perform over the last 30 days."
      />

      <StatsCard
        title="Views (30 days)"
        value={totalViews.toLocaleString()}
        icon={BarChart3}
        description="Total views on your published posts"
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Views over time</CardTitle>
          </CardHeader>
          <CardContent>
            {data.viewsOverTime.length === 0 ? (
              <EmptyState
                icon={Eye}
                title="No view data yet"
                description="Publish posts to start tracking views."
                className="py-8"
              />
            ) : (
              <div className="flex h-48 items-end gap-1">
                {data.viewsOverTime.map((point) => (
                  <div key={point.date} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-md bg-primary/80 transition-all"
                      style={{ height: `${(point.count / maxViews) * 100}%`, minHeight: point.count ? 4 : 0 }}
                      title={`${point.date}: ${point.count} views`}
                    />
                    <span className="text-[9px] text-muted-foreground">
                      {point.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top performing posts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {data.topPosts.length === 0 ? (
              <EmptyState
                icon={BarChart3}
                title="No published posts"
                description="Your top posts will appear here."
                className="py-8"
              />
            ) : (
              data.topPosts.map((post, index) => (
                <div
                  key={post.id}
                  className="flex items-center justify-between rounded-lg border border-border/50 p-3"
                >
                  <div className="flex items-center gap-3">
                    <span className="flex size-7 items-center justify-center rounded-lg bg-muted text-xs font-semibold">
                      {index + 1}
                    </span>
                    <div>
                      <Link
                        href={`/blog/${post.slug}`}
                        className="font-medium hover:text-primary"
                      >
                        {post.title}
                      </Link>
                      <div className="flex gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Eye className="size-3" />
                          {post.viewsCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <Heart className="size-3" />
                          {post.likesCount}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="size-3" />
                          {post.commentsCount}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
