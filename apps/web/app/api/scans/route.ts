import { NextResponse } from "next/server";
import { authenticateAgent } from "@/lib/auth/agent";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { createScanSchema } from "@/lib/validations/api";

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
  const limit = Math.min(Number(searchParams.get("limit") ?? 20), 100);
  const offset = Number(searchParams.get("offset") ?? 0);

  const { data, error } = await supabase
    .from("scans")
    .select("id, agent_id, started_at, finished_at, duration_seconds, device_count, open_port_count")
    .order("started_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Não foi possível listar scans." },
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

  const parsed = createScanSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const auth = await authenticateAgent(request, parsed.data.agent_id);
  if (!auth.ok) {
    return NextResponse.json(
      { error: "UNAUTHORIZED", message: "Token de agente inválido." },
      { status: auth.status }
    );
  }

  const supabase = createAdminClient();
  const { data, error } = await supabase
    .from("scans")
    .insert({ agent_id: parsed.data.agent_id })
    .select("id, started_at")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Não foi possível criar o scan." },
      { status: 500 }
    );
  }

  return NextResponse.json({ data }, { status: 201 });
}
