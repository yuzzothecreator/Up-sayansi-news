"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createTagAction, deleteTagAction, updateTagAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DataTable } from "@/features/admin/data-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Trash2 } from "lucide-react";
import type { Tag } from "@prisma/client";

type TagManagerProps = {
  tags: Array<Tag & { _count?: { posts: number } }>;
};

export function TagManager({ tags }: TagManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createTagAction({ name: formData.get("name") as string });
      if (!result.success) {
        toast.error(result.error ?? "Failed to create tag");
        return;
      }
      toast.success("Tag created");
      (event.target as HTMLFormElement).reset();
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this tag?")) return;
    startTransition(async () => {
      const result = await deleteTagAction(id);
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete");
        return;
      }
      toast.success("Tag deleted");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add tag</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="flex gap-3">
            <div className="flex-1 space-y-2">
              <Label htmlFor="tagName">Name</Label>
              <Input id="tagName" name="name" required placeholder="javascript" />
            </div>
            <div className="flex items-end">
              <Button type="submit" disabled={isPending}>
                Create
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <DataTable>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Posts</TableHead>
              <TableHead className="w-24" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {tags.map((tag) => (
              <TableRow key={tag.id}>
                <TableCell>
                  <Input
                    defaultValue={tag.name}
                    className="h-8 max-w-xs"
                    onBlur={(e) => {
                      if (e.target.value !== tag.name) {
                        startTransition(async () => {
                          const result = await updateTagAction(tag.id, { name: e.target.value });
                          if (result.success) {
                            toast.success("Tag updated");
                            router.refresh();
                          }
                        });
                      }
                    }}
                  />
                </TableCell>
                <TableCell className="text-muted-foreground">{tag.slug}</TableCell>
                <TableCell>{tag._count?.posts ?? 0}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive"
                    onClick={() => handleDelete(tag.id)}
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
