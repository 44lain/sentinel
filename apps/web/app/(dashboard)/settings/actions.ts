"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function deleteAccount(): Promise<{ error?: string }> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sessão inválida." };
  }

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.deleteUser(user.id);

  if (error) {
    console.error("[settings] deleteAccount failed:", error.message);
    return { error: "Não foi possível excluir a conta. Tente novamente." };
  }

  await supabase.auth.signOut();

  return {};
}
