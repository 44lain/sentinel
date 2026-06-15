import { Minus, Plus, RefreshCw } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { ScanComparisonResult } from "@/lib/scans/queries";

interface ScanComparisonPanelProps {
  comparison: ScanComparisonResult;
}

function formatDate(date: string): string {
  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(new Date(date));
}

function DeviceList({
  title,
  items,
  tone,
}: {
  title: string;
  items: Array<{ ip: string; hostname: string | null; vendor: string | null }>;
  tone: "success" | "danger" | "warning";
}) {
  if (items.length === 0) return null;

  const variant = tone === "success" ? "success" : tone === "danger" ? "danger" : "warning";

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <Badge variant={variant}>{items.length}</Badge>
        <h4 className="text-sm font-medium">{title}</h4>
      </div>
      <ul className="divide-border divide-y rounded-lg border text-sm">
        {items.map((item) => (
          <li key={item.ip} className="flex items-center justify-between gap-3 px-3 py-2">
            <span className="font-mono font-medium">{item.ip}</span>
            <span className="text-muted-foreground truncate text-right text-xs">
              {[item.hostname, item.vendor].filter(Boolean).join(" · ") || "—"}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function ScanComparisonPanel({ comparison }: ScanComparisonPanelProps) {
  const { added, removed, changed, unchanged, previousScan } = comparison;
  const hasDiff = added.length > 0 || removed.length > 0 || changed.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading-3">Comparação com scan anterior</CardTitle>
        <CardDescription>
          {previousScan
            ? `Referência: ${formatDate(previousScan.startedAt)} · matching por IP`
            : "Primeiro scan registrado — não há baseline para comparar."}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {previousScan ? (
          <div className="grid gap-3 sm:grid-cols-4">
            <SummaryPill icon={Plus} label="Novos" value={added.length} tone="text-success" />
            <SummaryPill icon={Minus} label="Removidos" value={removed.length} tone="text-danger" />
            <SummaryPill
              icon={RefreshCw}
              label="Alterados"
              value={changed.length}
              tone="text-warning"
            />
            <SummaryPill
              icon={RefreshCw}
              label="Inalterados"
              value={unchanged}
              tone="text-muted-foreground"
            />
          </div>
        ) : null}

        {!previousScan ? (
          <p className="text-muted-foreground text-sm">
            Todos os {added.length} dispositivo(s) deste scan são considerados novos.
          </p>
        ) : !hasDiff ? (
          <p className="text-muted-foreground text-sm">
            Nenhuma diferença detectada em relação ao scan anterior.
          </p>
        ) : (
          <div className="grid gap-6 lg:grid-cols-2">
            <DeviceList title="Dispositivos novos" items={added} tone="success" />
            <DeviceList title="Dispositivos removidos" items={removed} tone="danger" />
          </div>
        )}

        {changed.length > 0 ? (
          <div className="space-y-2">
            <h4 className="flex items-center gap-2 text-sm font-medium">
              <Badge variant="warning">{changed.length}</Badge>
              Dispositivos alterados
            </h4>
            <ul className="divide-border divide-y rounded-lg border text-sm">
              {changed.map((item) => (
                <li key={item.ip} className="space-y-1 px-3 py-2">
                  <p className="font-mono font-medium">{item.ip}</p>
                  <p className="text-muted-foreground text-xs">
                    Status: {item.before.status} → {item.after.status}
                  </p>
                  {item.portChanges.added.length > 0 ? (
                    <p className="text-success text-xs">
                      Portas novas: {item.portChanges.added.join(", ")}
                    </p>
                  ) : null}
                  {item.portChanges.removed.length > 0 ? (
                    <p className="text-danger text-xs">
                      Portas removidas: {item.portChanges.removed.join(", ")}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}

function SummaryPill({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof Plus;
  label: string;
  value: number;
  tone: string;
}) {
  return (
    <div className="border-border bg-muted/30 rounded-lg border px-3 py-2">
      <div className="flex items-center gap-2">
        <Icon className={`size-4 ${tone}`} />
        <span className="text-muted-foreground text-xs">{label}</span>
      </div>
      <p className="mt-1 text-2xl font-bold">{value}</p>
    </div>
  );
}
