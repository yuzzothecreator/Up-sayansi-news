"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  User,
} from "lucide-react";
import { authNav, mainNav, userNav } from "@/config/navigation";
import { Logo } from "@/components/shared/logo";
import { Container } from "@/components/shared/container";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { SearchModal, useSearchModal } from "@/components/search/search-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession, signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function Navbar() {
  const pathname = usePathname();
  const { data: session, isPending } = useSession();
  const { open, setOpen } = useSearchModal();
  const user = session?.user;

  const initials = user?.name
    ?.split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border/50 glass">
        <Container>
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Logo />
              <nav className="hidden items-center gap-1 md:flex">
                {[...mainNav, ...authNav].map((item) => {
                  const isActive =
                    pathname === item.href ||
                    (item.href !== "/" && pathname.startsWith(item.href));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                        isActive && "bg-accent/80 text-accent-foreground",
                      )}
                    >
                      {item.title}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="hidden rounded-xl shadow-soft sm:inline-flex"
                onClick={() => setOpen(true)}
              >
                <Search className="size-4" />
                <span className="text-muted-foreground">Search</span>
                <kbd className="pointer-events-none ml-2 hidden rounded-md border bg-muted px-1.5 py-0.5 text-[10px] font-medium lg:inline-block">
                  ⌘K
                </kbd>
              </Button>

              <Button
                variant="ghost"
                size="icon"
                className="rounded-xl sm:hidden"
                onClick={() => setOpen(true)}
                aria-label="Open search"
              >
                <Search className="size-4" />
              </Button>

              <ThemeToggle className="hidden sm:inline-flex" />

              {isPending ? (
                <div className="size-9 animate-pulse rounded-xl bg-muted" />
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative size-9 rounded-xl p-0">
                      <Avatar className="size-9">
                        <AvatarImage src={user.image ?? undefined} alt={user.name} />
                        <AvatarFallback>{initials ?? "P"}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-muted-foreground">{user.email}</p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard">
                        <LayoutDashboard className="size-4" />
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                    {userNav.map((item) => (
                      <DropdownMenuItem key={item.href} asChild>
                        <Link href={item.href}>
                          {item.title === "Profile" ? (
                            <User className="size-4" />
                          ) : (
                            <Settings className="size-4" />
                          )}
                          {item.title}
                        </Link>
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() =>
                        signOut({
                          fetchOptions: {
                            onSuccess: () => {
                              window.location.assign("/");
                            },
                          },
                        })
                      }
                      className="text-destructive focus:text-destructive"
                    >
                      <LogOut className="size-4" />
                      Sign out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="hidden items-center gap-2 sm:flex">
                  <Button variant="ghost" asChild className="rounded-xl">
                    <Link href="/login">Sign in</Link>
                  </Button>
                  <Button asChild className="rounded-xl shadow-soft">
                    <Link href="/register">Get started</Link>
                  </Button>
                </div>
              )}

              <MobileNav
                trigger={
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-xl md:hidden"
                    aria-label="Open menu"
                  >
                    <Menu className="size-5" />
                  </Button>
                }
              />
            </div>
          </div>
        </Container>
      </header>

      <SearchModal open={open} onOpenChange={setOpen} />
    </>
  );
}
