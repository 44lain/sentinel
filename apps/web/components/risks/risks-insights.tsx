import { AlertTriangle, ShieldAlert, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { StaggerContainer, StaggerItem } from "@/components/motion/stagger";
import type { RiskInsights } from "@/lib/risks/queries";

interface RisksInsightsBarProps {
  insights: RiskInsights;
}

export function RisksInsightsBar({ insights }: RisksInsightsBarProps) {
  const items = [
    {
      label: "Total de riscos",
      value: insights.total,
      icon: ShieldAlert,
      tone: "text-primary",
    },
    {
      label: "Severidade alta",
      value: insights.high,
      icon: AlertTriangle,
      tone: "text-danger",
      hidden: insights.high === 0,
    },
    {
      label: "Severidade média",
      value: insights.medium,
      icon: AlertTriangle,
      tone: "text-warning",
      hidden: insights.medium === 0,
    },
    {
      label: "Severidade baixa",
      value: insights.low,
      icon: ShieldCheck,
      tone: "text-info",
      hidden: insights.low === 0,
    },
  ].filter((item) => !item.hidden);

  if (items.length === 0) return null;

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
