import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { RecentDevicesTable } from "@/components/dashboard/recent-devices-table";
import { PageHeader } from "@/components/layout/page-header";
import { getDashboardMetrics, getRecentDevices, hasAnyScan } from "@/lib/dashboard/queries";

export default async function DashboardPage() {
  const hasScan = await hasAnyScan();
  const apiUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  if (!hasScan) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        <PageHeader
          title="Dashboard"
          description="Visão geral da sua rede local e métricas do último scan."
        />
        <DashboardEmptyState apiUrl={apiUrl} />
      </main>
    );
  }

  const [metrics, devices] = await Promise.all([getDashboardMetrics(), getRecentDevices()]);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <PageHeader
        title="Dashboard"
        description="Visão geral da sua rede local e métricas do último scan."
      />
      <div className="space-y-6">
        <MetricsCards metrics={metrics} />
        <RecentDevicesTable devices={devices} />
      </div>
    </main>
  );
}
