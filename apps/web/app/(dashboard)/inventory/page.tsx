import { Suspense } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { DiscoveryTimeline } from "@/components/inventory/discovery-timeline";
import { InventoryCards } from "@/components/inventory/inventory-cards";
import { InventoryEmptyState } from "@/components/inventory/inventory-empty";
import { InventoryFilters } from "@/components/inventory/inventory-filters";
import { InventoryInsightsBar } from "@/components/inventory/inventory-insights";
import { InventoryTable } from "@/components/inventory/inventory-table";
import {
  computeInventoryInsights,
  dedupeDevicesByIp,
  getRecentDiscoveries,
  groupDevices,
  type InventoryDevice,
  type InventoryGroupBy,
  type InventoryView,
} from "@/lib/inventory/queries";
import { createClient } from "@/lib/supabase/server";
import { escapeLikePattern, sanitizeSearchTerm } from "@/lib/security/sanitize";

interface InventoryPageProps {
  searchParams: Promise<{
    search?: string;
    status?: string;
    view?: string;
    group?: string;
  }>;
}

function parseView(value?: string): InventoryView {
  return value === "cards" ? "cards" : "table";
}

function parseGroupBy(value?: string): InventoryGroupBy {
  if (value === "vendor" || value === "status") return value;
  return "none";
}

export default async function InventoryPage({ searchParams }: InventoryPageProps) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const statusFilter =
    params.status === "online" || params.status === "offline" ? params.status : "";
  const view = parseView(params.view);
  const groupBy = parseGroupBy(params.group);

  const supabase = await createClient();
  let query = supabase
    .from("devices")
    .select(
      "id, scan_id, ip, hostname, mac_address, vendor, status, first_seen_at, os_name, os_accuracy, os_family, ports(port_number, service_name, service_product, service_version)"
    )
    .order("first_seen_at", { ascending: false })
    .limit(200);

  if (statusFilter) {
    query = query.eq("status", statusFilter);
  }
  if (search) {
    const term = escapeLikePattern(sanitizeSearchTerm(search));
    query = query.or(`ip.ilike.%${term}%,hostname.ilike.%${term}%,vendor.ilike.%${term}%`);
  }

  const { data: rawDevices, error } = await query;

  if (error) {
    console.error("[inventory] devices query failed:", error.message);
  }

  const devices = dedupeDevicesByIp((rawDevices ?? []) as InventoryDevice[]);
  const insights = computeInventoryInsights(devices);
  const groups = groupDevices(devices, groupBy);
  const recent = getRecentDiscoveries(devices);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <PageHeader
        title="Inventário"
        description="Dispositivos únicos descobertos na sua rede — sem duplicatas entre scans."
      />

      {devices.length > 0 ? <InventoryInsightsBar insights={insights} /> : null}

      <Card>
        <CardHeader>
          <CardTitle className="text-heading-3">Filtros e visualização</CardTitle>
          <CardDescription>Refine a lista e escolha como visualizar os dados.</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<p className="text-caption">Carregando filtros…</p>}>
            <InventoryFilters
              search={search}
              statusFilter={statusFilter}
              view={view}
              groupBy={groupBy}
            />
          </Suspense>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-heading-3">Dispositivos</CardTitle>
          <CardDescription>
            {devices.length === 0
              ? "Nenhum dispositivo encontrado com os filtros atuais."
              : `${devices.length} dispositivo(s) único(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent className={view === "table" ? "p-0" : undefined}>
          {devices.length === 0 ? (
            <InventoryEmptyState />
          ) : view === "cards" ? (
            <div className="space-y-6">
              {groups.map((group) => (
                <InventoryCards
                  key={group.label}
                  devices={group.devices}
                  groupLabel={groupBy !== "none" ? group.label : undefined}
                />
              ))}
            </div>
          ) : (
            <InventoryTable
              groups={groups}
              showGroupHeaders={groupBy !== "none"}
              hideVendorColumn={groupBy === "vendor"}
            />
          )}
        </CardContent>
      </Card>

      {devices.length > 0 && recent.length > 0 ? <DiscoveryTimeline devices={recent} /> : null}
    </main>
  );
}
