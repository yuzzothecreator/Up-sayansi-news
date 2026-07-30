import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { AppProviders } from "@/providers/app-providers";
import { DashboardShell } from "@/features/dashboard/dashboard-shell";
import * as notificationsService from "@/services/notifications";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/dashboard");
  }

  if (user.banned) {
    redirect("/login?error=banned");
  }

  const unreadCount = await notificationsService.getUnreadCount(user.id);

  return (
    <AppProviders initialUser={user}>
      <DashboardShell unreadCount={unreadCount}>{children}</DashboardShell>
    </AppProviders>
  );
}
