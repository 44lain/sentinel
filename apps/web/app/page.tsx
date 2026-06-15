import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Radar } from "lucide-react";

export default function HomePage() {
  return (
    <main className="relative flex flex-1 flex-col items-center justify-center gap-8 overflow-hidden p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,oklch(0.55_0.2_250/0.12),transparent_55%)] dark:bg-[radial-gradient(ellipse_at_top,oklch(0.72_0.14_195/0.15),transparent_55%)]"
      />
      <div className="relative w-72">
        <Logo variant="full" />
      </div>
      <div className="relative space-y-3 text-center">
        <p className="text-label">Network Discovery & Monitoring</p>
        <h1 className="text-display max-w-2xl">
          Observabilidade de rede para equipes que precisam de clareza
        </h1>
        <p className="text-body text-muted-foreground mx-auto max-w-lg">
          Descubra dispositivos, inventarie portas abertas e identifique riscos na sua rede local —
          com um agente leve e uma interface focada em legibilidade.
        </p>
      </div>
      <div className="relative flex flex-wrap items-center justify-center gap-3">
        <Link href="/demo" className={cn(buttonVariants({ size: "lg" }))}>
          Ver demo
        </Link>
        <Link href="/login" className={cn(buttonVariants({ variant: "outline", size: "lg" }))}>
          Entrar
        </Link>
        <Link href="/register" className={cn(buttonVariants({ variant: "ghost", size: "lg" }))}>
          Criar conta
        </Link>
      </div>
      <div className="text-caption relative flex items-center gap-2">
        <Radar className="text-primary size-4" />
        Inventário · Scans · Riscos · Agentes locais
      </div>
    </main>
  );
}
