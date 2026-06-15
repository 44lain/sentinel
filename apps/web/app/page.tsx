import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { SiteFooter } from "@/components/layout/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Radar, Shield } from "lucide-react";

export default function HomePage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <main className="cyber-hero relative flex flex-1 flex-col items-center justify-center gap-10 overflow-hidden px-6 py-16">
        <div
          aria-hidden
          className="cyber-grid-bg pointer-events-none absolute inset-0 opacity-70"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.2_250/0.16),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.72_0.14_195/0.2),transparent_55%)]"
        />

        <div className="cyber-logo-glow relative w-72">
          <Logo variant="full" />
        </div>

        <div className="relative max-w-2xl space-y-4 text-center">
          <p className="text-label">Network Discovery & Monitoring</p>
          <h1 className="text-display">Observabilidade de rede com clareza e confiança</h1>
          <p className="text-body text-muted-foreground mx-auto max-w-lg">
            Descubra dispositivos, inventarie portas abertas e priorize riscos na sua rede local —
            com um agente leve e uma interface focada em segurança.
          </p>
        </div>

        <div className="relative flex flex-wrap items-center justify-center gap-3">
          <Link href="/demo" className={cn(buttonVariants({ size: "lg" }), "cyber-cta-glow")}>
            Ver demo
          </Link>
          <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
            Entrar
          </Link>
          <Link href="/register" className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}>
            Criar conta
          </Link>
        </div>

        <div className="relative grid max-w-3xl gap-4 sm:grid-cols-3">
          {[
            { icon: Radar, label: "Inventário em tempo real", desc: "Dispositivos e portas" },
            { icon: Shield, label: "Riscos priorizados", desc: "Severidade acionável" },
            { icon: Radar, label: "Agente local", desc: "Python + Nmap na sua rede" },
          ].map((item) => (
            <div
              key={item.label}
              className="cyber-card cyber-scanline border-border/80 rounded-xl border p-4 text-center"
            >
              <item.icon className="text-primary mx-auto mb-2 size-5" />
              <p className="text-sm font-medium">{item.label}</p>
              <p className="text-caption">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
