import { MetricsSkeleton, DevicesTableSkeleton } from "@/components/dashboard/metrics-skeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <div className="space-y-2">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <MetricsSkeleton />
      <DevicesTableSkeleton />
    </main>
  );
}
