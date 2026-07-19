"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createAdAction, deleteAdAction, updateAdAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/features/admin/data-table";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import { AD_PLACEMENTS } from "@/lib/constants";
import type { Advertisement, AdvertisementPlacement } from "@prisma/client";

type AdManagerProps = {
  ads: Advertisement[];
};

export function AdManager({ ads }: AdManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [placement, setPlacement] = useState<AdvertisementPlacement>("SIDEBAR");

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createAdAction({
        title: formData.get("title") as string,
        linkUrl: formData.get("linkUrl") as string,
        imageUrl: (formData.get("imageUrl") as string) || undefined,
        placement,
        priority: Number(formData.get("priority") || 0),
      });
      if (!result.success) {
        toast.error(result.error ?? "Failed to create ad");
        return;
      }
      toast.success("Ad created");
      (event.target as HTMLFormElement).reset();
      router.refresh();
    });
  };

  const toggleActive = (ad: Advertisement) => {
    startTransition(async () => {
      const result = await updateAdAction({ id: ad.id, active: !ad.active });
      if (!result.success) {
        toast.error(result.error ?? "Failed to update");
        return;
      }
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this ad?")) return;
    startTransition(async () => {
      const result = await deleteAdAction(id);
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete");
        return;
      }
      toast.success("Ad deleted");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Create advertisement</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="linkUrl">Link URL</Label>
              <Input id="linkUrl" name="linkUrl" type="url" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input id="imageUrl" name="imageUrl" type="url" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="placement">Placement</Label>
              <Select value={placement} onValueChange={(v) => setPlacement(v as AdvertisementPlacement)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AD_PLACEMENTS.map((p) => (
                    <SelectItem key={p} value={p}>
                      {p.replace("_", " ")}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="priority">Priority</Label>
              <Input id="priority" name="priority" type="number" defaultValue={0} />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={isPending}>
                Create ad
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <DataTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Placement</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Active</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id}>
                <TableCell className="font-medium">{ad.title}</TableCell>
                <TableCell>{ad.placement.replace("_", " ")}</TableCell>
                <TableCell>{ad.priority}</TableCell>
                <TableCell>
                  <Switch checked={ad.active} onCheckedChange={() => toggleActive(ad)} />
                </TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive"
                    onClick={() => handleDelete(ad.id)}
                    disabled={isPending}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DataTable>
    </div>
  );
}
