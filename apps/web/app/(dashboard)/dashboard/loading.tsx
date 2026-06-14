import { DevicesTableSkeleton, MetricsSkeleton } from "@/components/dashboard/metrics-skeleton";

export default function DashboardLoading() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-8">
      <div className="space-y-2">
        <div className="h-8 w-40 animate-pulse rounded bg-muted" />
        <div className="h-4 w-64 animate-pulse rounded bg-muted" />
      </div>
      <MetricsSkeleton />
      <DevicesTableSkeleton />
    </main>
  );
}
