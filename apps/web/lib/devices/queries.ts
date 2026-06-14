import { createClient } from "@/lib/supabase/server";
import { formatOsLabel } from "@/lib/format-ports";
import type { DeviceStatus, Severity } from "@/types";

/** Supabase pode retornar relação many-to-one como objeto ou array. */
function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export interface DevicePort {
  id: string;
  port_number: number;
  protocol: string;
  service_name: string | null;
  service_product: string | null;
  service_version: string | null;
  state: string;
}

export interface DeviceRisk {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  port_number: number | null;
}

export interface DeviceScanHistoryEntry {
  deviceId: string;
  scanId: string;
  scanFinishedAt: string | null;
  scanStartedAt: string;
  agentName: string;
  status: DeviceStatus;
  portCount: number;
}

export interface DeviceDetail {
  id: string;
  ip: string;
  hostname: string | null;
  mac_address: string | null;
  vendor: string | null;
  status: DeviceStatus;
  first_seen_at: string;
  os_name: string | null;
  os_accuracy: number | null;
  os_family: string | null;
  osLabel: string;
  scanId: string;
  scanFinishedAt: string | null;
  agentName: string;
  ports: DevicePort[];
  risks: DeviceRisk[];
  history: DeviceScanHistoryEntry[];
}

type ScanWithAgent = {
  id: string;
  started_at: string;
  finished_at: string | null;
  agents: { name: string } | { name: string }[];
};

function parseScan(scan: ScanWithAgent | ScanWithAgent[] | null | undefined) {
  const row = asSingle(scan);
  if (!row) return null;
  const agent = asSingle(row.agents);
  return {
    id: row.id,
    started_at: row.started_at,
    finished_at: row.finished_at,
    agentName: agent?.name ?? "Agente",
  };
}

/** Busca detalhe completo de um dispositivo pelo IP (registro mais recente + histórico). */
export async function getDeviceDetail(ip: string): Promise<DeviceDetail | null> {
  const supabase = await createClient();

  const { data: devices, error } = await supabase
    .from("devices")
    .select(
      `
      id, scan_id, ip, hostname, mac_address, vendor, status, first_seen_at,
      os_name, os_accuracy, os_family,
      scans!inner (
        id, started_at, finished_at,
        agents!inner (name)
      )
    `
    )
    .eq("ip", ip)
    .order("first_seen_at", { ascending: false });

  if (error) {
    console.error("[devices] getDeviceDetail failed:", error.message);
    return null;
  }

  if (!devices?.length) return null;

  const sorted = [...devices].sort((a, b) => {
    const aScan = parseScan(a.scans as ScanWithAgent | ScanWithAgent[]);
    const bScan = parseScan(b.scans as ScanWithAgent | ScanWithAgent[]);
    const aDate = new Date(aScan?.finished_at ?? aScan?.started_at ?? 0).getTime();
    const bDate = new Date(bScan?.finished_at ?? bScan?.started_at ?? 0).getTime();
    return bDate - aDate;
  });

  const latest = sorted[0];
  const latestScan = parseScan(latest.scans as ScanWithAgent | ScanWithAgent[]);
  if (!latestScan) return null;

  const [{ data: ports }, { data: risks }] = await Promise.all([
    supabase
      .from("ports")
      .select("id, port_number, protocol, service_name, service_product, service_version, state")
      .eq("device_id", latest.id)
      .order("port_number"),
    supabase
      .from("risks")
      .select("id, severity, title, description, recommendation, port_number")
      .eq("device_id", latest.id),
  ]);

  const severityOrder: Record<Severity, number> = { high: 0, medium: 1, low: 2 };
  const sortedRisks = ((risks ?? []) as DeviceRisk[]).sort(
    (a, b) => severityOrder[a.severity] - severityOrder[b.severity]
  );

  const deviceIds = sorted.map((d) => d.id);
  const { data: portCounts } = await supabase
    .from("ports")
    .select("device_id")
    .in("device_id", deviceIds);

  const portsByDevice = new Map<string, number>();
  for (const row of portCounts ?? []) {
    portsByDevice.set(row.device_id, (portsByDevice.get(row.device_id) ?? 0) + 1);
  }

  const history: DeviceScanHistoryEntry[] = sorted
    .map((device) => {
      const scan = parseScan(device.scans as ScanWithAgent | ScanWithAgent[]);
      if (!scan) return null;
      return {
        deviceId: device.id,
        scanId: scan.id,
        scanFinishedAt: scan.finished_at,
        scanStartedAt: scan.started_at,
        agentName: scan.agentName,
        status: device.status as DeviceStatus,
        portCount: portsByDevice.get(device.id) ?? 0,
      };
    })
    .filter((entry): entry is DeviceScanHistoryEntry => entry != null);

  return {
    id: latest.id,
    ip: latest.ip,
    hostname: latest.hostname,
    mac_address: latest.mac_address,
    vendor: latest.vendor,
    status: latest.status as DeviceStatus,
    first_seen_at: latest.first_seen_at,
    os_name: latest.os_name,
    os_accuracy: latest.os_accuracy,
    os_family: latest.os_family,
    osLabel: formatOsLabel(latest.os_name, latest.os_accuracy, latest.os_family),
    scanId: latestScan.id,
    scanFinishedAt: latestScan.finished_at,
    agentName: latestScan.agentName,
    ports: (ports ?? []) as DevicePort[],
    risks: sortedRisks,
    history,
  };
}
