import Link from "next/link";
import type { RiskRecord } from "@/lib/risks/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldAlert } from "lucide-react";

interface RisksTableProps {
  risks: RiskRecord[];
}

export function RisksTable({ risks }: RisksTableProps) {
  if (risks.length === 0) {
    return (
      <EmptyState
        icon={ShieldAlert}
        title="Nenhum risco encontrado"
        description="Não há riscos com os filtros atuais. Execute scans para detectar exposições na rede."
        actionLabel="Ver inventário"
        actionHref="/inventory"
      />
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading-3">Riscos detectados</CardTitle>
        <CardDescription>{risks.length} risco(s) listado(s)</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {risks.map((risk) => (
          <div
            key={risk.id}
            className="border-border hover:border-primary/30 rounded-lg border p-4 transition-colors"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <SeverityBadge severity={risk.severity} />
                  <p className="text-sm font-medium">{risk.title}</p>
                  {risk.portNumber ? (
                    <span className="text-caption font-mono">:{risk.portNumber}</span>
                  ) : null}
                </div>
                <p className="text-body text-muted-foreground">{risk.description}</p>
              </div>
              <Link
                href={`/inventory/${encodeURIComponent(risk.deviceIp)}`}
                className="text-primary shrink-0 font-mono text-sm hover:underline"
              >
                {risk.deviceIp}
              </Link>
            </div>
            <p className="text-caption mt-3">
              <span className="text-foreground font-medium">Recomendação:</span>{" "}
              {risk.recommendation}
            </p>
            {risk.deviceHostname ? (
              <p className="text-caption mt-1">{risk.deviceHostname}</p>
            ) : null}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
