import { PageHeader } from "@/components/layout/page-header";
import { AboutSection } from "@/components/settings/about-section";
import { PreferencesSection } from "@/components/settings/preferences-section";
import { ProfileSection } from "@/components/settings/profile-section";
import { SecuritySection } from "@/components/settings/security-section";
import { createClient } from "@/lib/supabase/server";

export default async function SettingsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const email = user?.email ?? "";
  const displayName =
    typeof user?.user_metadata?.full_name === "string"
      ? user.user_metadata.full_name
      : typeof user?.user_metadata?.name === "string"
        ? user.user_metadata.name
        : null;

  return (
    <main className="flex flex-1 flex-col gap-6 p-6 md:p-8">
      <PageHeader
        title="Configurações"
        description="Gerencie sua conta, preferências e segurança."
      />

      <div className="mx-auto flex w-full max-w-3xl flex-col gap-6">
        <ProfileSection email={email} displayName={displayName} />
        <PreferencesSection />
        <SecuritySection email={email} />
        <AboutSection />
      </div>
    </main>
  );
}
