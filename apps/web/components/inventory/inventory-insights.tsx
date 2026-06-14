import { AlertTriangle, Monitor, Plus, WifiOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import type { InventoryInsights } from "@/lib/inventory/queries";

interface InventoryInsightsBarProps {
  insights: InventoryInsights;
}

export function InventoryInsightsBar({ insights }: InventoryInsightsBarProps) {
  const items = [
    {
      label: "Dispositivos únicos",
      value: insights.totalUnique,
      icon: Monitor,
      tone: "text-primary",
    },
    {
      label: "Novos (7 dias)",
      value: insights.newLast7Days,
      icon: Plus,
      tone: "text-info",
      hidden: insights.newLast7Days === 0,
    },
    {
      label: "Offline",
      value: insights.offlineCount,
      icon: WifiOff,
      tone: "text-warning",
      hidden: insights.offlineCount === 0,
    },
    {
      label: "Portas críticas",
      value: insights.criticalPortsCount,
      icon: AlertTriangle,
      tone: "text-danger",
      hidden: insights.criticalPortsCount === 0,
    },
  ].filter((item) => !item.hidden);

  return (
    <StaggerContainer className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((item) => {
        const Icon = item.icon;
        return (
          <StaggerItem key={item.label}>
            <Card className="border-border/80 hover:border-primary/40 h-full transition-all duration-200 hover:shadow-sm">
              <CardContent className="flex items-center gap-3 p-4">
                <div className="bg-muted flex size-9 items-center justify-center rounded-lg">
                  <Icon className={`size-4 ${item.tone}`} />
                </div>
                <div>
                  <p className="text-caption">{item.label}</p>
                  <p className="text-heading-3">{item.value}</p>
                </div>
              </CardContent>
            </Card>
          </StaggerItem>
        );
      })}
    </StaggerContainer>
  );
}
