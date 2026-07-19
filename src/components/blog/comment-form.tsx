"use client";

import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { createCommentAction } from "@/actions/comments";
import { createCommentSchema } from "@/lib/validators/comment";
import type { CreateCommentInput } from "@/lib/validators/comment";
import { cn } from "@/lib/utils";

type CommentFormProps = {
  postId: string;
  parentId?: string;
  onSuccess?: () => void;
  placeholder?: string;
  className?: string;
};

export function CommentForm({
  postId,
  parentId,
  onSuccess,
  placeholder = "Share your thoughts…",
  className,
}: CommentFormProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<CreateCommentInput>({
    resolver: zodResolver(createCommentSchema),
    defaultValues: { postId, parentId, content: "" },
  });

  function onSubmit(values: CreateCommentInput) {
    startTransition(async () => {
      const result = await createCommentAction(values);
      if (result.success) {
        form.reset({ postId, parentId, content: "" });
        toast.success(parentId ? "Reply posted" : "Comment posted");
        onSuccess?.();
      } else {
        toast.error(result.error ?? "Sign in to comment");
      }
    });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={cn("space-y-3", className)}>
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder={placeholder}
                  className="min-h-[100px] resize-none rounded-xl"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end">
          <Button type="submit" disabled={isPending} size="sm" className="rounded-xl gap-2">
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <>
                <Send className="size-4" />
                {parentId ? "Reply" : "Comment"}
              </>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
