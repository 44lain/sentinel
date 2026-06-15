import { compareScans, type ScanComparison, type ScanDeviceSnapshot } from "@/lib/scans/compare";
import { createClient } from "@/lib/supabase/server";

/** Supabase pode retornar relação many-to-one como objeto ou array. */
function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export interface ScanDetail {
  id: string;
  startedAt: string;
  finishedAt: string | null;
  durationSeconds: number | null;
  deviceCount: number | null;
  openPortCount: number | null;
  agentName: string;
  status: "completed" | "running";
}

export interface ScanHistoryPoint {
  id: string;
  label: string;
  startedAt: string;
  deviceCount: number;
  openPortCount: number;
  riskCount: number;
}

export interface ScanComparisonResult extends ScanComparison {
  previousScan: { id: string; startedAt: string } | null;
}

export interface ScanRecord {
  id: string;
  startedAt: string;
  finishedAt: string | null;
  durationSeconds: number | null;
  deviceCount: number | null;
  openPortCount: number | null;
  agentName: string;
  status: "completed" | "running";
}

export async function getScansList(limit = 50): Promise<ScanRecord[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scans")
    .select(
      `
      id, started_at, finished_at, duration_seconds, device_count, open_port_count,
      agents!inner (name)
    `
    )
    .order("started_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("[scans] getScansList failed:", error.message);
    return [];
  }

  return (data ?? []).map((scan) => {
    const agent = asSingle(scan.agents as { name: string } | { name: string }[]);
    return {
      id: scan.id,
      startedAt: scan.started_at,
      finishedAt: scan.finished_at,
      durationSeconds: scan.duration_seconds,
      deviceCount: scan.device_count,
      openPortCount: scan.open_port_count,
      agentName: agent?.name ?? "Agente",
      status: scan.finished_at ? "completed" : "running",
    };
  });
}

export async function hasAnyScan(): Promise<boolean> {
  const supabase = await createClient();
  const { count, error } = await supabase
    .from("scans")
    .select("id", { count: "exact", head: true })
    .limit(1);

  if (error) {
    console.error("[scans] hasAnyScan failed:", error.message);
    return false;
  }

  return (count ?? 0) > 0;
}

export async function getScanDetail(scanId: string): Promise<ScanDetail | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scans")
    .select(
      `
      id, started_at, finished_at, duration_seconds, device_count, open_port_count,
      agents!inner (name)
    `
    )
    .eq("id", scanId)
    .maybeSingle();

  if (error || !data) {
    if (error) console.error("[scans] getScanDetail failed:", error.message);
    return null;
  }

  const agent = asSingle(data.agents as { name: string } | { name: string }[]);

  return {
    id: data.id,
    startedAt: data.started_at,
    finishedAt: data.finished_at,
    durationSeconds: data.duration_seconds,
    deviceCount: data.device_count,
    openPortCount: data.open_port_count,
    agentName: agent?.name ?? "Agente",
    status: data.finished_at ? "completed" : "running",
  };
}

async function getScanDeviceSnapshots(scanId: string): Promise<ScanDeviceSnapshot[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("devices")
    .select(
      `
      ip, hostname, vendor, status,
      ports (port_number, protocol, state, service_name)
    `
    )
    .eq("scan_id", scanId);

  if (error) {
    console.error("[scans] getScanDeviceSnapshots failed:", error.message);
    return [];
  }

  return (data ?? []).map((device) => ({
    ip: device.ip,
    hostname: device.hostname,
    vendor: device.vendor,
    status: device.status,
    ports: (device.ports ?? []) as ScanDeviceSnapshot["ports"],
  }));
}

/** Scan concluído imediatamente anterior ao informado (mesmo tenant). */
export async function getPreviousScan(
  scanId: string,
  startedAt: string
): Promise<{ id: string; startedAt: string } | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("scans")
    .select("id, started_at")
    .neq("id", scanId)
    .not("finished_at", "is", null)
    .lt("started_at", startedAt)
    .order("started_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error("[scans] getPreviousScan failed:", error.message);
    return null;
  }

  if (!data) return null;

  return { id: data.id, startedAt: data.started_at };
}

export async function getScanComparison(scanId: string): Promise<ScanComparisonResult | null> {
  const detail = await getScanDetail(scanId);
  if (!detail) return null;

  const current = await getScanDeviceSnapshots(scanId);
  const previousScan = await getPreviousScan(scanId, detail.startedAt);
  const previous = previousScan ? await getScanDeviceSnapshots(previousScan.id) : null;

  const comparison = compareScans(current, previous);

  return {
    ...comparison,
    previousScan,
  };
}

/** Pontos para gráfico de evolução (últimos N scans concluídos). */
export async function getScanHistoryChart(limit = 12): Promise<ScanHistoryPoint[]> {
  const supabase = await createClient();

  const { data: scans, error } = await supabase
    .from("scans")
    .select("id, started_at, device_count, open_port_count")
    .not("finished_at", "is", null)
    .order("started_at", { ascending: true })
    .limit(limit);

  if (error || !scans?.length) {
    if (error) console.error("[scans] getScanHistoryChart failed:", error.message);
    return [];
  }

  const scanIds = scans.map((s) => s.id);

  const { data: devices, error: devicesError } = await supabase
    .from("devices")
    .select("scan_id, risks (id)")
    .in("scan_id", scanIds);

  if (devicesError) {
    console.error("[scans] getScanHistoryChart risks failed:", devicesError.message);
  }

  const riskCountByScan = new Map<string, number>();
  for (const device of devices ?? []) {
    const risks = device.risks as { id: string }[] | null;
    const count = risks?.length ?? 0;
    riskCountByScan.set(device.scan_id, (riskCountByScan.get(device.scan_id) ?? 0) + count);
  }

  return scans.map((scan) => {
    const date = new Date(scan.started_at);
    const label = new Intl.DateTimeFormat("pt-BR", {
      day: "2-digit",
      month: "short",
    }).format(date);

    return {
      id: scan.id,
      label,
      startedAt: scan.started_at,
      deviceCount: scan.device_count ?? 0,
      openPortCount: scan.open_port_count ?? 0,
      riskCount: riskCountByScan.get(scan.id) ?? 0,
    };
  });
}
