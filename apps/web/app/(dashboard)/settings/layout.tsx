import { PageHeader } from "@/components/layout/page-header";
import { SettingsNav } from "@/components/settings/settings-nav";

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <PageHeader
        title="Conta e configurações"
        description="Gerencie seus dados pessoais e preferências da plataforma."
      />
      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <SettingsNav />
        {children}
      </div>
    </main>
  );
}
