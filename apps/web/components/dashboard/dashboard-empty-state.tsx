import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Terminal } from "lucide-react";

export function DashboardEmptyState() {
  return (
    <Card className="border-dashed">
      <CardHeader className="text-center">
        <div className="mx-auto mb-2 flex size-12 items-center justify-center rounded-full bg-muted">
          <Terminal className="size-6 text-muted-foreground" />
        </div>
        <CardTitle>Nenhum scan realizado</CardTitle>
        <CardDescription>
          Instale o NetAtlas Agent na sua rede local para descobrir dispositivos, portas abertas
          e riscos de segurança.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-center text-sm text-muted-foreground">
        <div className="mx-auto max-w-md space-y-2 rounded-lg bg-muted/50 p-4 text-left font-mono text-xs">
          <p># 1. Registre um agente (Sprint 4)</p>
          <p># 2. Execute na rede local:</p>
          <p className="text-foreground">netatlas scan --token SEU_TOKEN --api https://netatlas.vercel.app</p>
        </div>
        <p>Os resultados aparecerão aqui automaticamente após o primeiro scan.</p>
      </CardContent>
    </Card>
  );
}
