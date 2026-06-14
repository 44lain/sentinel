import type { DeviceScanHistoryEntry } from "@/lib/devices/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface DeviceScanHistoryProps {
  history: DeviceScanHistoryEntry[];
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function DeviceScanHistory({ history }: DeviceScanHistoryProps) {
  if (history.length <= 1) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-heading-3 flex items-center gap-2">
          <Clock className="text-muted-foreground size-4" />
          Histórico em scans
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="border-border relative space-y-4 border-l pl-4">
          {history.map((entry, index) => (
            <li key={entry.deviceId} className="relative">
              <span
                className={`absolute top-1.5 -left-[1.3rem] size-2 rounded-full ${
                  index === 0 ? "bg-primary" : "bg-muted-foreground/40"
                }`}
              />
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-sm font-medium">
                  {formatDate(entry.scanFinishedAt ?? entry.scanStartedAt)}
                </p>
                <StatusBadge status={entry.status} />
              </div>
              <p className="text-caption">
                Agente {entry.agentName} · {entry.portCount} porta(s)
              </p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
