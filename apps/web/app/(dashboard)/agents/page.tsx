import { AgentsPageClient } from "@/components/agents/agents-page-client";
import { PageHeader } from "@/components/layout/page-header";
import { createClient } from "@/lib/supabase/server";

export default async function AgentsPage() {
  const supabase = await createClient();
  const { data: agents } = await supabase
    .from("agents")
    .select("id, name, last_scan_at, created_at")
    .order("created_at", { ascending: false });

  const apiUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <PageHeader
        title="Agentes"
        description="Registre e gerencie agentes coletores na sua rede local."
      />
      <AgentsPageClient agents={agents ?? []} apiUrl={apiUrl} />
    </main>
  );
}
