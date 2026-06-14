import { formatOsLabel, formatPortsSummary } from "@/lib/format-ports";
import type { InventoryDevice } from "@/lib/inventory/queries";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";

interface InventoryCardsProps {
  devices: InventoryDevice[];
  groupLabel?: string;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function InventoryCards({ devices, groupLabel }: InventoryCardsProps) {
  return (
    <div className="space-y-4">
      {groupLabel ? <p className="text-label">{groupLabel}</p> : null}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {devices.map((device) => {
          const portsSummary = formatPortsSummary(device.ports ?? []);

          return (
            <Card
              key={device.id}
              className="border-border/80 hover:border-primary/30 transition-colors"
            >
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <CardTitle className="truncate font-mono text-base">{device.ip}</CardTitle>
                    <p className="text-caption truncate">
                      {device.hostname ?? device.vendor ?? "Dispositivo de rede"}
                    </p>
                  </div>
                  <StatusBadge status={device.status} />
                </div>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="text-caption">Sistema</span>
                  <span className="text-right text-xs">
                    {formatOsLabel(device.os_name, device.os_accuracy, device.os_family)}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-caption">Portas</span>
                  <span className="max-w-[60%] truncate text-right font-mono text-xs">
                    {portsSummary || "Nenhuma detectada"}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-caption">Descoberto em</span>
                  <span className="text-muted-foreground text-xs">
                    {formatDate(device.first_seen_at)}
                  </span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
