import type { ScanExportPayload } from "@/lib/export/scan-export";
import { createClient } from "@/lib/supabase/server";
import type { Severity } from "@/types";

function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

/** Monta payload completo para exportação JSON/CSV de um scan. */
export async function getScanExportData(scanId: string): Promise<ScanExportPayload | null> {
  const supabase = await createClient();

  const { data: scan, error: scanError } = await supabase
    .from("scans")
    .select(
      `
      id, started_at, finished_at, duration_seconds, device_count, open_port_count,
      agents!inner (name)
    `
    )
    .eq("id", scanId)
    .maybeSingle();

  if (scanError || !scan) {
    if (scanError) console.error("[export] getScanExportData scan failed:", scanError.message);
    return null;
  }

  const { data: devices, error: devicesError } = await supabase
    .from("devices")
    .select(
      `
      ip, hostname, mac_address, vendor, status, os_name,
      ports (port_number, protocol, service_name, state),
      risks (severity, title, description, recommendation, port_number)
    `
    )
    .eq("scan_id", scanId)
    .order("ip");

  if (devicesError) {
    console.error("[export] getScanExportData devices failed:", devicesError.message);
    return null;
  }

  const agent = asSingle(scan.agents as { name: string } | { name: string }[]);

  return {
    scan: {
      id: scan.id,
      started_at: scan.started_at,
      finished_at: scan.finished_at,
      duration_seconds: scan.duration_seconds,
      device_count: scan.device_count,
      open_port_count: scan.open_port_count,
      agent_name: agent?.name ?? "Agente",
    },
    devices: (devices ?? []).map((device) => ({
      ip: device.ip,
      hostname: device.hostname,
      mac_address: device.mac_address,
      vendor: device.vendor,
      status: device.status,
      os_name: device.os_name,
      ports: (device.ports ?? []) as ScanExportPayload["devices"][number]["ports"],
      risks: (device.risks ?? []).map((risk) => ({
        severity: risk.severity as Severity,
        title: risk.title,
        description: risk.description,
        recommendation: risk.recommendation,
        port_number: risk.port_number,
      })),
    })),
    exported_at: new Date().toISOString(),
  };
}
