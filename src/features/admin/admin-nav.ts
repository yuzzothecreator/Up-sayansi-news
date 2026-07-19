import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  FileText,
  Flag,
  LayoutDashboard,
  Mail,
  Megaphone,
  MessageSquare,
  Shield,
  Tag,
  Tags,
  Users,
} from "lucide-react";

export type AdminNavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: Array<"EDITOR" | "ADMINISTRATOR">;
};

export const adminNavItems: AdminNavItem[] = [
  { title: "Overview", href: "/admin", icon: LayoutDashboard },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Articles", href: "/admin/articles", icon: FileText },
  { title: "Users", href: "/admin/users", icon: Users, roles: ["ADMINISTRATOR"] },
  { title: "Comments", href: "/admin/comments", icon: MessageSquare },
  { title: "Categories", href: "/admin/categories", icon: Tags },
  { title: "Tags", href: "/admin/tags", icon: Tag },
  { title: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { title: "Ads", href: "/admin/ads", icon: Megaphone, roles: ["ADMINISTRATOR"] },
  { title: "Reports", href: "/admin/reports", icon: Flag },
  { title: "Roles", href: "/admin/roles", icon: Shield, roles: ["ADMINISTRATOR"] },
];
