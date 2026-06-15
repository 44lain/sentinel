import { randomUUID } from "crypto";
import { NextResponse } from "next/server";
import { hashAgentToken } from "@/lib/auth/agent";
import { assertSameOrigin } from "@/lib/security/request-guards";
import { createClient } from "@/lib/supabase/server";
import { createAgentSchema } from "@/lib/validations/agents";

export async function GET() {
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
    .from("agents")
    .select("id, name, last_scan_at, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Não foi possível listar agentes." },
      { status: 500 }
    );
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const csrfError = assertSameOrigin(request);
  if (csrfError) return csrfError;

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

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "INVALID_JSON", message: "Corpo da requisição inválido." },
      { status: 400 }
    );
  }

  const parsed = createAgentSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: parsed.error.issues[0]?.message ?? "Dados inválidos." },
      { status: 400 }
    );
  }

  const rawToken = randomUUID();
  const tokenHash = await hashAgentToken(rawToken);

  const { data, error } = await supabase
    .from("agents")
    .insert({
      user_id: user.id,
      name: parsed.data.name,
      token: tokenHash,
    })
    .select("id, name, created_at")
    .single();

  if (error || !data) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Não foi possível registrar o agente." },
      { status: 500 }
    );
  }

  return NextResponse.json(
    {
      data: {
        id: data.id,
        name: data.name,
        created_at: data.created_at,
        token: rawToken,
      },
    },
    { status: 201 }
  );
}
