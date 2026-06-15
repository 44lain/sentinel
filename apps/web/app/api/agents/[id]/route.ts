import { NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/security/request-guards";
import { createClient } from "@/lib/supabase/server";
import { uuidParamSchema } from "@/lib/validations/api";

type RouteContext = { params: Promise<{ id: string }> };

export async function DELETE(request: Request, context: RouteContext) {
  const csrfError = assertSameOrigin(request);
  if (csrfError) return csrfError;

  const { id } = await context.params;
  const parsedId = uuidParamSchema.safeParse(id);
  if (!parsedId.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "Identificador inválido." },
      { status: 400 }
    );
  }

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
    .delete()
    .eq("id", parsedId.data)
    .select("id")
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: "INTERNAL_ERROR", message: "Não foi possível revogar o agente." },
      { status: 500 }
    );
  }

  if (!data) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: "Agente não encontrado." },
      { status: 404 }
    );
  }

  return NextResponse.json({ data: { id: data.id } });
}
