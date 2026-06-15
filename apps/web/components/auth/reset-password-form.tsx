"use client";

import { useActionState, useState } from "react";
import { resetPassword } from "@/app/(auth)/actions";
import { AuthCard } from "@/components/auth/auth-shell";
import { AuthMessage } from "@/components/auth/auth-message";
import { PasswordStrength } from "@/components/settings/password-strength";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ResetPasswordForm() {
  const [state, formAction, pending] = useActionState(resetPassword, null);
  const [password, setPassword] = useState("");

  return (
    <AuthCard>
      <div className="p-6 pb-0">
        <h2 className="text-heading-3">Nova senha</h2>
        <p className="text-muted-foreground text-sm">Defina uma nova senha para sua conta</p>
      </div>
      <form action={formAction}>
        <div className="space-y-4 p-6">
          <AuthMessage error={state?.error} success={state?.success} />
          <div className="space-y-2">
            <Label htmlFor="password">Nova senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              disabled={pending}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <PasswordStrength password={password} />
            {state?.fieldErrors?.password ? (
              <p className="text-destructive text-sm">{state.fieldErrors.password[0]}</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar senha</Label>
            <Input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={8}
              disabled={pending}
            />
            {state?.fieldErrors?.confirmPassword ? (
              <p className="text-destructive text-sm">{state.fieldErrors.confirmPassword[0]}</p>
            ) : null}
          </div>
        </div>
        <div className="border-t p-6 pt-0">
          <Button type="submit" className="cyber-cta-glow w-full" disabled={pending}>
            {pending ? "Salvando…" : "Redefinir senha"}
          </Button>
        </div>
      </form>
    </AuthCard>
  );
}
