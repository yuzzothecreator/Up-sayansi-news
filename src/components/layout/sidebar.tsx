"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  FileText,
  LayoutDashboard,
  PenLine,
  Settings,
  Shield,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/shared/logo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useSession } from "@/lib/auth-client";
import type { LucideIcon } from "lucide-react";

type SidebarItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  roles?: Array<"AUTHOR" | "EDITOR" | "ADMINISTRATOR">;
};

const dashboardItems: SidebarItem[] = [
  { title: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { title: "Posts", href: "/dashboard/posts", icon: FileText },
  { title: "Analytics", href: "/dashboard/analytics", icon: BarChart3 },
  { title: "Library", href: "/library", icon: Bookmark },
  {
    title: "Write",
    href: "/dashboard/posts/new",
    icon: PenLine,
  },
];

const adminItems: SidebarItem[] = [
  { title: "Admin", href: "/admin", icon: Shield, roles: ["EDITOR", "ADMINISTRATOR"] },
  { title: "Users", href: "/admin/users", icon: Users, roles: ["ADMINISTRATOR"] },
];

const settingsItems: SidebarItem[] = [
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

type SidebarProps = {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
};

function NavSection({
  title,
  items,
  collapsed,
  pathname,
  userRole,
}: {
  title: string;
  items: SidebarItem[];
  collapsed: boolean;
  pathname: string;
  userRole?: string;
}) {
  const visibleItems = items.filter(
    (item) => !item.roles || (userRole && item.roles.includes(userRole as never)),
  );

  if (visibleItems.length === 0) return null;

  return (
    <div className="space-y-2">
      {!collapsed && (
        <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          {title}
        </p>
      )}
      <div className="space-y-1">
        {visibleItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            pathname === item.href ||
            (item.href !== "/dashboard" && pathname.startsWith(item.href));

          const link = (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                isActive &&
                  "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft",
                collapsed && "justify-center px-2",
              )}
            >
              <Icon className="size-4 shrink-0" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );

          if (collapsed) {
            return (
              <Tooltip key={item.href}>
                <TooltipTrigger asChild>{link}</TooltipTrigger>
                <TooltipContent side="right">{item.title}</TooltipContent>
              </Tooltip>
            );
          }

          return link;
        })}
      </div>
    </div>
  );
}

export function Sidebar({
  collapsed = false,
  onCollapsedChange,
  className,
}: SidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role as string | undefined;

  return (
    <TooltipProvider delayDuration={0}>
      <aside
        className={cn(
          "flex h-full flex-col border-r border-sidebar-border bg-sidebar/90 backdrop-blur-xl transition-[width] duration-200",
          collapsed ? "w-[72px]" : "w-64",
          className,
        )}
      >
        <div className="flex h-16 items-center justify-between px-3">
          {!collapsed && <Logo size="sm" />}
          {collapsed && (
            <Logo showText={false} size="sm" className="mx-auto" />
          )}
          {onCollapsedChange && (
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-xl", collapsed && "mx-auto mt-2")}
              onClick={() => onCollapsedChange(!collapsed)}
              aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
              {collapsed ? (
                <ChevronRight className="size-4" />
              ) : (
                <ChevronLeft className="size-4" />
              )}
            </Button>
          )}
        </div>

        <Separator />

        <ScrollArea className="flex-1 px-2 py-4">
          <div className="space-y-6">
            <NavSection
              title="Dashboard"
              items={dashboardItems}
              collapsed={collapsed}
              pathname={pathname}
              userRole={userRole}
            />
            <NavSection
              title="Administration"
              items={adminItems}
              collapsed={collapsed}
              pathname={pathname}
              userRole={userRole}
            />
            <NavSection
              title="Account"
              items={settingsItems}
              collapsed={collapsed}
              pathname={pathname}
              userRole={userRole}
            />
          </div>
        </ScrollArea>
      </aside>
    </TooltipProvider>
  );
}
