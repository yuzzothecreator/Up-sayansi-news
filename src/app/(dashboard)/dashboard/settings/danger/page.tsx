import { PageHeader } from "@/features/dashboard/page-header";
import { SettingsNav } from "@/features/dashboard/settings-nav";
import { DeleteAccountForm } from "@/features/dashboard/delete-account-form";

export default function DashboardDangerPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Danger zone"
        description="Irreversible actions for your account."
      />
      <SettingsNav />
      <DeleteAccountForm />
    </div>
  );
}
