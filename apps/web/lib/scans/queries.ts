import { createClient } from "@/lib/supabase/server";

/** Supabase pode retornar relação many-to-one como objeto ou array. */
function asSingle<T>(value: T | T[] | null | undefined): T | null {
  if (value == null) return null;
  return Array.isArray(value) ? (value[0] ?? null) : value;
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
