import { listAdsAction } from "@/actions/admin";
import { AdManager } from "@/features/admin/ad-manager";

export default async function AdminAdsPage() {
  const result = await listAdsAction();
  const ads = result.success ? result.data! : [];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Advertisements</h1>
        <p className="text-sm text-muted-foreground">Manage ad placements across the site.</p>
      </div>
      <AdManager ads={ads} />
    </div>
  );
}
