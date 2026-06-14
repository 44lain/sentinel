import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { DashboardMetrics } from "@/lib/dashboard/queries";
import { Activity, AlertTriangle, Monitor, Network } from "lucide-react";

interface MetricsCardsProps {
  metrics: DashboardMetrics;
}

function formatLastScan(date: string | null): string {
  if (!date) return "Nenhum scan";
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function MetricsCards({ metrics }: MetricsCardsProps) {
  const cards = [
    {
      title: "Dispositivos",
      value: metrics.deviceCount,
      icon: Monitor,
      description: "No último scan",
    },
    {
      title: "Portas abertas",
      value: metrics.openPortCount,
      icon: Network,
      description: "No último scan",
    },
    {
      title: "Riscos",
      value: metrics.riskCount,
      icon: AlertTriangle,
      description: "Detectados",
    },
    {
      title: "Último scan",
      value: formatLastScan(metrics.lastScanAt),
      icon: Activity,
      description: "Data e hora",
      isText: true,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {card.title}
            </CardTitle>
            <card.icon className="size-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className={card.isText ? "text-lg font-semibold" : "text-3xl font-bold"}>
              {card.value}
            </p>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
