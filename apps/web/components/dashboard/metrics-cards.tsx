"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
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
      tone: "text-primary",
    },
    {
      title: "Portas abertas",
      value: metrics.openPortCount,
      icon: Network,
      description: "No último scan",
      tone: "text-info",
    },
    {
      title: "Riscos",
      value: metrics.riskCount,
      icon: AlertTriangle,
      description: "Detectados",
      tone: metrics.riskCount > 0 ? "text-danger" : "text-success",
    },
    {
      title: "Último scan",
      value: formatLastScan(metrics.lastScanAt),
      icon: Activity,
      description: "Data e hora",
      isText: true,
      tone: "text-brand-cyan",
    },
  ];

  return (
    <StaggerContainer className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <StaggerItem key={card.title}>
          <Card className="hover:border-primary/40 hover:shadow-primary/5 h-full transition-all duration-200 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-caption font-medium">{card.title}</CardTitle>
              <card.icon className={`size-4 ${card.tone}`} />
            </CardHeader>
            <CardContent>
              <p className={card.isText ? "text-lg font-semibold" : "text-3xl font-bold"}>
                {card.value}
              </p>
              <p className="text-muted-foreground text-xs">{card.description}</p>
            </CardContent>
          </Card>
        </StaggerItem>
      ))}
    </StaggerContainer>
  );
}
