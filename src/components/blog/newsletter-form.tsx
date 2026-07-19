"use client";

import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Mail } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { subscribeNewsletterAction } from "@/actions/newsletter";
import { subscribeNewsletterSchema } from "@/lib/validators/common";
import type { SubscribeNewsletterInput } from "@/lib/validators/common";
import { cn } from "@/lib/utils";

type NewsletterFormProps = {
  className?: string;
  variant?: "inline" | "stacked";
};

export function NewsletterForm({ className, variant = "inline" }: NewsletterFormProps) {
  const [isPending, startTransition] = useTransition();
  const [subscribed, setSubscribed] = useState(false);

  const form = useForm<SubscribeNewsletterInput>({
    resolver: zodResolver(subscribeNewsletterSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: SubscribeNewsletterInput) {
    startTransition(async () => {
      const result = await subscribeNewsletterAction(values);
      if (result.success) {
        setSubscribed(true);
        form.reset();
        toast.success("You're subscribed! Check your inbox to confirm.");
      } else {
        toast.error(result.error ?? "Something went wrong. Please try again.");
      }
    });
  }

  if (subscribed) {
    return (
      <div className={cn("flex items-center gap-2 text-sm text-primary", className)}>
        <Mail className="size-4" />
        Thanks for subscribing! Check your email to confirm.
      </div>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          variant === "inline" ? "flex flex-col gap-2 sm:flex-row" : "space-y-3",
          className,
        )}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem className="flex-1">
              <FormControl>
                <Input
                  type="email"
                  placeholder="you@example.com"
                  className="h-11 rounded-xl bg-background/80"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isPending}
          className="h-11 rounded-xl shadow-soft sm:px-6"
        >
          {isPending ? <Loader2 className="size-4 animate-spin" /> : "Subscribe"}
        </Button>
      </form>
    </Form>
  );
}
