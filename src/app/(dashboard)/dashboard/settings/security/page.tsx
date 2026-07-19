import { PageHeader } from "@/features/dashboard/page-header";
import { SettingsNav } from "@/features/dashboard/settings-nav";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";

export default function DashboardSecurityPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Security"
        description="Manage your password and account security."
      />
      <SettingsNav />

      <Card>
        <CardHeader>
          <CardTitle>Password</CardTitle>
          <CardDescription>
            Change your password through the account recovery flow.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Account email</Label>
            <Input id="email" type="email" disabled placeholder="Your sign-in email" />
          </div>
          <Button asChild variant="outline">
            <Link href="/forgot-password">Reset password</Link>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Two-factor authentication</CardTitle>
          <CardDescription>
            Add an extra layer of security to your account. Coming soon.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button disabled variant="outline">
            Enable 2FA
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>
            You are currently signed in on this device.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-lg border border-border/50 p-4 text-sm">
            <p className="font-medium">Current session</p>
            <p className="text-muted-foreground">This browser · Active now</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
