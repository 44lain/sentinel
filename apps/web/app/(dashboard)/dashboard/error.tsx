"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  return (
    <main className="flex flex-1 flex-col gap-6 p-8">
      <Card className="border-destructive/40 max-w-lg">
        <CardHeader>
          <CardTitle>Erro ao carregar o dashboard</CardTitle>
          <CardDescription>
            Não foi possível buscar os dados. Tente recarregar a página.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground font-mono text-xs break-all">
            {error.message}
          </p>
          <Button type="button" onClick={reset}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
