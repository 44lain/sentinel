import type { DeviceDetail } from "@/lib/devices/queries";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import { Card, CardContent } from "@/components/ui/card";
import { StatusBadge } from "@/components/ui/badge";
import { Monitor, Network, Server } from "lucide-react";

interface DeviceInfoCardsProps {
  device: DeviceDetail;
}

export function DeviceInfoCards({ device }: DeviceInfoCardsProps) {
  const cards = [
    {
      label: "Status",
      value: <StatusBadge status={device.status} />,
      icon: Monitor,
      tone: "text-primary",
    },
    {
      label: "Sistema",
      value: device.osLabel,
      icon: Server,
      tone: "text-info",
    },
    {
      label: "Portas abertas",
      value: String(device.ports.length),
      icon: Network,
      tone: "text-brand-cyan",
    },
    {
      label: "Agente",
      value: device.agentName,
      icon: Monitor,
      tone: "text-muted-foreground",
    },
  ];

  return (
    <StaggerContainer className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <StaggerItem key={card.label}>
            <Card className="border-border/80 hover:border-primary/40 h-full transition-all duration-200 hover:shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="bg-muted flex size-9 items-center justify-center rounded-lg">
                  <Icon className={`size-4 ${card.tone}`} />
                </div>
                <div>
                  <p className="text-caption">{card.label}</p>
                  <div className="text-heading-3">{card.value}</div>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}

interface DeviceMetaProps {
  device: DeviceDetail;
}

export function DeviceMeta({ device }: DeviceMetaProps) {
  const items = [
    { label: "Hostname", value: device.hostname ?? "—" },
    { label: "MAC", value: device.mac_address ?? "—", mono: true },
    { label: "Fabricante", value: device.vendor ?? "—" },
    {
      label: "Último scan",
      value: device.scanFinishedAt
        ? new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(
            new Date(device.scanFinishedAt)
          )
        : "Em andamento",
    },
    {
      label: "Primeira descoberta",
      value: new Intl.DateTimeFormat("pt-BR", { dateStyle: "short", timeStyle: "short" }).format(
        new Date(device.first_seen_at)
      ),
    },
    {
      label: "Aparições em scans",
      value: String(device.history.length),
    },
  ];

  return (
    <Card>
      <CardContent className="grid gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <div key={item.label}>
            <p className="text-caption">{item.label}</p>
            <p className={`text-sm font-medium ${item.mono ? "font-mono" : ""}`}>{item.value}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
