import { sanitizeHtml } from "@/lib/sanitize";
import { cn } from "@/lib/utils";

type ProseRendererProps = {
  html: string;
  className?: string;
};

export function ProseRenderer({ html, className }: ProseRendererProps) {
  const safe = sanitizeHtml(html);

  return (
    <div
      className={cn("prose-pulse max-w-none", className)}
      dangerouslySetInnerHTML={{ __html: safe }}
    />
  );
}
