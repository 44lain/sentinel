import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Exclui _next inteiro (HMR/Turbopack/RSC internals), estáticos e APIs.
     * Interceptar /_next/* no middleware quebra HMR e pode travar o skeleton.
     */
    "/((?!_next|api|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
