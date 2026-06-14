import { formatOsLabel, formatPortsSummary } from "@/lib/format-ports";
import type { InventoryDevice } from "@/lib/inventory/queries";
import { StatusBadge } from "@/components/ui/badge";

interface InventoryTableProps {
  devices: InventoryDevice[];
  groupLabel?: string;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function InventoryTable({ devices, groupLabel }: InventoryTableProps) {
  return (
    <div>
      {groupLabel ? (
        <p className="text-label border-border border-b px-4 py-2">{groupLabel}</p>
      ) : null}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-border text-muted-foreground border-b text-left">
              <th className="px-4 py-3 font-medium">Dispositivo</th>
              <th className="px-4 py-3 font-medium">Fabricante</th>
              <th className="px-4 py-3 font-medium">Sistema</th>
              <th className="px-4 py-3 font-medium">Portas</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Última descoberta</th>
            </tr>
          </thead>
          <tbody>
            {devices.map((device) => (
              <tr
                key={device.id}
                className="border-border hover:bg-muted/40 border-b last:border-0"
              >
                <td className="px-4 py-3">
                  <p className="font-mono font-medium">{device.ip}</p>
                  <p className="text-caption">
                    {device.hostname ?? device.mac_address ?? "Sem identificação"}
                  </p>
                </td>
                <td className="px-4 py-3">{device.vendor ?? "—"}</td>
                <td className="text-caption px-4 py-3">
                  {formatOsLabel(device.os_name, device.os_accuracy, device.os_family)}
                </td>
                <td className="px-4 py-3 font-mono text-xs">
                  {formatPortsSummary(device.ports ?? []) || "—"}
                </td>
                <td className="px-4 py-3">
                  <StatusBadge status={device.status} />
                </td>
                <td className="text-muted-foreground px-4 py-3">
                  {formatDate(device.first_seen_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
