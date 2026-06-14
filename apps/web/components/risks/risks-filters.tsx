"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { RiskSeverityFilter } from "@/lib/risks/queries";

const FILTERS: { value: RiskSeverityFilter; label: string }[] = [
  { value: "all", label: "Todos" },
  { value: "high", label: "Alto" },
  { value: "medium", label: "Médio" },
  { value: "low", label: "Baixo" },
];

function buildHref(severity: RiskSeverityFilter) {
  return severity === "all" ? "/risks" : `/risks?severity=${severity}`;
}

export function RisksFilters({ severity }: { severity: RiskSeverityFilter }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (pathname !== "/risks") return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-caption">Severidade:</span>
      {FILTERS.map((filter) => (
        <Link
          key={filter.value}
          href={buildHref(filter.value)}
          className={cn(
            "inline-flex items-center rounded-md border px-3 py-1.5 text-xs font-medium transition-colors",
            severity === filter.value
              ? "border-primary bg-primary/10 text-primary"
              : "border-border text-muted-foreground hover:bg-muted"
          )}
        >
          {filter.label}
        </Link>
      ))}
      {searchParams.get("severity") ? (
        <Link href="/risks" className="text-caption text-muted-foreground hover:text-foreground">
          Limpar filtro
        </Link>
      ) : null}
    </div>
  );
}
