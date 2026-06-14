import { Suspense } from "react";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import {
  DevicesTableSkeleton,
  MetricsSkeleton,
} from "@/components/dashboard/metrics-skeleton";
import { RecentDevicesTable } from "@/components/dashboard/recent-devices-table";
import {
  getDashboardMetrics,
  getRecentDevices,
  hasAnyScan,
} from "@/lib/dashboard/queries";

async function DashboardContent() {
  const hasScan = await hasAnyScan();

  if (!hasScan) {
    return <DashboardEmptyState />;
  }

  const [metrics, devices] = await Promise.all([getDashboardMetrics(), getRecentDevices()]);

  return (
    <div className="space-y-6">
      <MetricsCards metrics={metrics} />
      <RecentDevicesTable devices={devices} />
    </div>
  );
}

export default async function DashboardPage() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-8">
      <div>
        <h1 className="text-2xl font-semibold">Dashboard</h1>
        <p className="text-muted-foreground">Visão geral da sua rede local</p>
      </div>
      <Suspense
        fallback={
          <div className="space-y-6">
            <MetricsSkeleton />
            <DevicesTableSkeleton />
          </div>
        }
      >
        <DashboardContent />
      </Suspense>
    </main>
  );
}
