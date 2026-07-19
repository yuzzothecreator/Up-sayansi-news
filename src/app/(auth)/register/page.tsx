import { Suspense } from "react";
import { RegisterForm } from "@/components/auth/register-form";
import { createMetadata } from "@/lib/metadata";

export const metadata = createMetadata({ title: "Create account", path: "/register", noIndex: true });

export default function RegisterPage() {
  return (
    <Suspense>
      <RegisterForm />
    </Suspense>
  );
}
