"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { AuthShell } from "@/components/auth/auth-shell";
import { resetPassword } from "@/lib/auth-client";
import { resetPasswordSchema } from "@/lib/validators/auth";
import type { ResetPasswordInput } from "@/lib/validators/auth";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [isPending, startTransition] = useTransition();

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token, password: "", confirmPassword: "" },
  });

  function onSubmit(values: ResetPasswordInput) {
    startTransition(async () => {
      const result = await resetPassword({ newPassword: values.password, token: values.token });
      if (result.error) {
        toast.error(result.error.message ?? "Reset failed");
      } else {
        toast.success("Password updated! You can now sign in.");
        router.push("/login");
      }
    });
  }

  return (
    <AuthShell
      title="Set new password"
      description="Choose a strong password for your account"
      footer={<Link href="/login" className="font-medium text-primary hover:underline">Back to sign in</Link>}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <input type="hidden" {...form.register("token")} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem><FormLabel>New password</FormLabel><FormControl><Input type="password" className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem><FormLabel>Confirm password</FormLabel><FormControl><Input type="password" className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" disabled={isPending} className="w-full rounded-xl">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Update password"}
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}
