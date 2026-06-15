import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { SiteFooter } from "@/components/layout/site-footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Política de Privacidade — NetAtlas",
  description: "Como o NetAtlas trata dados pessoais.",
};

export default function PrivacyPage() {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <header className="border-border border-b px-6 py-4">
        <Link href="/" className="inline-block w-40">
          <Logo variant="full" />
        </Link>
      </header>
      <main className="mx-auto w-full max-w-3xl flex-1 px-6 py-10">
        <h1 className="text-heading-1 mb-2">Política de Privacidade</h1>
        <p className="text-caption mb-8">Última atualização: junho de 2026 · Versão 1.0.0</p>

        <div className="space-y-6 text-sm leading-relaxed">
          <section className="space-y-2">
            <h2 className="text-heading-3">1. Controlador e contato</h2>
            <p className="text-muted-foreground">
              O NetAtlas é um projeto open source. Para questões sobre privacidade e proteção de
              dados (LGPD), entre em contato:{" "}
              <a href="mailto:lain.fork@gmail.com" className="text-primary hover:underline">
                lain.fork@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">2. Dados que coletamos</h2>
            <ul className="text-muted-foreground list-disc space-y-1 pl-5">
              <li>
                <strong className="text-foreground">Conta:</strong> e-mail, senha (hash), nome
                opcional, metadados de autenticação via Supabase Auth.
              </li>
              <li>
                <strong className="text-foreground">Operação:</strong> resultados de scans
                (endereços IP, hostnames, MAC, portas, riscos), registros de agentes e timestamps.
              </li>
              <li>
                <strong className="text-foreground">Técnicos:</strong> logs de servidor e métricas
                de hospedagem (Vercel/Supabase) conforme políticas dos provedores.
              </li>
            </ul>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">3. Finalidades e bases legais (LGPD)</h2>
            <p className="text-muted-foreground">
              Tratamos dados para: (i) autenticação e gestão de conta — execução de contrato; (ii)
              exibição de inventário e riscos — execução do serviço solicitado; (iii) segurança da
              plataforma — legítimo interesse; (iv) cumprimento de obrigações legais quando
              aplicável.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">4. Armazenamento e segurança</h2>
            <p className="text-muted-foreground">
              Dados são armazenados em Supabase (PostgreSQL) com Row Level Security (RLS) por
              usuário. Comunicações usam HTTPS. Tokens de agente são armazenados como hash bcrypt.
              Adotamos práticas alinhadas a boas práticas de segurança da informação (controle de
              acesso, validação de entrada, headers de segurança). Nenhum sistema é 100% seguro —
              notifique-nos incidentes suspeitos.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">5. Compartilhamento</h2>
            <p className="text-muted-foreground">
              Não vendemos dados pessoais. Compartilhamos apenas com provedores de infraestrutura
              necessários à operação (hospedagem, banco de dados, autenticação), sob contratos de
              processamento adequados.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">6. Seus direitos</h2>
            <p className="text-muted-foreground">
              Nos termos da LGPD, você pode solicitar: confirmação de tratamento, acesso, correção,
              anonimização, portabilidade, eliminação de dados desnecessários e revogação de
              consentimento quando aplicável. A exclusão de conta pode ser feita em Configurações →
              Conta. Prazo de resposta: até 15 dias úteis.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">7. Retenção</h2>
            <p className="text-muted-foreground">
              Mantemos dados enquanto a conta estiver ativa ou conforme necessário para operação e
              obrigações legais. Após exclusão da conta, dados associados são removidos conforme
              políticas de cascata do banco de dados.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">8. Cookies e preferências</h2>
            <p className="text-muted-foreground">
              Utilizamos cookies de sessão para autenticação (Supabase) e localStorage para
              preferência de tema (`netatlas-theme`). Não utilizamos cookies de rastreamento
              publicitário.
            </p>
          </section>

          <section className="space-y-2">
            <h2 className="text-heading-3">9. Alterações</h2>
            <p className="text-muted-foreground">
              Esta política pode ser atualizada. Alterações relevantes serão comunicadas na
              Plataforma. Versão atual sempre disponível nesta página.
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
