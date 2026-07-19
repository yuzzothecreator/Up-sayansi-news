import { Suspense } from "react";
import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ title: "Forgot password", path: "/forgot-password", noIndex: true });

export default function ForgotPasswordPage() {
  return (
    <Suspense>
      <ForgotPasswordForm />
    </Suspense>
  );
}
