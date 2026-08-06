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

/** Brand green sampled from the Up Sayansi NEWS mark */
const BRAND_GREEN = "#084038";

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
      style={{ color: BRAND_GREEN }}
    >
      {showText ? (
        <span
          className={cn(
            "font-semibold tracking-tight transition-opacity group-hover:opacity-80",
            textSizes[size],
          )}
        >
          UpSayansi News
        </span>
      ) : (
        <span className={cn("font-bold tracking-tight", textSizes[size])}>U</span>
      )}
    </Link>
  );
}
