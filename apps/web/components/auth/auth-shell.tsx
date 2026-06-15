import { cn } from "@/lib/utils";

interface AuthShellProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

/** Layout compartilhado para landing e auth — grid discreto + glow de marca. */
export function AuthShell({ children, title, description }: AuthShellProps) {
  return (
    <div className="relative flex min-h-full flex-1 flex-col">
      <div aria-hidden className="cyber-grid-bg pointer-events-none absolute inset-0 opacity-60" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.2_250/0.14),transparent_50%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.72_0.14_195/0.18),transparent_50%)]"
      />
      <div className="relative flex flex-1 flex-col items-center justify-center px-6 py-10">
        {title ? (
          <div className="mb-6 max-w-md text-center">
            <h1 className="text-heading-2">{title}</h1>
            {description ? (
              <p className="text-muted-foreground mt-2 text-sm">{description}</p>
            ) : null}
          </div>
        ) : null}
        {children}
      </div>
    </div>
  );
}

interface AuthCardProps {
  children: React.ReactNode;
  className?: string;
}

export function AuthCard({ children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        "cyber-card cyber-scanline w-full max-w-md rounded-xl border p-0 shadow-lg",
        className
      )}
    >
      {children}
    </div>
  );
}
