import { cn } from "@/lib/utils";

type DataTableProps = {
  children: React.ReactNode;
  className?: string;
};

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/60 bg-card shadow-soft",
        className,
      )}
    >
      {children}
    </div>
  );
}
