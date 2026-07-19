import { Suspense } from "react";
import { LoginForm } from "@/components/auth/login-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ title: "Sign in", path: "/login", noIndex: true });

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
