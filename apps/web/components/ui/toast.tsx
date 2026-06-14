"use client";

import { AlertCircle, CheckCircle2, Info, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ToastItem, ToastVariant } from "./toast-provider";

interface ToastViewportProps {
  toasts: ToastItem[];
  onDismiss: (id: string) => void;
}

const VARIANT_STYLES: Record<ToastVariant, string> = {
  default: "border-border bg-card text-foreground",
  success: "border-success/30 bg-success/10 text-foreground",
  error: "border-danger/30 bg-danger/10 text-foreground",
  warning: "border-warning/30 bg-warning/10 text-foreground",
};

function VariantIcon({ variant }: { variant: ToastVariant }) {
  if (variant === "success") return <CheckCircle2 className="text-success size-4" />;
  if (variant === "error") return <AlertCircle className="text-danger size-4" />;
  if (variant === "warning") return <AlertCircle className="text-warning size-4" />;
  return <Info className="text-info size-4" />;
}

export function ToastViewport({ toasts, onDismiss }: ToastViewportProps) {
  if (toasts.length === 0) return null;

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-full max-w-sm flex-col gap-2"
    >
      {toasts.map((toast) => {
        const variant = toast.variant ?? "default";

        return (
          <div
            key={toast.id}
            className={cn(
              "pointer-events-auto flex items-start gap-3 rounded-lg border p-4 shadow-lg backdrop-blur-sm",
              VARIANT_STYLES[variant]
            )}
          >
            <VariantIcon variant={variant} />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{toast.title}</p>
              {toast.description ? (
                <p className="text-caption mt-0.5">{toast.description}</p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={() => onDismiss(toast.id)}
              className="text-muted-foreground hover:text-foreground shrink-0 rounded p-0.5"
              aria-label="Fechar notificação"
            >
              <X className="size-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
