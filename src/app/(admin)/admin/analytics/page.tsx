import { getAdminAnalyticsAction } from "@/actions/admin";
import { AdminStatsCard } from "@/features/admin/admin-stats-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { BarChart3, Eye, TrendingUp, Users } from "lucide-react";
import Link from "next/link";

export default async function AdminAnalyticsPage() {
  const result = await getAdminAnalyticsAction(30);
  const data = result.success
    ? result.data!
    : {
        stats: {
          users: 0,
          viewsLast30Days: 0,
          newUsersLast30Days: 0,
          publishedPosts: 0,
          topPosts: [],
        },
        viewsOverTime: [],
      };

  const { stats, viewsOverTime } = data;
  const maxViews = Math.max(...viewsOverTime.map((d) => d.count), 1);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
        <p className="text-sm text-muted-foreground">Detailed platform metrics for the last 30 days.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AdminStatsCard title="Total users" value={stats.users} icon={Users} description={`+${stats.newUsersLast30Days} new`} />
        <AdminStatsCard title="Views (30d)" value={stats.viewsLast30Days.toLocaleString()} icon={Eye} />
        <AdminStatsCard title="Published posts" value={stats.publishedPosts} icon={BarChart3} />
        <AdminStatsCard title="Growth" value={`${stats.newUsersLast30Days}`} icon={TrendingUp} description="New users this month" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Site views over time</CardTitle>
          </CardHeader>
          <CardContent>
            {viewsOverTime.length === 0 ? (
              <EmptyState icon={BarChart3} title="No data" description="View data will appear here." className="py-8" />
            ) : (
              <div className="flex h-56 items-end gap-1">
                {viewsOverTime.map((point) => (
                  <div key={point.date} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t-md bg-chart-2/80"
                      style={{
                        height: `${(point.count / maxViews) * 100}%`,
                        minHeight: point.count ? 4 : 0,
                      }}
                      title={`${point.date}: ${point.count}`}
                    />
                    <span className="text-[9px] text-muted-foreground">{point.date.slice(5)}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Top posts by views</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {stats.topPosts.length === 0 ? (
              <p className="text-sm text-muted-foreground">No published posts yet.</p>
            ) : (
              stats.topPosts.map((post, i) => (
                <div key={post.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{i + 1}.</span>
                    <Link href={`/blog/${post.slug}`} className="font-medium hover:text-primary">
                      {post.title}
                    </Link>
                  </div>
                  <span className="text-muted-foreground">{post.viewsCount.toLocaleString()} views</span>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
