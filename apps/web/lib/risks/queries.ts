import { createClient } from "@/lib/supabase/server";
import type { Severity } from "@/types";

/** Supabase pode retornar relação many-to-one como objeto ou array. */
function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
}

export type RiskSeverityFilter = Severity | "all";

export interface RiskRecord {
  id: string;
  severity: Severity;
  title: string;
  description: string;
  recommendation: string;
  portNumber: number | null;
  deviceId: string;
  deviceIp: string;
  deviceHostname: string | null;
}

export interface RiskInsights {
  total: number;
  high: number;
  medium: number;
  low: number;
}

function isSeverity(value: string): value is Severity {
  return value === "low" || value === "medium" || value === "high";
}

export async function getRisks(severityFilter: RiskSeverityFilter = "all"): Promise<RiskRecord[]> {
  const supabase = await createClient();

  let query = supabase
    .from("risks")
    .select(
      `
      id, severity, title, description, recommendation, port_number,
      devices!inner (id, ip, hostname)
    `
    )
    .limit(200);

  if (severityFilter !== "all" && isSeverity(severityFilter)) {
    query = query.eq("severity", severityFilter);
  }

  const { data, error } = await query;

  if (error) {
    console.error("[risks] getRisks failed:", error.message);
    return [];
  }

  const severityOrder: Record<Severity, number> = { high: 0, medium: 1, low: 2 };

  return (data ?? [])
    .map((risk) => {
      const device = asSingle(
        risk.devices as
          | { id: string; ip: string; hostname: string | null }
          | { id: string; ip: string; hostname: string | null }[]
      );
      if (!device) return null;
      return {
        id: risk.id,
        severity: risk.severity as Severity,
        title: risk.title,
        description: risk.description,
        recommendation: risk.recommendation,
        portNumber: risk.port_number,
        deviceId: device.id,
        deviceIp: device.ip,
        deviceHostname: device.hostname,
      };
    })
    .filter((risk): risk is RiskRecord => risk != null)
    .sort((a, b) => severityOrder[a.severity] - severityOrder[b.severity]);
}

export async function getRiskInsights(): Promise<RiskInsights> {
  const supabase = await createClient();

  const { data, error } = await supabase.from("risks").select("severity");

  if (error) {
    console.error("[risks] getRiskInsights failed:", error.message);
    return { total: 0, high: 0, medium: 0, low: 0 };
  }

  let high = 0;
  let medium = 0;
  let low = 0;

  for (const row of data ?? []) {
    if (row.severity === "high") high++;
    else if (row.severity === "medium") medium++;
    else if (row.severity === "low") low++;
  }

  return { total: data?.length ?? 0, high, medium, low };
}
