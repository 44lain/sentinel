import type { Severity } from "@/types";

export function severityLabel(severity: Severity): string {
  const labels: Record<Severity, string> = {
    low: "Baixo",
    medium: "Médio",
    high: "Alto",
  };
  return labels[severity];
}
