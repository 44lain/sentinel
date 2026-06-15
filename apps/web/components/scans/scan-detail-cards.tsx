import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ScanDetail } from "@/lib/scans/queries";
import { Activity, Clock, Monitor, Network } from "lucide-react";

interface ScanDetailCardsProps {
  scan: ScanDetail;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
}

export function ScanDetailCards({ scan }: ScanDetailCardsProps) {
  const cards = [
    {
      title: "Dispositivos",
      value: scan.deviceCount ?? "—",
      icon: Monitor,
    },
    {
      title: "Portas abertas",
      value: scan.openPortCount ?? "—",
      icon: Network,
    },
    {
      title: "Duração",
      value: formatDuration(scan.durationSeconds),
      icon: Clock,
    },
    {
      title: "Agente",
      value: scan.agentName,
      icon: Activity,
      isText: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Badge variant={scan.status === "completed" ? "success" : "warning"}>
          {scan.status === "completed" ? "Concluído" : "Em andamento"}
        </Badge>
        <p className="text-muted-foreground text-sm">
          Início: {formatDate(scan.startedAt)}
          {scan.finishedAt ? ` · Fim: ${formatDate(scan.finishedAt)}` : null}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-caption font-medium">{card.title}</CardTitle>
              <card.icon className="text-muted-foreground size-4" />
            </CardHeader>
            <CardContent>
              <p className={card.isText ? "truncate text-lg font-semibold" : "text-3xl font-bold"}>
                {card.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
