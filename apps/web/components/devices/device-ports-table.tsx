import { formatPortLabel } from "@/lib/format-ports";
import type { DevicePort } from "@/lib/devices/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Network } from "lucide-react";

interface DevicePortsTableProps {
  ports: DevicePort[];
}

export function DevicePortsTable({ ports }: DevicePortsTableProps) {
  if (ports.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-heading-3">Portas abertas</CardTitle>
          <CardDescription>
            Nenhuma porta detectada no último scan deste dispositivo.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            icon={Network}
            title="Sem portas abertas"
            description="Execute um scan com perfil standard ou deep para detectar serviços."
          />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading-3">Portas abertas</CardTitle>
        <CardDescription>{ports.length} porta(s) detectada(s) no último scan</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-left">
                <th className="px-4 py-3 font-medium">Porta</th>
                <th className="px-4 py-3 font-medium">Protocolo</th>
                <th className="px-4 py-3 font-medium">Serviço</th>
                <th className="px-4 py-3 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {ports.map((port) => (
                <tr
                  key={port.id}
                  className="border-border hover:bg-muted/40 border-b last:border-0"
                >
                  <td className="px-4 py-3 font-mono font-medium">{port.port_number}</td>
                  <td className="text-caption px-4 py-3 uppercase">{port.protocol}</td>
                  <td className="px-4 py-3 font-mono text-xs">{formatPortLabel(port)}</td>
                  <td className="px-4 py-3">
                    <Badge variant={port.state === "open" ? "success" : "warning"}>
                      {port.state === "open" ? "Aberta" : "Filtrada"}
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
