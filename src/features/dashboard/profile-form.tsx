"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { updateProfileAction } from "@/actions/profile";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UserProfile } from "@/types";

type ProfileFormProps = {
  profile: UserProfile | null;
};

export function ProfileForm({ profile }: ProfileFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateProfileAction({
        name: formData.get("name") as string,
        bio: (formData.get("bio") as string) || null,
        website: (formData.get("website") as string) || null,
        twitter: (formData.get("twitter") as string) || null,
        github: (formData.get("github") as string) || null,
        location: (formData.get("location") as string) || null,
        image: (formData.get("image") as string) || null,
      });

      if (!result.success) {
        toast.error(result.error ?? "Failed to update profile");
        return;
      }
      toast.success("Profile updated");
      router.refresh();
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile information</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display name</Label>
              <Input id="name" name="name" defaultValue={profile?.name ?? ""} required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Avatar URL</Label>
              <Input id="image" name="image" type="url" defaultValue={profile?.image ?? ""} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea id="bio" name="bio" rows={4} defaultValue={profile?.profile?.bio ?? ""} />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input id="website" name="website" type="url" defaultValue={profile?.profile?.website ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" defaultValue={profile?.profile?.location ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter</Label>
              <Input id="twitter" name="twitter" defaultValue={profile?.profile?.twitter ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="github">GitHub</Label>
              <Input id="github" name="github" defaultValue={profile?.profile?.github ?? ""} />
            </div>
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving…" : "Save changes"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
