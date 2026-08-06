import type { LucideIcon } from "lucide-react";
import {
  Bookmark,
  Compass,
  Home,
  PenLine,
  Settings,
  TrendingUp,
  User,
} from "lucide-react";

export type NavItem = {
  title: string;
  href: string;
  icon?: LucideIcon;
  description?: string;
  requiresAuth?: boolean;
  roles?: Array<"READER" | "AUTHOR" | "EDITOR" | "ADMINISTRATOR">;
};

export const mainNav: NavItem[] = [
  {
    title: "Home",
    href: "/",
    icon: Home,
    description: "Latest stories and featured picks",
  },
  {
    title: "Blog",
    href: "/blog",
    icon: Compass,
    description: "Browse all stories",
  },
  {
    title: "Categories",
    href: "/categories",
    icon: TrendingUp,
    description: "Explore topics",
  },
  {
    title: "Authors",
    href: "/authors",
    icon: User,
    description: "Meet our writers",
  },
];

export const authNav: NavItem[] = [
  {
    title: "Library",
    href: "/dashboard/bookmarks",
    icon: Bookmark,
    description: "Your saved stories and collections",
    requiresAuth: true,
  },
  {
    title: "Write",
    href: "/dashboard/posts/new",
    icon: PenLine,
    description: "Create a new story",
    requiresAuth: true,
  },
];

export const userNav: NavItem[] = [
  {
    title: "Profile",
    href: "/dashboard",
    icon: User,
    requiresAuth: true,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    requiresAuth: true,
  },
];

export const footerNav = {
  product: [
    { title: "About", href: "/about" },
    { title: "Pricing", href: "/pricing" },
    { title: "Newsletter", href: "/newsletter" },
  ],
  resources: [
    { title: "Help Center", href: "/help" },
    { title: "Guidelines", href: "/guidelines" },
    { title: "API", href: "/docs/api" },
  ],
  legal: [
    { title: "Privacy", href: "/privacy" },
    { title: "Terms", href: "/terms" },
    { title: "Cookies", href: "/cookies" },
  ],
} as const;
