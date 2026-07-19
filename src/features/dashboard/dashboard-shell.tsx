"use client";

import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DashboardSidebar } from "@/features/dashboard/dashboard-sidebar";
import { DashboardTopbar } from "@/features/dashboard/dashboard-topbar";
import { useMediaQuery } from "@/hooks/use-media-query";

type DashboardShellProps = {
  children: React.ReactNode;
  unreadCount?: number;
};

export function DashboardShell({ children, unreadCount }: DashboardShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="flex min-h-dvh bg-background">
      {isDesktop && (
        <DashboardSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      )}

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <DashboardSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <DashboardTopbar
          unreadCount={unreadCount}
          onMenuClick={() => setMobileOpen(true)}
        />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
