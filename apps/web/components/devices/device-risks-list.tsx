import Link from "next/link";
import type { DeviceRisk } from "@/lib/devices/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SeverityBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { ShieldCheck } from "lucide-react";

interface DeviceRisksListProps {
  risks: DeviceRisk[];
}

export function DeviceRisksList({ risks }: DeviceRisksListProps) {
  if (risks.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-heading-3">Riscos</CardTitle>
          <CardDescription>Nenhum risco detectado para este dispositivo.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={ShieldCheck}
            title="Nenhum risco identificado"
            description="Isso não elimina a necessidade de revisar portas e serviços expostos."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading-3">Riscos</CardTitle>
        <CardDescription>{risks.length} risco(s) detectado(s) no último scan</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {risks.map((risk) => (
          <div
            key={risk.id}
            className="border-border hover:border-primary/30 rounded-lg border p-4 transition-colors"
          >
            <div className="flex flex-wrap items-center gap-2">
              <SeverityBadge severity={risk.severity} />
              <p className="text-sm font-medium">{risk.title}</p>
              {risk.port_number ? (
                <span className="text-caption font-mono">:{risk.port_number}</span>
              ) : null}
            </div>
            <p className="text-body text-muted-foreground mt-2">{risk.description}</p>
            <p className="text-caption mt-2">
              <span className="text-foreground font-medium">Recomendação:</span>{" "}
              {risk.recommendation}
            </p>
          </div>
        ))}
        <Link href="/risks" className="text-primary text-caption hover:underline">
          Ver todos os riscos da rede →
        </Link>
      </CardContent>
    </Card>
  );
}
