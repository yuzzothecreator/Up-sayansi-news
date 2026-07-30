import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type LogoProps = {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
};

const textSizes = {
  sm: "text-base",
  md: "text-lg",
  lg: "text-2xl",
} as const;

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group inline-flex items-center rounded-md outline-none",
        "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        className,
      )}
      aria-label={`${siteConfig.name} home`}
    >
      {showText ? (
        <span
          className={cn(
            "font-semibold tracking-tight text-foreground transition-opacity group-hover:opacity-80",
            textSizes[size],
          )}
        >
          UpSayansi{" "}
          <span className="text-[#05423a] dark:text-[#5eead4]">News</span>
        </span>
      ) : (
        <span
          className={cn(
            "font-bold tracking-tight text-[#05423a] dark:text-[#5eead4]",
            textSizes[size],
          )}
        >
          U
        </span>
      )}
    </Link>
  );
}
