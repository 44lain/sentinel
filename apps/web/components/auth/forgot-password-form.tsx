"use client";

import Link from "next/link";
import { useActionState } from "react";
import { forgotPassword } from "@/app/(auth)/actions";
import { AuthCard } from "@/components/auth/auth-shell";
import { AuthMessage } from "@/components/auth/auth-message";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(forgotPassword, null);

  return (
    <AuthCard>
      <div className="p-6 pb-0">
        <h2 className="text-heading-3">Recuperar senha</h2>
        <p className="text-muted-foreground text-sm">
          Enviaremos um link de redefinição para seu e-mail
        </p>
      </div>
      <form action={formAction}>
        <div className="space-y-4 p-6">
          <AuthMessage error={state?.error} success={state?.success} />
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              disabled={pending}
            />
            {state?.fieldErrors?.email ? (
              <p className="text-destructive text-sm">{state.fieldErrors.email[0]}</p>
            ) : null}
          </div>
        </div>
        <div className="flex flex-col gap-4 border-t p-6 pt-0">
          <Button type="submit" className="cyber-cta-glow w-full" disabled={pending}>
            {pending ? "Enviando…" : "Enviar link"}
          </Button>
          <Link
            href="/login"
            className="text-muted-foreground hover:text-primary text-center text-sm transition-colors"
          >
            Voltar ao login
          </Link>
        </div>
      </form>
    </AuthCard>
  );
}
