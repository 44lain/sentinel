import { createClient } from "@/lib/supabase/server";
import { formatOsLabel, formatPortsSummary } from "@/lib/format-ports";
import type { DeviceStatus, Severity } from "@/types";

export type DashboardMetrics = {
  deviceCount: number;
  openPortCount: number;
  riskCount: number;
  lastScanAt: string | null;
};

export type RecentDevice = {
  id: string;
  ip: string;
  hostname: string | null;
  status: DeviceStatus;
  portCount: number;
  portsSummary: string;
  osLabel: string;
  riskCount: number;
};

export async function getDashboardMetrics(): Promise<DashboardMetrics> {
  const supabase = await createClient();

  const { data: latestScan } = await supabase
    .from("scans")
    .select("id, finished_at, device_count, open_port_count, started_at")
    .not("finished_at", "is", null)
    .order("finished_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latestScan) {
    return {
      deviceCount: 0,
      openPortCount: 0,
      riskCount: 0,
      lastScanAt: null,
    };
  }

  const { data: devices } = await supabase
    .from("devices")
    .select("id")
    .eq("scan_id", latestScan.id);

  const deviceIds = devices?.map((d) => d.id) ?? [];
  let riskCount = 0;

  if (deviceIds.length > 0) {
    const { count } = await supabase
      .from("risks")
      .select("id", { count: "exact", head: true })
      .in("device_id", deviceIds);
    riskCount = count ?? 0;
  }

  return {
    deviceCount: latestScan.device_count ?? 0,
    openPortCount: latestScan.open_port_count ?? 0,
    riskCount,
    lastScanAt: latestScan.finished_at ?? latestScan.started_at,
  };
}

export async function getRecentDevices(limit = 5): Promise<RecentDevice[]> {
  const supabase = await createClient();

  const { data: latestScan } = await supabase
    .from("scans")
    .select("id")
    .not("finished_at", "is", null)
    .order("finished_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (!latestScan) return [];

  const { data: devices, error: devicesError } = await supabase
    .from("devices")
    .select("id, ip, hostname, status, os_name, os_accuracy, os_family")
    .eq("scan_id", latestScan.id)
    .order("ip")
    .limit(limit);

  if (devicesError) {
    console.error("[dashboard] devices query failed:", devicesError.message);
    return [];
  }

  if (!devices?.length) return [];

  const deviceIds = devices.map((d) => d.id);

  const { data: portRows, error: portsError } = await supabase
    .from("ports")
    .select("device_id, port_number, service_name, service_product, service_version")
    .in("device_id", deviceIds)
    .order("port_number");

  if (portsError) {
    console.error("[dashboard] ports query failed:", portsError.message);
  }

  const { data: riskCounts } = await supabase
    .from("risks")
    .select("device_id, severity")
    .in("device_id", deviceIds);

  const portsByDevice = new Map<
    string,
    {
      port_number: number;
      service_name: string | null;
      service_product: string | null;
      service_version: string | null;
    }[]
  >();
  for (const row of portRows ?? []) {
    const list = portsByDevice.get(row.device_id) ?? [];
    list.push({
      port_number: row.port_number,
      service_name: row.service_name,
      service_product: row.service_product,
      service_version: row.service_version,
    });
    portsByDevice.set(row.device_id, list);
  }

  const risksByDevice = new Map<string, number>();
  for (const row of riskCounts ?? []) {
    risksByDevice.set(row.device_id, (risksByDevice.get(row.device_id) ?? 0) + 1);
  }

  return devices.map((device) => {
    const ports = portsByDevice.get(device.id) ?? [];
    return {
      id: device.id,
      ip: device.ip,
      hostname: device.hostname,
      status: device.status as DeviceStatus,
      portCount: ports.length,
      portsSummary: formatPortsSummary(ports),
      osLabel: formatOsLabel(device.os_name, device.os_accuracy, device.os_family),
      riskCount: risksByDevice.get(device.id) ?? 0,
    };
  });
}

export async function hasAnyScan(): Promise<boolean> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("scans")
    .select("id", { count: "exact", head: true })
    .not("finished_at", "is", null)
    .limit(1);

  if (error) {
    console.error("[dashboard] hasAnyScan failed:", error.message);
    return false;
  }

  return (count ?? 0) > 0;
}

export function severityLabel(severity: Severity): string {
  const labels: Record<Severity, string> = {
    low: "Baixo",
    medium: "Médio",
    high: "Alto",
  };
  return labels[severity];
}
