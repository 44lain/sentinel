import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatOsLabel, formatPortsSummary } from "@/lib/format-ports";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";

interface InventoryPageProps {
  searchParams: Promise<{ search?: string; status?: string }>;
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const statusFilter =
    params.status === "online" || params.status === "offline" ? params.status : "";

  const supabase = await createClient();
  let query = supabase
    .from("devices")
    .select(
      "id, scan_id, ip, hostname, mac_address, vendor, status, first_seen_at, os_name, os_accuracy, os_family, ports(port_number, service_name, service_product, service_version)"
    )
    .order("first_seen_at", { ascending: false })
    .limit(100);

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }
  if (search) {
    query = query.or(`ip.ilike.%${search}%,hostname.ilike.%${search}%`);
  }

  const { data: devices, error } = await query;

  if (error) {
    console.error("[inventory] devices query failed:", error.message);
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Inventário</h1>
        <p className="text-muted-foreground">Dispositivos descobertos nos seus scans</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4 sm:flex-row sm:items-end" method="get">
            <div className="flex-1 space-y-2">
              <Label htmlFor="search">Buscar</Label>
              <Input
                id="search"
                name="search"
                defaultValue={search}
                placeholder="IP ou hostname"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                defaultValue={statusFilter}
                className="border-input bg-background h-9 w-full min-w-32 rounded-md border px-3 text-sm"
              >
                <option value="">Todos</option>
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <Button type="submit">Filtrar</Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Dispositivos</CardTitle>
          <CardDescription>
            {(devices?.length ?? 0) === 0
              ? "Nenhum dispositivo encontrado."
              : `${devices?.length} dispositivo(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {(devices?.length ?? 0) > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-left text-muted-foreground">
                    <th className="px-4 py-3 font-medium">IP</th>
                    <th className="px-4 py-3 font-medium">Hostname</th>
                    <th className="px-4 py-3 font-medium">MAC</th>
                    <th className="px-4 py-3 font-medium">Fabricante</th>
                    <th className="px-4 py-3 font-medium">Sistema</th>
                    <th className="px-4 py-3 font-medium">Portas abertas</th>
                    <th className="px-4 py-3 font-medium">Status</th>
                    <th className="px-4 py-3 font-medium">Visto em</th>
                  </tr>
                </thead>
                <tbody>
                  {devices?.map((device) => (
                    <tr key={device.id} className="border-b border-border last:border-0">
                      <td className="px-4 py-3 font-mono">{device.ip}</td>
                      <td className="px-4 py-3">{device.hostname ?? "—"}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {device.mac_address ?? "—"}
                      </td>
                      <td className="px-4 py-3">{device.vendor ?? "—"}</td>
                      <td className="px-4 py-3 text-xs">
                        {formatOsLabel(device.os_name, device.os_accuracy, device.os_family)}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs">
                        {formatPortsSummary(
                          (device.ports ?? []).map((port) => ({
                            port_number: port.port_number,
                            service_name: port.service_name,
                            service_product: port.service_product,
                            service_version: port.service_version,
                          }))
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
                            device.status === "online"
                              ? "bg-emerald-500/15 text-emerald-400"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          {device.status === "online" ? "Online" : "Offline"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {new Intl.DateTimeFormat("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        }).format(new Date(device.first_seen_at))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="px-4 pb-4 text-sm text-muted-foreground">
              Execute um scan com o agente para popular o inventário.{" "}
              <Link href="/agents" className="text-foreground underline">
                Registrar agente
              </Link>
            </p>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
