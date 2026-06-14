import Link from "next/link";
import { Fragment } from "react";
import { formatOsLabel, formatPortsSummary } from "@/lib/format-ports";
import type { InventoryDevice } from "@/lib/inventory/queries";
import { StatusBadge } from "@/components/ui/badge";

export interface InventoryTableGroup {
  label?: string;
  devices: InventoryDevice[];
}

interface InventoryTableProps {
  groups: InventoryTableGroup[];
  showGroupHeaders?: boolean;
  hideVendorColumn?: boolean;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

export function InventoryTable({
  groups,
  showGroupHeaders = false,
  hideVendorColumn = false,
}: InventoryTableProps) {
  const colCount = hideVendorColumn ? 5 : 6;

  return (
    <div className="overflow-x-auto">
      <table className="w-full table-fixed text-sm">
        <colgroup>
          <col style={{ width: hideVendorColumn ? "26%" : "24%" }} />
          {!hideVendorColumn ? <col style={{ width: "14%" }} /> : null}
          <col style={{ width: hideVendorColumn ? "16%" : "14%" }} />
          <col style={{ width: hideVendorColumn ? "30%" : "26%" }} />
          <col style={{ width: "10%" }} />
          <col style={{ width: hideVendorColumn ? "18%" : "12%" }} />
        </colgroup>
        <thead>
          <tr className="border-border text-muted-foreground border-b text-left">
            <th className="px-4 py-3 font-medium">Dispositivo</th>
            {!hideVendorColumn ? <th className="px-4 py-3 font-medium">Fabricante</th> : null}
            <th className="px-4 py-3 font-medium">Sistema</th>
            <th className="px-4 py-3 font-medium">Portas</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Última descoberta</th>
          </tr>
        </thead>
        <tbody>
          {groups.map((group, groupIndex) => (
            <Fragment key={group.label ?? `group-${groupIndex}`}>
              {showGroupHeaders && group.label ? (
                <tr className="bg-muted/40">
                  <td
                    colSpan={colCount}
                    className="text-label border-border border-b px-4 py-2.5 uppercase"
                  >
                    {group.label}
                  </td>
                </tr>
              ) : null}
              {group.devices.map((device) => (
                <tr
                  key={device.id}
                  className="border-border hover:bg-muted/40 border-b last:border-0"
                >
                  <td className="px-4 py-3">
                    <Link
                      href={`/inventory/${encodeURIComponent(device.ip)}`}
                      className="group block min-w-0"
                    >
                      <p className="text-primary truncate font-mono font-medium group-hover:underline">
                        {device.ip}
                      </p>
                      <p className="text-caption truncate">
                        {device.hostname ?? device.mac_address ?? "Sem identificação"}
                      </p>
                    </Link>
                  </td>
                  {!hideVendorColumn ? (
                    <td className="truncate px-4 py-3">{device.vendor ?? "—"}</td>
                  ) : null}
                  <td className="text-caption truncate px-4 py-3">
                    {formatOsLabel(device.os_name, device.os_accuracy, device.os_family)}
                  </td>
                  <td
                    className="truncate px-4 py-3 font-mono text-xs"
                    title={formatPortsSummary(device.ports ?? [], 99)}
                  >
                    {formatPortsSummary(device.ports ?? []) || "—"}
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={device.status} />
                  </td>
                  <td className="text-muted-foreground truncate px-4 py-3">
                    {formatDate(device.first_seen_at)}
                  </td>
                </tr>
              ))}
            </Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
}
