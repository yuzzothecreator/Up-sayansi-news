"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  createCategoryAction,
  deleteCategoryAction,
  updateCategoryAction,
} from "@/actions/admin";
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
import type { Category } from "@prisma/client";

type CategoryManagerProps = {
  categories: Array<Category & { _count?: { posts: number } }>;
};

export function CategoryManager({ categories }: CategoryManagerProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleCreate = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await createCategoryAction({
        name: formData.get("name") as string,
        color: (formData.get("color") as string) || null,
        description: (formData.get("description") as string) || null,
      });
      if (!result.success) {
        toast.error(result.error ?? "Failed to create category");
        return;
      }
      toast.success("Category created");
      (event.target as HTMLFormElement).reset();
      router.refresh();
    });
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Delete this category?")) return;
    startTransition(async () => {
      const result = await deleteCategoryAction(id);
      if (!result.success) {
        toast.error(result.error ?? "Failed to delete");
        return;
      }
      toast.success("Category deleted");
      router.refresh();
    });
  };

  const handleUpdate = (id: string, name: string) => {
    startTransition(async () => {
      const result = await updateCategoryAction(id, { name });
      if (!result.success) {
        toast.error(result.error ?? "Failed to update");
        return;
      }
      toast.success("Category updated");
      router.refresh();
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add category</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreate} className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" required placeholder="Technology" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input id="color" name="color" type="color" defaultValue="#3b82f6" />
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
            {categories.map((cat) => (
              <TableRow key={cat.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {cat.color && (
                      <span
                        className="size-3 rounded-full"
                        style={{ backgroundColor: cat.color }}
                      />
                    )}
                    <Input
                      defaultValue={cat.name}
                      className="h-8 max-w-xs"
                      onBlur={(e) => {
                        if (e.target.value !== cat.name) {
                          handleUpdate(cat.id, e.target.value);
                        }
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="text-muted-foreground">{cat.slug}</TableCell>
                <TableCell>{cat._count?.posts ?? 0}</TableCell>
                <TableCell>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-8 text-destructive"
                    onClick={() => handleDelete(cat.id)}
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
