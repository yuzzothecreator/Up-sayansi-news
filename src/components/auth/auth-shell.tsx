import { Logo } from "@/components/shared/logo";

export function AuthShell({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  return (
    <div className="w-full max-w-md space-y-8">
      <div className="flex justify-center">
        <Logo size="lg" />
      </div>
      <div className="rounded-2xl border border-border/50 bg-card p-8 shadow-elevated">
        <div className="mb-6 space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
      {footer && <p className="text-center text-sm text-muted-foreground">{footer}</p>}
    </div>
  );
}
