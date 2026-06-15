import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { ExportScanButton } from "@/components/export/export-scan-button";
import { PageHeader } from "@/components/layout/page-header";
import { ScanComparisonPanel } from "@/components/scans/scan-comparison";
import { ScanDetailCards } from "@/components/scans/scan-detail-cards";
import { getScanComparison, getScanDetail } from "@/lib/scans/queries";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScanDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ScanDetailPage({ params }: ScanDetailPageProps) {
  const { id } = await params;
  const [scan, comparison] = await Promise.all([getScanDetail(id), getScanComparison(id)]);

  if (!scan || !comparison) {
    notFound();
  }

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <PageHeader
        title="Detalhe do scan"
        description="Métricas, comparação com o scan anterior e exportação."
      >
        <div className="flex flex-wrap items-center gap-2">
          <Link href="/scans" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
            <ArrowLeft className="size-4" />
            Voltar
          </Link>
          <ExportScanButton scanId={scan.id} format="json" />
          <ExportScanButton scanId={scan.id} format="csv" />
        </div>
      </PageHeader>

      <ScanDetailCards scan={scan} />
      <ScanComparisonPanel comparison={comparison} />
    </main>
  );
}
