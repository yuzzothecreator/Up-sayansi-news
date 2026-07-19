"use client";

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
import {
  Bold,
  Code,
  Heading2,
  ImageIcon,
  Italic,
  Link2,
  List,
  ListOrdered,
  Quote,
  TableIcon,
  Video,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { EDITOR_PLACEHOLDER } from "@/lib/constants";
import { cn } from "@/lib/utils";

const lowlight = createLowlight(common);

type RichTextEditorProps = {
  content?: Record<string, unknown>;
  onChange?: (content: Record<string, unknown>) => void;
  className?: string;
  editable?: boolean;
};

export function RichTextEditor({
  content,
  onChange,
  className,
  editable = true,
}: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      CodeBlockLowlight.configure({ lowlight }),
      Image.configure({ HTMLAttributes: { class: "rounded-lg max-w-full" } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-primary underline" } }),
      Placeholder.configure({ placeholder: EDITOR_PLACEHOLDER }),
      Typography,
      Youtube.configure({ HTMLAttributes: { class: "rounded-lg overflow-hidden" } }),
      Table.configure({ resizable: true }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content,
    editable,
    immediatelyRender: false,
    onUpdate: ({ editor: e }) => {
      onChange?.(e.getJSON() as Record<string, unknown>);
    },
    editorProps: {
      attributes: {
        class: "prose-pulse min-h-[300px] max-w-none px-4 py-3 focus:outline-none",
      },
    },
  });

  if (!editor) return null;

  const ed = editor;

  function addImage() {
    const url = window.prompt("Image URL");
    if (url) ed.chain().focus().setImage({ src: url }).run();
  }

  function addLink() {
    const url = window.prompt("Link URL");
    if (url) ed.chain().focus().setLink({ href: url }).run();
  }

  function addYoutube() {
    const url = window.prompt("YouTube URL");
    if (url) ed.chain().focus().setYoutubeVideo({ src: url }).run();
  }

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border/50 bg-card shadow-soft", className)}>
      {editable && (
        <div className="flex flex-wrap items-center gap-1 border-b border-border/50 p-2">
          <Button type="button" variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => editor.chain().focus().toggleBold().run()} data-active={editor.isActive("bold")}>
            <Bold className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 className="size-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button type="button" variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => editor.chain().focus().toggleBlockquote().run()}>
            <Quote className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => editor.chain().focus().toggleCodeBlock().run()}>
            <Code className="size-4" />
          </Button>
          <Separator orientation="vertical" className="mx-1 h-6" />
          <Button type="button" variant="ghost" size="icon" className="size-8 rounded-lg" onClick={addLink}>
            <Link2 className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="size-8 rounded-lg" onClick={addImage}>
            <ImageIcon className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="size-8 rounded-lg" onClick={addYoutube}>
            <Video className="size-4" />
          </Button>
          <Button type="button" variant="ghost" size="icon" className="size-8 rounded-lg" onClick={() => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()}>
            <TableIcon className="size-4" />
          </Button>
        </div>
      )}
      <EditorContent editor={editor} />
    </div>
  );
}
