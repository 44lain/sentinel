import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Terminal } from "lucide-react";

interface DashboardEmptyStateProps {
  apiUrl?: string;
}

export function DashboardEmptyState({ apiUrl = "https://netatlas.vercel.app" }: DashboardEmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
          <Terminal className="size-6 text-muted-foreground" />
        </div>
        <CardTitle>Nenhum scan realizado</CardTitle>
        <CardDescription>
          Registre um agente e execute um scan na sua rede local para ver métricas aqui.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
        <Link href="/agents" className={cn(buttonVariants(), "inline-flex")}>
          Registrar agente
        </Link>
        <div className="mx-auto max-w-md space-y-2 rounded-lg bg-muted/50 p-4 text-left font-mono text-xs">
          <p># Após registrar, execute na rede local:</p>
          <p className="text-foreground">
            netatlas scan --token SEU_TOKEN --agent-id ID --api {apiUrl} --profile deep --include-localhost
          </p>
          <p className="text-muted-foreground">
            # --profile deep: scripts NSE, UDP, detecção de SO e versões completas
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
