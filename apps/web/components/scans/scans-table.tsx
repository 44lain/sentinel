import Link from "next/link";
import type { ScanRecord } from "@/lib/scans/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface ScansTableProps {
  scans: ScanRecord[];
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function formatDuration(seconds: number | null): string {
  if (seconds == null) return "—";
  if (seconds < 60) return `${seconds}s`;
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return sec > 0 ? `${min}m ${sec}s` : `${min}m`;
}

export function ScansTable({ scans }: ScansTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading-3">Histórico de scans</CardTitle>
        <CardDescription>{scans.length} scan(s) registrado(s)</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-border text-muted-foreground border-b text-left">
                <th className="px-4 py-3 font-medium">Data</th>
                <th className="px-4 py-3 font-medium">Agente</th>
                <th className="px-4 py-3 font-medium">Status</th>
                <th className="px-4 py-3 font-medium">Dispositivos</th>
                <th className="px-4 py-3 font-medium">Portas</th>
                <th className="px-4 py-3 font-medium">Duração</th>
              </tr>
            </thead>
            <tbody>
              {scans.map((scan) => (
                <tr
                  key={scan.id}
                  className="border-border hover:bg-muted/40 border-b last:border-0"
                >
                  <td className="px-4 py-3">
                    <Link href={`/scans/${scan.id}`} className="hover:text-primary block">
                      <p className="font-medium">{formatDate(scan.startedAt)}</p>
                      {scan.finishedAt ? (
                        <p className="text-caption">Fim: {formatDate(scan.finishedAt)}</p>
                      ) : null}
                    </Link>
                  </td>
                  <td className="px-4 py-3">{scan.agentName}</td>
                  <td className="px-4 py-3">
                    <Badge variant={scan.status === "completed" ? "success" : "warning"}>
                      {scan.status === "completed" ? "Concluído" : "Em andamento"}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 font-mono">{scan.deviceCount ?? "—"}</td>
                  <td className="px-4 py-3 font-mono">{scan.openPortCount ?? "—"}</td>
                  <td className="text-muted-foreground px-4 py-3">
                    {formatDuration(scan.durationSeconds)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
