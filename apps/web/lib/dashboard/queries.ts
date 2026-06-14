import { createClient } from "@/lib/supabase/server";
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

  const { data: devices } = await supabase
    .from("devices")
    .select("id, ip, hostname, status")
    .eq("scan_id", latestScan.id)
    .order("ip")
    .limit(limit);

  if (!devices?.length) return [];

  const deviceIds = devices.map((d) => d.id);

  const { data: portCounts } = await supabase
    .from("ports")
    .select("device_id")
    .in("device_id", deviceIds);

  const { data: riskCounts } = await supabase
    .from("risks")
    .select("device_id, severity")
    .in("device_id", deviceIds);

  const portsByDevice = new Map<string, number>();
  for (const row of portCounts ?? []) {
    portsByDevice.set(row.device_id, (portsByDevice.get(row.device_id) ?? 0) + 1);
  }

  const risksByDevice = new Map<string, number>();
  for (const row of riskCounts ?? []) {
    risksByDevice.set(row.device_id, (risksByDevice.get(row.device_id) ?? 0) + 1);
  }

  return devices.map((device) => ({
    id: device.id,
    ip: device.ip,
    hostname: device.hostname,
    status: device.status as DeviceStatus,
    portCount: portsByDevice.get(device.id) ?? 0,
    riskCount: risksByDevice.get(device.id) ?? 0,
  }));
}

export async function hasAnyScan(): Promise<boolean> {
  const supabase = await createClient();
  const { count } = await supabase
    .from("scans")
    .select("id", { count: "exact", head: true })
    .not("finished_at", "is", null)
    .limit(1);

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
