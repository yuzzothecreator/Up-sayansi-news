import { NotificationsList } from "@/features/dashboard/notifications-list";
import { PageHeader } from "@/features/dashboard/page-header";
import { getNotificationsAction } from "@/actions/notifications";

export default async function DashboardNotificationsPage() {
  const result = await getNotificationsAction(1);
  const notifications = result.success ? result.data!.data : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Notifications"
        description="Stay updated on activity around your stories."
      />
      <NotificationsList initialNotifications={notifications} />
    </div>
  );
}
