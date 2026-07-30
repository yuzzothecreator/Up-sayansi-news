import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type LogoProps = {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "size-7 text-sm",
  md: "size-9 text-base",
  lg: "size-11 text-lg",
};

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center gap-2.5", className)}
      aria-label={`${siteConfig.name} home`}
    >
      <span
        className={cn(
          "gradient-brand inline-flex items-center justify-center rounded-xl font-bold text-primary-foreground shadow-soft transition-transform group-hover:scale-105",
          sizeClasses[size],
        )}
      >
        U
      </span>
      {showText && (
        <span className="text-lg font-semibold tracking-tight">{siteConfig.name}</span>
      )}
    </Link>
  );
}
