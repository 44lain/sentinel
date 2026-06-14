import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  children?: React.ReactNode;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  children,
}: EmptyStateProps) {
  return (
    <div className="border-border bg-card/50 flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-12 text-center">
      <div className="bg-muted mb-4 flex size-12 items-center justify-center rounded-full">
        <Icon className="text-muted-foreground size-6" />
      </div>
      <h3 className="text-heading-3">{title}</h3>
      <p className="text-body text-muted-foreground mt-2 max-w-md">{description}</p>
      {actionLabel && actionHref ? (
        <Link href={actionHref} className={cn(buttonVariants(), "mt-6 inline-flex")}>
          {actionLabel}
        </Link>
      ) : null}
      {children ? <div className="mt-6 w-full max-w-lg">{children}</div> : null}
    </div>
  );
}
