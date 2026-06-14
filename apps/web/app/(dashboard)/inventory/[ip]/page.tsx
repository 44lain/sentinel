import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { DeviceInfoCards, DeviceMeta } from "@/components/devices/device-info-cards";
import { DevicePortsTable } from "@/components/devices/device-ports-table";
import { DeviceRisksList } from "@/components/devices/device-risks-list";
import { DeviceScanHistory } from "@/components/devices/device-scan-history";
import { buttonVariants } from "@/components/ui/button";
import { getDeviceDetail } from "@/lib/devices/queries";
import { cn } from "@/lib/utils";

interface DevicePageProps {
  params: Promise<{ ip: string }>;
}

export default async function DeviceDetailPage({ params }: DevicePageProps) {
  const { ip: rawIp } = await params;
  const ip = decodeURIComponent(rawIp);
  const device = await getDeviceDetail(ip);

  if (!device) {
    notFound();
  }

  const subtitle = device.hostname ?? device.vendor ?? "Dispositivo de rede";

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <PageHeader title={device.ip} description={subtitle}>
        <Link href="/inventory" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
          <ArrowLeft className="size-3.5" />
          Inventário
        </Link>
      </PageHeader>

      <DeviceInfoCards device={device} />
      <DeviceMeta device={device} />

      <div className="grid gap-6 xl:grid-cols-2">
        <DevicePortsTable ports={device.ports} />
        <DeviceRisksList risks={device.risks} />
      </div>

      <DeviceScanHistory history={device.history} />
    </main>
  );
}
