"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Logo } from "@/components/shared/logo";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { adminNavItems } from "@/features/admin/admin-nav";
import { useSession } from "@/lib/auth-client";

type AdminSidebarProps = {
  collapsed?: boolean;
  onCollapsedChange?: (collapsed: boolean) => void;
  className?: string;
};

export function AdminSidebar({
  collapsed = false,
  onCollapsedChange,
  className,
}: AdminSidebarProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.role as string | undefined;

  const items = adminNavItems.filter(
    (item) => !item.roles || (userRole && item.roles.includes(userRole as never)),
  );

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
          {!collapsed && (
            <div>
              <Logo size="sm" />
              <p className="mt-0.5 px-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Admin
              </p>
            </div>
          )}
          {collapsed && <Logo showText={false} size="sm" className="mx-auto" />}
          {onCollapsedChange && (
            <Button
              variant="ghost"
              size="icon"
              className={cn("rounded-xl", collapsed && "mx-auto mt-2")}
              onClick={() => onCollapsedChange(!collapsed)}
            >
              {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
            </Button>
          )}
        </div>

        <Separator />

        <ScrollArea className="flex-1 px-2 py-4">
          <div className="space-y-1">
            {items.map((item) => {
              const Icon = item.icon;
              const isActive =
                pathname === item.href ||
                (item.href !== "/admin" && pathname.startsWith(item.href));

              const link = (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
                    isActive && "bg-sidebar-accent text-sidebar-accent-foreground shadow-soft",
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
        </ScrollArea>

        {!collapsed && (
          <div className="border-t border-sidebar-border p-3">
            <Button variant="outline" size="sm" className="w-full" asChild>
              <Link href="/dashboard">← Back to dashboard</Link>
            </Button>
          </div>
        )}
      </aside>
    </TooltipProvider>
  );
}
