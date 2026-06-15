import type { Severity } from "@/types";

export interface ExportPort {
  port_number: number;
  protocol: string;
  service_name: string | null;
  state: string;
}

export interface ExportRisk {
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  port_number: number | null;
}

export interface ExportDevice {
  ip: string;
  hostname: string | null;
  mac_address: string | null;
  vendor: string | null;
  status: string;
  os_name: string | null;
  ports: ExportPort[];
  risks: ExportRisk[];
}

export interface ScanExportPayload {
  scan: {
    id: string;
    started_at: string;
    finished_at: string | null;
    duration_seconds: number | null;
    device_count: number | null;
    open_port_count: number | null;
    agent_name: string;
  };
  devices: ExportDevice[];
  exported_at: string;
}

function escapeCsv(value: string | number | null | undefined): string {
  const text = value == null ? "" : String(value);
  if (/[",\n\r]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

/** Gera CSV achatado: uma linha por porta aberta (ou uma linha por device sem portas). */
export function scanToCsv(payload: ScanExportPayload): string {
  const headers = [
    "ip",
    "hostname",
    "vendor",
    "status",
    "port",
    "protocol",
    "service",
    "state",
    "risk_count",
    "risk_titles",
  ];

  const rows: string[][] = [];

  for (const device of payload.devices) {
    const riskTitles = device.risks.map((r) => r.title).join("; ");
    const base = [device.ip, device.hostname ?? "", device.vendor ?? "", device.status];

    if (device.ports.length === 0) {
      rows.push([...base, "", "", "", "", String(device.risks.length), riskTitles]);
      continue;
    }

    for (const port of device.ports) {
      rows.push([
        ...base,
        String(port.port_number),
        port.protocol,
        port.service_name ?? "",
        port.state,
        String(device.risks.length),
        riskTitles,
      ]);
    }
  }

  const lines = [headers.join(","), ...rows.map((row) => row.map(escapeCsv).join(","))];

  return lines.join("\n");
}
