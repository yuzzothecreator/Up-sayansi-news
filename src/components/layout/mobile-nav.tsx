"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { authNav, mainNav } from "@/config/navigation";
import { Logo } from "@/components/shared/logo";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { useSession, signOut } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  trigger: React.ReactNode;
};

export function MobileNav({ trigger }: MobileNavProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <Sheet>
      <SheetTrigger asChild>{trigger}</SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[340px]">
        <SheetHeader>
          <SheetTitle className="text-left">
            <Logo />
          </SheetTitle>
        </SheetHeader>

        <nav className="mt-8 flex flex-col gap-1">
          {[...mainNav, ...authNav].map((item) => {
            const Icon = item.icon;
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent",
                  isActive && "bg-accent text-accent-foreground",
                )}
              >
                {Icon && <Icon className="size-4" />}
                {item.title}
              </Link>
            );
          })}
        </nav>

        <Separator className="my-6" />

        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Theme</span>
          <ThemeToggle variant="menu" />
        </div>

        <Separator className="my-6" />

        {user ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Signed in as {user.email}</p>
            <Button
              variant="outline"
              className="w-full rounded-xl"
              onClick={() =>
                signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.assign("/");
                    },
                  },
                })
              }
            >
              Sign out
            </Button>
          </div>
        ) : (
          <div className="grid gap-2">
            <Button variant="outline" asChild className="rounded-xl">
              <Link href="/login">Sign in</Link>
            </Button>
            <Button asChild className="rounded-xl shadow-soft">
              <Link href="/register">Get started</Link>
            </Button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
