"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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
import { SocialAuthButtons } from "@/components/auth/social-auth-buttons";
import { signUp } from "@/lib/auth-client";
import { signUpSchema } from "@/lib/validators/auth";
import type { SignUpInput } from "@/lib/validators/auth";

export function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { name: "", email: "", password: "", confirmPassword: "" },
  });

  function onSubmit(values: SignUpInput) {
    startTransition(async () => {
      const { error } = await signUp.email({
        email: values.email,
        password: values.password,
        name: values.name,
        callbackURL: "/",
      });
      if (error) {
        toast.error(error.message ?? "Registration failed");
      } else {
        toast.success("Account created — welcome!");
        router.push("/");
        router.refresh();
      }
    });
  }

  return (
    <AuthShell
      title="Create your account"
      description="Join UpSayansi News and start reading great stories"
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">Sign in</Link>
        </>
      }
    >
      <SocialAuthButtons callbackURL="/" className="mb-6" />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Name</FormLabel><FormControl><Input placeholder="Your name" className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" placeholder="you@example.com" className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="password" render={({ field }) => (
            <FormItem><FormLabel>Password</FormLabel><FormControl><Input type="password" className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="confirmPassword" render={({ field }) => (
            <FormItem><FormLabel>Confirm password</FormLabel><FormControl><Input type="password" className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <Button type="submit" disabled={isPending} className="w-full rounded-xl">
            {isPending ? <Loader2 className="size-4 animate-spin" /> : "Create account"}
          </Button>
        </form>
      </Form>
    </AuthShell>
  );
}
