import { DeleteAccountSection } from "@/components/settings/delete-account-section";
import { ProfileSection } from "@/components/settings/profile-section";
import { SecuritySection } from "@/components/settings/security-section";
import { createClient } from "@/lib/supabase/server";

export default async function AccountSettingsPage() {
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
    <div className="flex flex-col gap-6">
      <ProfileSection email={email} displayName={displayName} />
      <SecuritySection email={email} />
      <DeleteAccountSection email={email} />
    </div>
  );
}
