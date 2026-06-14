import bcrypt from "bcryptjs";
import { createAdminClient } from "@/lib/supabase/admin";

export type AgentAuthResult =
  | { ok: true; agentId: string; userId: string }
  | { ok: false; status: 401 | 403 };

function extractBearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header?.startsWith("Bearer ")) return null;
  return header.slice(7).trim();
}

export async function authenticateAgent(
  request: Request,
  agentId: string
): Promise<AgentAuthResult> {
  const token = extractBearerToken(request);
  if (!token) return { ok: false, status: 401 };

  const supabase = createAdminClient();
  const { data: agent, error } = await supabase
    .from("agents")
    .select("id, user_id, token")
    .eq("id", agentId)
    .single();

  if (error || !agent) return { ok: false, status: 403 };

  const valid = await bcrypt.compare(token, agent.token);
  if (!valid) return { ok: false, status: 401 };

  return { ok: true, agentId: agent.id, userId: agent.user_id };
}

export async function authenticateAgentForScan(
  request: Request,
  scanId: string
): Promise<AgentAuthResult> {
  const token = extractBearerToken(request);
  if (!token) return { ok: false, status: 401 };

  const supabase = createAdminClient();
  const { data: scan, error } = await supabase
    .from("scans")
    .select("id, agent_id, agents ( id, user_id, token )")
    .eq("id", scanId)
    .single();

  if (error || !scan) return { ok: false, status: 403 };

  const agent = scan.agents as unknown as { id: string; user_id: string; token: string } | null;
  if (!agent) return { ok: false, status: 403 };
  const valid = await bcrypt.compare(token, agent.token);
  if (!valid) return { ok: false, status: 401 };

  return { ok: true, agentId: agent.id, userId: agent.user_id };
}

export async function hashAgentToken(rawToken: string): Promise<string> {
  return bcrypt.hash(rawToken, 10);
}
