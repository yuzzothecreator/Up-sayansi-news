"use client";

import { useState } from "react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { AdminSidebar } from "@/features/admin/admin-sidebar";
import { AdminTopbar } from "@/features/admin/admin-topbar";
import { useMediaQuery } from "@/hooks/use-media-query";

type AdminShellProps = {
  children: React.ReactNode;
  title?: string;
};

export function AdminShell({ children, title }: AdminShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 1024px)");

  return (
    <div className="flex min-h-dvh bg-background">
      {isDesktop && (
        <AdminSidebar collapsed={collapsed} onCollapsedChange={setCollapsed} />
      )}

      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent side="left" className="w-64 p-0">
          <AdminSidebar />
        </SheetContent>
      </Sheet>

      <div className="flex min-w-0 flex-1 flex-col">
        <AdminTopbar title={title} onMenuClick={() => setMobileOpen(true)} />
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
