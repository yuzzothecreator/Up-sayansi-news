import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { hasMinimumRole } from "@/types/auth";
import { AppProviders } from "@/providers/app-providers";
import { AdminShell } from "@/features/admin/admin-shell";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?callbackUrl=/admin");
  }

  if (!hasMinimumRole(user.role, "EDITOR")) {
    redirect("/dashboard");
  }

  return (
    <AppProviders initialUser={user}>
      <AdminShell>{children}</AdminShell>
    </AppProviders>
  );
}
