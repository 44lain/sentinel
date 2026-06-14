import { NextResponse } from "next/server";
import { authenticateAgentForScan } from "@/lib/auth/agent";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { finishScanSchema } from "@/lib/validations/api";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;
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

  const { data, error } = await supabase
    .from("scans")
    .select("id, agent_id, started_at, finished_at, duration_seconds, device_count, open_port_count")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Não foi possível buscar o scan." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: "Scan não encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data });
}

export async function PATCH(request: Request, context: RouteContext) {
  const { id } = await context.params;

  const auth = await authenticateAgentForScan(request, id);
  if (!auth.ok) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Token de agente inválido." },
      { status: auth.status }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_JSON", message: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const parsed = finishScanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const supabase = createAdminClient();
  const finishedAt = parsed.data.finished_at ?? new Date().toISOString();

  const { data, error } = await supabase
    .from("scans")
    .update({
      finished_at: finishedAt,
      duration_seconds: parsed.data.duration_seconds,
      device_count: parsed.data.device_count,
      open_port_count: parsed.data.open_port_count,
    })
    .eq("id", id)
    .select("id, finished_at")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Não foi possível finalizar o scan." },
      { status: 500 }
    );
  }

  await supabase
    .from("agents")
    .update({ last_scan_at: finishedAt })
    .eq("id", auth.agentId);

  return NextResponse.json({ data });
}
