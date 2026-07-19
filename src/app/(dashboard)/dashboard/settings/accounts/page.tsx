import { PageHeader } from "@/features/dashboard/page-header";
import { SettingsNav } from "@/features/dashboard/settings-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Video } from "lucide-react";

const providers = [
  { id: "google", name: "Google", connected: false },
  { id: "github", name: "GitHub", connected: false, icon: Video },
];

export default function DashboardAccountsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Connected accounts"
        description="Link social accounts for easier sign-in."
      />
      <SettingsNav />

      <div className="grid gap-4">
        {providers.map((provider) => {
          const Icon = provider.icon;
          return (
            <Card key={provider.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-3">
                  {Icon && <Icon className="size-5" />}
                  <div>
                    <CardTitle className="text-base">{provider.name}</CardTitle>
                    <CardDescription>Sign in with {provider.name}</CardDescription>
                  </div>
                </div>
                <Badge variant={provider.connected ? "default" : "secondary"}>
                  {provider.connected ? "Connected" : "Not connected"}
                </Badge>
              </CardHeader>
              <CardContent>
                <Button variant={provider.connected ? "outline" : "default"} disabled>
                  {provider.connected ? "Disconnect" : "Connect"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
