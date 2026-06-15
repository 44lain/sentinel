import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { SiteFooter } from "@/components/layout/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Termos de Uso — NetAtlas",
  description: "Termos de uso do NetAtlas.",
};

export default function TermsPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-border border-b px-6 py-4">
        <Link href="/" className="inline-block w-40">
          <Logo variant="full" />
        </Link>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="text-heading-1 mb-2">Termos de Uso</h1>
        <p className="text-caption mb-8">Última atualização: junho de 2026 · Versão 1.0.0</p>

        <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-heading-3">1. Aceitação</h2>
            <p className="text-muted-foreground">
              Ao utilizar o NetAtlas (&quot;Plataforma&quot;), você concorda com estes Termos de
              Uso. Se não concordar, não utilize o serviço. O NetAtlas é um software open source sob
              licença MIT, oferecido como está, para descoberta e monitoramento de redes locais.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">2. Uso permitido</h2>
            <p className="text-muted-foreground">
              Você deve utilizar a Plataforma apenas em redes que possui autorização para monitorar.
              É proibido escanear redes de terceiros sem consentimento explícito. O agente local
              executa varreduras Nmap na sua infraestrutura — você é responsável pelo cumprimento
              das leis e políticas internas aplicáveis.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">3. Conta e segurança</h2>
            <p className="text-muted-foreground">
              Você é responsável por manter a confidencialidade das credenciais de acesso e dos
              tokens de agente. Tokens de agente são exibidos uma única vez no registro; revogue
              agentes comprometidos imediatamente. Notifique-nos em caso de uso não autorizado da
              sua conta.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">4. Dados e propriedade</h2>
            <p className="text-muted-foreground">
              Os dados de scan (dispositivos, portas, riscos) pertencem a você. A Plataforma
              processa esses dados para exibição no dashboard. Consulte a{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Política de Privacidade
              </Link>{" "}
              para detalhes sobre tratamento de dados pessoais.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">5. Isenção de garantias</h2>
            <p className="text-muted-foreground">
              O NetAtlas é fornecido &quot;como está&quot;, sem garantias de disponibilidade
              contínua, ausência de erros ou adequação a um propósito específico. Classificações de
              risco são orientativas e não substituem avaliação profissional de segurança.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">6. Limitação de responsabilidade</h2>
            <p className="text-muted-foreground">
              Na extensão permitida pela lei, os mantenedores do NetAtlas não serão responsáveis por
              danos indiretos, perda de dados ou interrupções decorrentes do uso da Plataforma.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">7. Alterações e contato</h2>
            <p className="text-muted-foreground">
              Estes termos podem ser atualizados. O uso continuado após alterações constitui
              aceitação. Dúvidas:{" "}
              <a href="mailto:lain.fork@gmail.com" className="text-primary hover:underline">
                lain.fork@gmail.com
              </a>
              .
            </p>
          </section>
        </div>

        <div className="mt-10">
          <Link href="/" className={cn(buttonVariants({ variant: "outline" }))}>
            Voltar ao início
          </Link>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
