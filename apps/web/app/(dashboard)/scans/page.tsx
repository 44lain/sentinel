import { PageHeader } from "@/components/layout/page-header";
import { ScanHistoryChart } from "@/components/scans/scan-history-chart";
import { ScansEmptyState } from "@/components/scans/scans-empty";
import { ScansTable } from "@/components/scans/scans-table";
import { getScanHistoryChart, getScansList, hasAnyScan } from "@/lib/scans/queries";

export default async function ScansPage() {
  const hasScan = await hasAnyScan();

  if (!hasScan) {
    return (
      <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
        <PageHeader
          title="Scans"
          description="Histórico de varreduras executadas pelos seus agentes."
        />
        <ScansEmptyState />
      </main>
    );
  }

  const [scans, chartData] = await Promise.all([getScansList(), getScanHistoryChart()]);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <PageHeader
        title="Scans"
        description="Histórico de varreduras executadas pelos seus agentes."
      />
      <ScanHistoryChart data={chartData} />
      <ScansTable scans={scans} />
    </main>
  );
}
