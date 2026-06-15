import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const APP_VERSION = "1.0.0";

export function AboutSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading-3">Sobre</CardTitle>
        <CardDescription>Informações do sistema e do agente local.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Versão da plataforma</span>
          <Badge variant="primary">{APP_VERSION}</Badge>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground">Agente local</span>
          <span className="font-mono text-xs">netatlas CLI · Python</span>
        </div>
        <p className="text-caption">
          O agente executa scans Nmap na sua rede e envia resultados para esta plataforma. Consulte{" "}
          <code className="bg-muted rounded px-1 py-0.5 font-mono text-xs">
            apps/agent/README.md
          </code>{" "}
          para instalação e perfis de scan.
        </p>
      </CardContent>
    </Card>
  );
}
