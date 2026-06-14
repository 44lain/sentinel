import type { InventoryDevice } from "@/lib/inventory/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Clock } from "lucide-react";

interface DiscoveryTimelineProps {
  devices: InventoryDevice[];
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function DiscoveryTimeline({ devices }: DiscoveryTimelineProps) {
  if (devices.length === 0) return null;

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-heading-3 flex items-center gap-2">
          <Clock className="text-muted-foreground size-4" />
          Descobertas recentes
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ol className="border-border relative space-y-4 border-l pl-4">
          {devices.map((device) => (
            <li key={device.id} className="relative">
              <span className="bg-primary absolute top-1.5 -left-[1.3rem] size-2 rounded-full" />
              <p className="font-mono text-sm font-medium">{device.ip}</p>
              <p className="text-caption">
                {device.hostname ?? device.vendor ?? "Dispositivo"} ·{" "}
                {formatDate(device.first_seen_at)}
              </p>
            </li>
          ))}
        </ol>
      </CardContent>
    </Card>
  );
}
