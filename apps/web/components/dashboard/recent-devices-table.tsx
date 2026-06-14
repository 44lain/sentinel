import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import type { RecentDevice } from "@/lib/dashboard/queries";
import { Monitor } from "lucide-react";

interface RecentDevicesTableProps {
  devices: RecentDevice[];
}

export function RecentDevicesTable({ devices }: RecentDevicesTableProps) {
  if (devices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-heading-3">Dispositivos recentes</CardTitle>
          <CardDescription>Nenhum dispositivo no último scan.</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Monitor}
            title="Sem dispositivos no último scan"
            description="Execute um novo scan para atualizar esta lista."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading-3">Dispositivos recentes</CardTitle>
        <CardDescription>Resultado do último scan concluído</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-left">
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium">Hostname</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Sistema</th>
                <th className="px-4 py-3 font-medium">Portas</th>
                <th className="px-4 py-3 font-medium">Riscos</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr
                  key={device.id}
                  className="border-border hover:bg-muted/40 border-b last:border-0"
                >
                  <td className="px-4 py-3 font-mono">{device.ip}</td>
                  <td className="px-4 py-3">{device.hostname ?? "—"}</td>
                  <td className="px-4 py-3">
                    <StatusBadge status={device.status} />
                  </td>
                  <td className="text-caption px-4 py-3">{device.osLabel}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-xs">{device.portsSummary}</span>
                    {device.portCount > 0 ? (
                      <span className="text-muted-foreground ml-2 text-xs">
                        ({device.portCount})
                      </span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 font-mono">{device.riskCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
