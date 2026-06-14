import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";
import type { Severity } from "@/types";
import { severityLabel } from "@/lib/risks/labels";

const badgeVariants = cva("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", {
  variants: {
    variant: {
      default: "bg-muted text-muted-foreground",
      primary: "bg-primary/15 text-primary",
      success: "bg-success/15 text-success",
      warning: "bg-warning/15 text-warning",
      danger: "bg-danger/15 text-danger",
      info: "bg-info/15 text-info",
      outline: "border border-border text-muted-foreground",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

interface StatusBadgeProps {
  status: "online" | "offline" | string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const isOnline = status === "online";
  return (
    <Badge variant={isOnline ? "success" : "default"}>{isOnline ? "Online" : "Offline"}</Badge>
  );
}

const SEVERITY_VARIANT: Record<
  Severity,
  NonNullable<VariantProps<typeof badgeVariants>["variant"]>
> = {
  high: "danger",
  medium: "warning",
  low: "info",
};

export function SeverityBadge({ severity }: { severity: Severity }) {
  return <Badge variant={SEVERITY_VARIANT[severity]}>{severityLabel(severity)}</Badge>;
}
