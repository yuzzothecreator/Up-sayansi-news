import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PERMISSIONS, ROLE_PERMISSIONS, ROLES, getRoleLabel } from "@/types/auth";
import type { Role } from "@/types/auth";

const roleList = Object.values(ROLES) as Role[];

export default function AdminRolesPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Roles & permissions</h1>
        <p className="text-sm text-muted-foreground">
          Reference for role hierarchy and permission assignments.
        </p>
      </div>

      <div className="grid gap-4">
        {roleList.map((role) => (
          <Card key={role}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{getRoleLabel(role)}</CardTitle>
                <Badge variant="outline">{ROLE_PERMISSIONS[role].length} permissions</Badge>
              </div>
              <CardDescription>
                {role === "ADMINISTRATOR" && "Full platform access"}
                {role === "EDITOR" && "Content moderation and publishing"}
                {role === "AUTHOR" && "Create and manage own posts"}
                {role === "READER" && "Read, comment, engage, and write own posts"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-1.5">
                {ROLE_PERMISSIONS[role].map((permission) => (
                  <Badge key={permission} variant="secondary" className="text-xs font-normal">
                    {permission}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">All permissions</CardTitle>
          <CardDescription>{Object.keys(PERMISSIONS).length} total permissions defined</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(PERMISSIONS).map(([key, label]) => (
              <div key={key} className="rounded-lg border border-border/50 p-3 text-sm">
                <code className="text-xs text-primary">{key}</code>
                <p className="mt-1 text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
