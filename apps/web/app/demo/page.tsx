import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { MetricsCards } from "@/components/dashboard/metrics-cards";
import { SiteFooter } from "@/components/layout/site-footer";
import { InventoryTable } from "@/components/inventory/inventory-table";
import { RisksInsightsBar } from "@/components/risks/risks-insights";
import { RisksTable } from "@/components/risks/risks-table";
import { ScanHistoryChart } from "@/components/scans/scan-history-chart";
import { ThemeToggle } from "@/components/theme/theme-toggle";
import { buttonVariants } from "@/components/ui/button";
import {
  DEMO_CHART,
  DEMO_DEVICES,
  DEMO_METRICS,
  DEMO_RISK_INSIGHTS,
  DEMO_RISKS,
} from "@/lib/demo/sample-data";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

export const metadata = {
  title: "Demo — NetAtlas",
  description: "Explore o NetAtlas com dados de demonstração de uma rede doméstica.",
};

export default function DemoPage() {
  return (
    <div className="flex min-h-full flex-col">
      <header className="border-border bg-background/80 sticky top-0 z-40 border-b backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 md:px-6">
          <Link href="/" className="w-36 shrink-0 md:w-44">
            <Logo variant="full" />
          </Link>
          <span className="text-muted-foreground hidden text-sm sm:inline">Demo interativa</span>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <Link href="/register" className={cn(buttonVariants({ size: "sm" }))}>
              Criar conta
            </Link>
            <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "sm" }))}>
              Entrar
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-8 p-6 md:p-8">
        <div className="border-primary/30 bg-primary/5 flex items-start gap-3 rounded-xl border p-4">
          <Sparkles className="text-primary mt-0.5 size-5 shrink-0" />
          <div className="space-y-1">
            <p className="font-medium">Dados de demonstração</p>
            <p className="text-muted-foreground text-sm">
              Esta página exibe um homelab fictício — inventário, riscos e evolução de scans. Crie
              uma conta gratuita para monitorar sua própria rede com o agente local.
            </p>
          </div>
        </div>

        <section className="space-y-2">
          <h1 className="text-heading-2">Dashboard de rede</h1>
          <p className="text-muted-foreground text-sm">
            Visão consolidada após o último scan do agente NetAtlas.
          </p>
        </section>

        <MetricsCards metrics={DEMO_METRICS} />

        <section className="space-y-4">
          <h2 className="text-heading-3">Evolução dos scans</h2>
          <ScanHistoryChart data={DEMO_CHART} />
        </section>

        <section className="space-y-4">
          <h2 className="text-heading-3">Inventário</h2>
          <InventoryTable groups={[{ devices: DEMO_DEVICES }]} />
        </section>

        <section className="space-y-4">
          <h2 className="text-heading-3">Riscos detectados</h2>
          <RisksInsightsBar insights={DEMO_RISK_INSIGHTS} />
          <RisksTable risks={DEMO_RISKS} />
        </section>

        <section className="border-border bg-muted/30 rounded-xl border p-6 text-center">
          <h2 className="text-heading-3">Pronto para mapear sua rede?</h2>
          <p className="text-muted-foreground mx-auto mt-2 max-w-lg text-sm">
            Instale o agente Python na sua rede local, registre um token no dashboard e veja
            dispositivos, portas e riscos em minutos.
          </p>
          <div className="mt-4 flex flex-wrap justify-center gap-3">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
              Começar grátis
            </Link>
            <Link href="/" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
              Voltar ao início
            </Link>
          </div>
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
