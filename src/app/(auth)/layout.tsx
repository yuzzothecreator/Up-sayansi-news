import Link from "next/link";
import { Suspense } from "react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-primary/8 blur-3xl" />
      </div>
      <Suspense fallback={<div className="size-8 animate-pulse rounded-full bg-muted" />}>
        {children}
      </Suspense>
      <Link href="/" className="mt-8 text-sm text-muted-foreground hover:text-foreground">
        ← Back to Pulse
      </Link>
    </div>
  );
}
