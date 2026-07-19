"use client";

import Link from "next/link";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { AuthShell } from "@/components/auth/auth-shell";

export function VerifyEmailForm() {
  return (
    <AuthShell
      title="Verify your email"
      description="We sent a verification link to your email"
      footer={<Link href="/login" className="font-medium text-primary hover:underline">Back to sign in</Link>}
    >
      <div className="space-y-4 text-center text-sm text-muted-foreground">
        <p>Click the link in your email to verify your account. Didn&apos;t receive it?</p>
        <Button variant="outline" className="rounded-xl" onClick={() => toast.info("Check your spam folder")}>
          Resend verification email
        </Button>
      </div>
    </AuthShell>
  );
}
