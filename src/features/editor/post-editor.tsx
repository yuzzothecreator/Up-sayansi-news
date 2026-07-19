"use client";

import { useCallback, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Typography from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { common, createLowlight } from "lowlight";
import { Calendar, ImagePlus, Loader2, Save, Send } from "lucide-react";
import { toast } from "sonner";
import { createPostAction, publishPostAction, updatePostAction } from "@/actions/posts";
import { EditorToolbar } from "@/features/editor/editor-toolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EDITOR_PLACEHOLDER } from "@/lib/constants";
import { useKeyboardShortcut } from "@/hooks/use-keyboard-shortcut";
import type { Category, Tag } from "@prisma/client";
import type { TipTapContent } from "@/types";

const lowlight = createLowlight(common);

type PostEditorProps = {
  postId?: string;
  initial?: {
    title?: string;
    subtitle?: string;
    coverImage?: string | null;
    content?: TipTapContent;
    categoryId?: string | null;
    tagIds?: string[];
    status?: string;
    scheduledAt?: Date | null;
  };
  categories: Category[];
  tags: Tag[];
  canPublish?: boolean;
};

export function PostEditor({
  postId,
  initial,
  categories,
  tags,
  canPublish = false,
}: PostEditorProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isPending, startTransition] = useTransition();

  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [coverImage, setCoverImage] = useState(initial?.coverImage ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? "");
  const [selectedTags, setSelectedTags] = useState<string[]>(initial?.tagIds ?? []);
  const [status, setStatus] = useState(initial?.status ?? "DRAFT");
  const [scheduledAt, setScheduledAt] = useState(
    initial?.scheduledAt
      ? new Date(initial.scheduledAt).toISOString().slice(0, 16)
      : "",
  );

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ inline: false, allowBase64: false }),
      Link.configure({ openOnClick: false, autolink: true }),
      Placeholder.configure({ placeholder: EDITOR_PLACEHOLDER }),
      Typography,
      Youtube.configure({ width: 640, height: 360 }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: initial?.content ?? { type: "doc", content: [{ type: "paragraph" }] },
    editorProps: {
      attributes: {
        class:
          "prose-pulse min-h-[320px] max-w-none px-4 py-3 focus:outline-none",
      },
    },
  });

  const uploadImage = useCallback(
    async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("bucket", "posts");

      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const json = await res.json();
      if (!json.success) throw new Error(json.error ?? "Upload failed");
      return json.data.url as string;
    },
    [],
  );

  const handleImageUpload = () => fileInputRef.current?.click();

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !editor) return;

    try {
      const url = await uploadImage(file);
      editor.chain().focus().setImage({ src: url }).run();
      toast.success("Image inserted");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    } finally {
      event.target.value = "";
    }
  };

  const handleCoverUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const url = await uploadImage(file);
      setCoverImage(url);
      toast.success("Cover image uploaded");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Upload failed");
    }
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId],
    );
  };

  const save = (targetStatus?: string) => {
    if (!editor) return;
    if (title.trim().length < 3) {
      toast.error("Title must be at least 3 characters");
      return;
    }

    const content = editor.getJSON() as TipTapContent;
    const finalStatus = targetStatus ?? status;

    startTransition(async () => {
      const payload = {
        title: title.trim(),
        subtitle: subtitle.trim() || null,
        content,
        coverImage: coverImage || null,
        categoryId: categoryId || null,
        tagIds: selectedTags,
        status: finalStatus as "DRAFT" | "PUBLISHED" | "SCHEDULED" | "PENDING_REVIEW",
        scheduledAt: finalStatus === "SCHEDULED" && scheduledAt ? new Date(scheduledAt) : null,
      };

      if (postId) {
        const result = await updatePostAction({ id: postId, ...payload });
        if (!result.success) {
          toast.error(result.error ?? "Failed to save");
          return;
        }

        if (finalStatus !== "DRAFT" && finalStatus !== payload.status) {
          await publishPostAction({
            id: postId,
            status: finalStatus as "PUBLISHED" | "PENDING_REVIEW" | "SCHEDULED",
            scheduledAt: payload.scheduledAt,
          });
        }

        toast.success("Post saved");
        router.push("/dashboard/posts");
        router.refresh();
      } else {
        const result = await createPostAction(payload);
        if (!result.success) {
          toast.error(result.error ?? "Failed to create post");
          return;
        }

        if (finalStatus !== "DRAFT" && result.data) {
          await publishPostAction({
            id: result.data.id,
            status: canPublish ? "PUBLISHED" : "PENDING_REVIEW",
            scheduledAt: payload.scheduledAt,
          });
        }

        toast.success(finalStatus === "DRAFT" ? "Draft saved" : "Post submitted");
        router.push("/dashboard/posts");
        router.refresh();
      }
    });
  };

  useKeyboardShortcut("mod+s", () => save("DRAFT"), { enabled: !isPending });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            {postId ? "Edit post" : "New post"}
          </h1>
          <p className="text-sm text-muted-foreground">
            Write your story. Press ⌘S to save draft.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => save("DRAFT")}
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
            Save draft
          </Button>
          <Button
            onClick={() =>
              save(canPublish ? "PUBLISHED" : "PENDING_REVIEW")
            }
            disabled={isPending}
          >
            {isPending ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Send className="mr-2 size-4" />}
            {canPublish ? "Publish" : "Submit for review"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
        <div className="space-y-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Post title"
            className="h-12 border-0 bg-transparent px-0 text-3xl font-semibold shadow-none focus-visible:ring-0"
          />
          <Input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            placeholder="Subtitle (optional)"
            className="border-0 bg-transparent px-0 text-lg text-muted-foreground shadow-none focus-visible:ring-0"
          />

          <EditorToolbar editor={editor} onImageUpload={handleImageUpload} />

          <Card className="overflow-hidden">
            <EditorContent editor={editor} />
          </Card>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>

        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DRAFT">Draft</SelectItem>
                    {canPublish && <SelectItem value="PUBLISHED">Published</SelectItem>}
                    <SelectItem value="PENDING_REVIEW">Pending review</SelectItem>
                    <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {status === "SCHEDULED" && (
                <div className="space-y-2">
                  <Label htmlFor="scheduledAt">
                    <Calendar className="mr-1 inline size-3.5" />
                    Schedule date
                  </Label>
                  <Input
                    id="scheduledAt"
                    type="datetime-local"
                    value={scheduledAt}
                    onChange={(e) => setScheduledAt(e.target.value)}
                  />
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Cover image</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {coverImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={coverImage}
                  alt="Cover"
                  className="aspect-video w-full rounded-lg object-cover"
                />
              ) : (
                <div className="flex aspect-video items-center justify-center rounded-lg border border-dashed border-border/70 bg-muted/30">
                  <ImagePlus className="size-8 text-muted-foreground" />
                </div>
              )}
              <Input type="file" accept="image/*" onChange={handleCoverUpload} />
              <Textarea
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="Or paste image URL"
                rows={2}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Category</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={categoryId} onValueChange={setCategoryId}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Tags</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant={selectedTags.includes(tag.id) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag.id)}
                  >
                    {tag.name}
                  </Badge>
                ))}
                {tags.length === 0 && (
                  <p className="text-sm text-muted-foreground">No tags available</p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
