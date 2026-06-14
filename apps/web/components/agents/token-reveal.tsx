"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface TokenRevealProps {
  token: string;
  agentId: string;
  apiUrl: string;
  onClose: () => void;
}

export function TokenReveal({ token, agentId, apiUrl, onClose }: TokenRevealProps) {
  const command = `netatlas scan --token ${token} --agent-id ${agentId} --api ${apiUrl} --profile deep --include-localhost`;

  return (
    <Card className="border-primary/40">
      <CardHeader>
        <CardTitle>Token gerado — copie agora</CardTitle>
        <CardDescription>
          Este token não será exibido novamente. Guarde-o em local seguro.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="rounded-md bg-muted p-3 font-mono text-xs break-all">{token}</div>
        <div className="space-y-1">
          <p className="text-sm font-medium">Comando para executar na rede local:</p>
          <div className="rounded-md bg-muted p-3 font-mono text-xs break-all">{command}</div>
          <p className="text-muted-foreground text-xs">
            Use <code className="text-foreground">--profile deep</code> para máximo detalhe
            (scripts NSE, UDP, OS) e <code className="text-foreground">--include-localhost</code>{" "}
            para Docker.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={onClose}>
          Entendi, já copiei
        </Button>
      </CardContent>
    </Card>
  );
}
