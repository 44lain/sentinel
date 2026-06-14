import { NextResponse } from "next/server";
import { authenticateAgentForScan } from "@/lib/auth/agent";
import { detectRisks } from "@/lib/risk-engine";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createDevicesSchema } from "@/lib/validations/api";

export async function GET(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Sessão inválida." },
      { status: 401 }
    );
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const search = searchParams.get("search")?.trim();

  let query = supabase
    .from("devices")
    .select("id, scan_id, ip, hostname, mac_address, vendor, status, first_seen_at")
    .order("first_seen_at", { ascending: false })
    .limit(50);

  if (status === "online" || status === "offline") {
    query = query.eq("status", status);
  }

  if (search) {
    query = query.or(`ip.ilike.%${search}%,hostname.ilike.%${search}%`);
  }

  const { data, error } = await query;

  if (error) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Não foi possível listar dispositivos." },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_JSON", message: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const parsed = createDevicesSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const auth = await authenticateAgentForScan(request, parsed.data.scan_id);
  if (!auth.ok) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Token de agente inválido." },
      { status: auth.status }
    );
  }

  const supabase = createAdminClient();
  let created = 0;
  let risksDetected = 0;

  for (const device of parsed.data.devices) {
    const { data: inserted, error: deviceError } = await supabase
      .from("devices")
      .insert({
        scan_id: parsed.data.scan_id,
        ip: device.ip,
        hostname: device.hostname ?? null,
        mac_address: device.mac_address ?? null,
        vendor: device.vendor ?? null,
        status: device.status,
      })
      .select("id")
      .single();

    if (deviceError || !inserted) continue;

    created += 1;

    if (device.ports.length > 0) {
      await supabase.from("ports").insert(
        device.ports.map((port) => ({
          device_id: inserted.id,
          port_number: port.port_number,
          protocol: port.protocol,
          service_name: port.service_name ?? null,
          state: port.state,
        }))
      );
    }

    const risks = detectRisks(device.ports);
    if (risks.length > 0) {
      await supabase.from("risks").insert(
        risks.map((risk) => ({
          device_id: inserted.id,
          severity: risk.severity,
          title: risk.title,
          description: risk.description,
          recommendation: risk.recommendation,
          port_number: risk.port_number,
        }))
      );
      risksDetected += risks.length;
    }
  }

  return NextResponse.json(
    { data: { created, risks_detected: risksDetected } },
    { status: 201 }
  );
}
