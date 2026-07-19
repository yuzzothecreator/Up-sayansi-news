import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  Bookmark,
  FileText,
  LayoutDashboard,
  PenLine,
  Settings,
  Shield,
} from "lucide-react";

export type DashboardNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: Array<"AUTHOR" | "EDITOR" | "ADMINISTRATOR">;
};

export const dashboardNavItems: DashboardNavItem[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Posts", href: "/dashboard/posts", icon: FileText },
  { title: "Drafts", href: "/dashboard/drafts", icon: PenLine },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Bookmarks", href: "/dashboard/bookmarks", icon: Bookmark },
  { title: "Notifications", href: "/dashboard/notifications", icon: Bell },
];

export const dashboardSettingsItems: DashboardNavItem[] = [
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export const dashboardAdminLink: DashboardNavItem = {
  title: "Admin panel",
  href: "/admin",
  icon: Shield,
  roles: ["EDITOR", "ADMINISTRATOR"],
};
