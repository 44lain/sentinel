import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { RecentDevice } from "@/lib/dashboard/queries";
import { cn } from "@/lib/utils";

interface RecentDevicesTableProps {
  devices: RecentDevice[];
}

function statusBadge(status: RecentDevice["status"]) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        status === "online"
          ? "bg-emerald-500/15 text-emerald-400"
          : "bg-muted text-muted-foreground"
      )}
    >
      {status === "online" ? "Online" : "Offline"}
    </span>
  );
}

export function RecentDevicesTable({ devices }: RecentDevicesTableProps) {
  if (devices.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Dispositivos recentes</CardTitle>
          <CardDescription>Nenhum dispositivo no último scan.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dispositivos recentes</CardTitle>
        <CardDescription>Último scan concluído</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-muted-foreground">
                <th className="px-4 py-3 font-medium">IP</th>
                <th className="px-4 py-3 font-medium">Hostname</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Sistema</th>
                <th className="px-4 py-3 font-medium">Portas abertas</th>
                <th className="px-4 py-3 font-medium">Riscos</th>
              </tr>
            </thead>
            <tbody>
              {devices.map((device) => (
                <tr key={device.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-mono">{device.ip}</td>
                  <td className="px-4 py-3">{device.hostname ?? "—"}</td>
                  <td className="px-4 py-3">{statusBadge(device.status)}</td>
                  <td className="px-4 py-3 text-xs">{device.osLabel}</td>
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
