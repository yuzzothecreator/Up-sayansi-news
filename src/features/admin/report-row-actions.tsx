"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle, MoreHorizontal, XCircle } from "lucide-react";
import { toast } from "sonner";
import { resolveReportAction } from "@/actions/admin";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ReportRowActionsProps = {
  reportId: string;
};

export function ReportRowActions({ reportId }: ReportRowActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const resolve = (status: "RESOLVED" | "DISMISSED") => {
    startTransition(async () => {
      const result = await resolveReportAction({ id: reportId, status });
      if (!result.success) {
        toast.error(result.error ?? "Failed to resolve report");
        return;
      }
      toast.success(status === "RESOLVED" ? "Report resolved" : "Report dismissed");
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
        <DropdownMenuItem onClick={() => resolve("RESOLVED")}>
          <CheckCircle className="mr-2 size-4" />
          Resolve
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => resolve("DISMISSED")}>
          <XCircle className="mr-2 size-4" />
          Dismiss
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
