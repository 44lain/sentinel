import { Suspense } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { RisksFilters } from "@/components/risks/risks-filters";
import { RisksInsightsBar } from "@/components/risks/risks-insights";
import { RisksTable } from "@/components/risks/risks-table";
import { getRiskInsights, getRisks, type RiskSeverityFilter } from "@/lib/risks/queries";

interface RisksPageProps {
  searchParams: Promise<{ severity?: string }>;
}

function parseSeverity(value?: string): RiskSeverityFilter {
  if (value === "high" || value === "medium" || value === "low") return value;
  return "all";
}

export default async function RisksPage({ searchParams }: RisksPageProps) {
  const params = await searchParams;
  const severity = parseSeverity(params.severity);

  const [insights, risks] = await Promise.all([getRiskInsights(), getRisks(severity)]);

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <PageHeader
        title="Riscos"
        description="Exposições e vulnerabilidades detectadas na sua rede."
      />

      {insights.total > 0 ? <RisksInsightsBar insights={insights} /> : null}

      <Suspense fallback={<p className="text-caption">Carregando filtros…</p>}>
        <RisksFilters severity={severity} />
      </Suspense>

      <RisksTable risks={risks} />
    </main>
  );
}
