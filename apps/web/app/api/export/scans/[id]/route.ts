import { getScanExportData } from "@/lib/export/queries";
import { scanToCsv } from "@/lib/export/scan-export";
import { createClient } from "@/lib/supabase/server";
import { uuidParamSchema } from "@/lib/validations/api";
import { NextResponse } from "next/server";
import { z } from "zod";

type RouteContext = { params: Promise<{ id: string }> };

const querySchema = z.object({
  format: z.enum(["json", "csv"]).default("json"),
});

function filename(scanId: string, format: "json" | "csv", startedAt: string): string {
  const date = startedAt.slice(0, 10);
  return `netatlas-scan-${date}-${scanId.slice(0, 8)}.${format}`;
}

export async function GET(request: Request, context: RouteContext) {
  const { id } = await context.params;
  const idParsed = uuidParamSchema.safeParse(id);
  if (!idParsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "Identificador de scan inválido." },
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

  const url = new URL(request.url);
  const parsed = querySchema.safeParse({
    format: url.searchParams.get("format") ?? "json",
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "VALIDATION_ERROR", message: "Formato inválido. Use json ou csv." },
      { status: 400 }
    );
  }

  const payload = await getScanExportData(idParsed.data);
  if (!payload) {
    return NextResponse.json(
      { error: "NOT_FOUND", message: "Scan não encontrado." },
      { status: 404 }
    );
  }

  const { format } = parsed.data;
  const name = filename(idParsed.data, format, payload.scan.started_at);

  if (format === "csv") {
    const csv = scanToCsv(payload);
    return new NextResponse(csv, {
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="${name}"`,
      },
    });
  }

  return new NextResponse(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Content-Disposition": `attachment; filename="${name}"`,
    },
  });
}
