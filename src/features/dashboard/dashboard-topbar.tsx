"use client";

import Link from "next/link";
import { Bell, Menu, Plus, Search } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { signOut, useSession } from "@/lib/auth-client";
import { getInitials } from "@/lib/utils";

type DashboardTopbarProps = {
  onMenuClick?: () => void;
  unreadCount?: number;
};

export function DashboardTopbar({ onMenuClick, unreadCount = 0 }: DashboardTopbarProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-4 border-b border-border/60 bg-background/80 px-4 backdrop-blur-xl lg:px-6">
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="size-5" />
        </Button>
        <Button variant="outline" size="sm" className="hidden gap-2 sm:flex" asChild>
          <Link href="/">
            <Search className="size-4" />
            Back to site
          </Link>
        </Button>
      </div>

      <div className="flex items-center gap-2">
        <Button size="sm" className="gap-2" asChild>
          <Link href="/dashboard/posts/new">
            <Plus className="size-4" />
            <span className="hidden sm:inline">New post</span>
          </Link>
        </Button>

        <Button variant="ghost" size="icon" className="relative rounded-xl" asChild>
          <Link href="/dashboard/notifications">
            <Bell className="size-4" />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}
          </Link>
        </Button>

        <ThemeToggle />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative size-9 rounded-full p-0">
              <Avatar className="size-9">
                <AvatarImage src={user?.image ?? undefined} alt={user?.name ?? "User"} />
                <AvatarFallback>{getInitials(user?.name ?? "U")}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5">
              <p className="text-sm font-medium">{user?.name}</p>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link href="/dashboard/settings">Settings</Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/dashboard/posts">My posts</Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => signOut({ fetchOptions: { onSuccess: () => window.location.assign("/") } })}
            >
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
