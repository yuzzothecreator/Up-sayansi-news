"use client";

import Link from "next/link";
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
import { requestPasswordReset } from "@/lib/auth-client";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import type { ForgotPasswordInput } from "@/lib/validators/auth";

export function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ForgotPasswordInput) {
    startTransition(async () => {
      const { error } = await requestPasswordReset({
        email: values.email,
        redirectTo: "/reset-password",
      });
      if (error) {
        toast.error(error.message ?? "Failed to send reset email");
      } else {
        toast.success("Check your email for a reset link");
      }
    });
  }

  return (
    <AuthShell
      title="Reset your password"
      description="Enter your email and we'll send you a reset link"
      footer={<Link href="/login" className="font-medium text-primary hover:underline">Back to sign in</Link>}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" disabled={isPending} className="w-full rounded-xl">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Send reset link"}
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}
