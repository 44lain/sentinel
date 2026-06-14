import { RISK_RULES } from "@/lib/risk-engine";

export interface InventoryPort {
  port_number: number;
  service_name: string | null;
  service_product: string | null;
  service_version: string | null;
}

export interface InventoryDevice {
  id: string;
  scan_id: string;
  ip: string;
  hostname: string | null;
  mac_address: string | null;
  vendor: string | null;
  status: string;
  first_seen_at: string;
  os_name: string | null;
  os_accuracy: number | null;
  os_family: string | null;
  ports: InventoryPort[];
}

export interface InventoryInsights {
  totalUnique: number;
  onlineCount: number;
  offlineCount: number;
  newLast7Days: number;
  criticalPortsCount: number;
  withOpenPorts: number;
}

export type InventoryView = "table" | "cards";
export type InventoryGroupBy = "none" | "vendor" | "status";

const CRITICAL_PORTS = new Set(
  RISK_RULES.filter((rule) => rule.severity === "high" || rule.severity === "medium").flatMap(
    (rule) => rule.ports
  )
);

/** Mantém apenas o registro mais recente por IP (evita duplicatas entre scans). */
export function dedupeDevicesByIp(devices: InventoryDevice[]): InventoryDevice[] {
  const byIp = new Map<string, InventoryDevice>();

  for (const device of devices) {
    const existing = byIp.get(device.ip);
    if (!existing || new Date(device.first_seen_at) > new Date(existing.first_seen_at)) {
      byIp.set(device.ip, device);
    }
  }

  return Array.from(byIp.values()).sort(
    (a, b) => new Date(b.first_seen_at).getTime() - new Date(a.first_seen_at).getTime()
  );
}

export function computeInventoryInsights(devices: InventoryDevice[]): InventoryInsights {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  let onlineCount = 0;
  let offlineCount = 0;
  let newLast7Days = 0;
  let criticalPortsCount = 0;
  let withOpenPorts = 0;

  for (const device of devices) {
    if (device.status === "online") onlineCount++;
    else offlineCount++;

    if (new Date(device.first_seen_at).getTime() >= sevenDaysAgo) {
      newLast7Days++;
    }

    const ports = device.ports ?? [];
    if (ports.length > 0) withOpenPorts++;

    for (const port of ports) {
      if (CRITICAL_PORTS.has(port.port_number)) {
        criticalPortsCount++;
      }
    }
  }

  return {
    totalUnique: devices.length,
    onlineCount,
    offlineCount,
    newLast7Days,
    criticalPortsCount,
    withOpenPorts,
  };
}

export function groupDevices(
  devices: InventoryDevice[],
  groupBy: InventoryGroupBy
): { label: string; devices: InventoryDevice[] }[] {
  if (groupBy === "none") {
    return [{ label: "Todos", devices }];
  }

  const groups = new Map<string, InventoryDevice[]>();

  for (const device of devices) {
    const label =
      groupBy === "vendor"
        ? device.vendor?.trim() || "Fabricante desconhecido"
        : device.status === "online"
          ? "Online"
          : "Offline";

    const list = groups.get(label) ?? [];
    list.push(device);
    groups.set(label, list);
  }

  return Array.from(groups.entries())
    .sort(([a], [b]) => a.localeCompare(b, "pt-BR"))
    .map(([label, groupDevices]) => ({ label, devices: groupDevices }));
}

export function getRecentDiscoveries(devices: InventoryDevice[], limit = 5): InventoryDevice[] {
  return [...devices]
    .sort((a, b) => new Date(b.first_seen_at).getTime() - new Date(a.first_seen_at).getTime())
    .slice(0, limit);
}
