import { getMyProfileAction } from "@/actions/profile";
import { PageHeader } from "@/features/dashboard/page-header";
import { SettingsNav } from "@/features/dashboard/settings-nav";
import { ProfileForm } from "@/features/dashboard/profile-form";

export default async function DashboardSettingsPage() {
  const result = await getMyProfileAction();
  const profile = result.success ? result.data : null;

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Settings"
        description="Manage your profile and account preferences."
      />
      <SettingsNav />
      <ProfileForm profile={profile ?? null} />
    </div>
  );
}
