import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { siteConfig } from "@/config/site";

type LogoProps = {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
};

const sizeClasses = {
  sm: "h-9 w-auto",
  md: "h-12 w-auto",
  lg: "h-16 w-auto",
} as const;

const iconSizeClasses = {
  sm: "size-8",
  md: "size-10",
  lg: "size-14",
} as const;

export function Logo({ className, showText = true, size = "md" }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn("group inline-flex items-center", className)}
      aria-label={`${siteConfig.name} home`}
    >
      {showText ? (
        <Image
          src="/logo.png"
          alt={siteConfig.name}
          width={547}
          height={484}
          priority
          className={cn(
            "object-contain transition-transform group-hover:scale-[1.02]",
            sizeClasses[size],
          )}
        />
      ) : (
        <span
          className={cn(
            "relative overflow-hidden transition-transform group-hover:scale-105",
            iconSizeClasses[size],
          )}
        >
          <Image
            src="/logo.png"
            alt={siteConfig.name}
            width={547}
            height={484}
            className="absolute left-0 top-1/2 h-[140%] w-auto max-w-none -translate-y-1/2 object-cover object-left"
          />
        </span>
      )}
    </Link>
  );
}
