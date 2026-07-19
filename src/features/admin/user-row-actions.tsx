"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { Ban, MoreHorizontal, ShieldCheck, UserCheck } from "lucide-react";
import { toast } from "sonner";
import { banUserAction, unbanUserAction, updateUserRoleAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { UserProfile } from "@/types";
import type { Role } from "@prisma/client";

const ROLES: Role[] = ["READER", "AUTHOR", "EDITOR", "ADMINISTRATOR"];

type UserRowActionsProps = {
  user: UserProfile;
};

export function UserRowActions({ user }: UserRowActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const updateRole = (role: Role) => {
    startTransition(async () => {
      const result = await updateUserRoleAction({ userId: user.id, role });
      if (!result.success) {
        toast.error(result.error ?? "Failed to update role");
        return;
      }
      toast.success(`Role updated to ${role}`);
      router.refresh();
    });
  };

  const ban = () => {
    const reason = window.prompt("Ban reason (optional)") ?? undefined;
    startTransition(async () => {
      const result = await banUserAction({ userId: user.id, reason });
      if (!result.success) {
        toast.error(result.error ?? "Failed to ban user");
        return;
      }
      toast.success("User banned");
      router.refresh();
    });
  };

  const unban = () => {
    startTransition(async () => {
      const result = await unbanUserAction(user.id);
      if (!result.success) {
        toast.error(result.error ?? "Failed to unban user");
        return;
      }
      toast.success("User unbanned");
      router.refresh();
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="size-8" disabled={isPending}>
          <MoreHorizontal className="size-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <ShieldCheck className="mr-2 size-4" />
            Change role
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            {ROLES.map((role) => (
              <DropdownMenuItem
                key={role}
                disabled={user.role === role}
                onClick={() => updateRole(role)}
              >
                {role}
              </DropdownMenuItem>
            ))}
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuSeparator />
        {user.banned ? (
          <DropdownMenuItem onClick={unban}>
            <UserCheck className="mr-2 size-4" />
            Unban user
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem className="text-destructive" onClick={ban}>
            <Ban className="mr-2 size-4" />
            Ban user
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
