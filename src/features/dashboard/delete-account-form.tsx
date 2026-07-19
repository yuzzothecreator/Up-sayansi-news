"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { deleteAccountAction } from "@/actions/dashboard";
import { signOut } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function DeleteAccountForm() {
  const [isPending, startTransition] = useTransition();

  const handleDelete = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const confirm = formData.get("confirm") as string;

    if (confirm !== "DELETE") {
      toast.error('Type "DELETE" to confirm');
      return;
    }

    if (!window.confirm("This permanently deletes your account. Continue?")) return;

    startTransition(async () => {
      const result = await deleteAccountAction();
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete account");
        return;
      }
      toast.success("Account deleted");
      await signOut({ fetchOptions: { onSuccess: () => window.location.assign("/") } });
    });
  };

  return (
    <Card className="border-destructive/40">
      <CardHeader>
        <CardTitle className="text-destructive">Delete account</CardTitle>
        <CardDescription>
          Permanently remove your account and all associated data. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleDelete} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="confirm">Type DELETE to confirm</Label>
            <Input id="confirm" name="confirm" placeholder="DELETE" />
          </div>
          <Button type="submit" variant="destructive" disabled={isPending}>
            {isPending ? "Deleting…" : "Delete my account"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
