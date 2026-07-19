"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { contactFormSchema } from "@/lib/validators/common";
import type { ContactFormInput } from "@/lib/validators/common";

export function ContactForm() {
  const [isPending, startTransition] = useTransition();

  const form = useForm<ContactFormInput>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { name: "", email: "", subject: "", message: "" },
  });

  function onSubmit(values: ContactFormInput) {
    startTransition(async () => {
      await new Promise((r) => setTimeout(r, 800));
      toast.success("Message sent! We'll get back to you soon.");
      form.reset();
      void values;
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem><FormLabel>Name</FormLabel><FormControl><Input className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
          <FormField control={form.control} name="email" render={({ field }) => (
            <FormItem><FormLabel>Email</FormLabel><FormControl><Input type="email" className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
          )} />
        </div>
        <FormField control={form.control} name="subject" render={({ field }) => (
          <FormItem><FormLabel>Subject</FormLabel><FormControl><Input className="rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <FormField control={form.control} name="message" render={({ field }) => (
          <FormItem><FormLabel>Message</FormLabel><FormControl><Textarea className="min-h-[140px] rounded-xl" {...field} /></FormControl><FormMessage /></FormItem>
        )} />
        <Button type="submit" disabled={isPending} className="w-full rounded-xl">
          {isPending ? <Loader2 className="size-4 animate-spin" /> : "Send message"}
        </Button>
      </form>
    </Form>
  );
}
