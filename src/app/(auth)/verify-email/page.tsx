import { VerifyEmailForm } from "@/components/auth/verify-email-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ title: "Verify email", path: "/verify-email", noIndex: true });

export default function VerifyEmailPage() {
  return <VerifyEmailForm />;
}
