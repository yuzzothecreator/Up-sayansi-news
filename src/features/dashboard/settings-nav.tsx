"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const settingsLinks = [
  { title: "Profile", href: "/dashboard/settings" },
  { title: "Security", href: "/dashboard/settings/security" },
  { title: "Connected accounts", href: "/dashboard/settings/accounts" },
  { title: "Danger zone", href: "/dashboard/settings/danger" },
];

export function SettingsNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-wrap gap-1 rounded-xl border border-border/60 bg-card p-1 shadow-soft">
      {settingsLinks.map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={cn(
            "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted",
            pathname === link.href && "bg-primary text-primary-foreground hover:bg-primary",
          )}
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
}
