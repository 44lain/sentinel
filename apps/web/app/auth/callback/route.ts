import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const ALLOWED_CALLBACK_PATHS = ["/dashboard", "/reset-password"];

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const destino = ALLOWED_CALLBACK_PATHS.find(
        (path) => next === path || next.startsWith(`${path}/`)
      )
        ? next
        : "/dashboard";
      return NextResponse.redirect(`${origin}${destino}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}
