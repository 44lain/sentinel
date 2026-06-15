import { NextResponse } from "next/server";

/** Mitiga CSRF em rotas mutáveis autenticadas por cookie (mesma origem). */
export function assertSameOrigin(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin || !host) {
    return null;
  }

  try {
    const originHost = new URL(origin).host;
    if (originHost !== host) {
      return NextResponse.json(
        { error: "FORBIDDEN", message: "Origem da requisição não permitida." },
        { status: 403 }
      );
    }
  } catch {
    return NextResponse.json(
      { error: "FORBIDDEN", message: "Origem da requisição inválida." },
      { status: 403 }
    );
  }

  return null;
}
