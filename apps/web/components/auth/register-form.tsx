"use client";

import Link from "next/link";
import { useActionState, useState } from "react";
import { register } from "@/app/(auth)/actions";
import { AuthCard } from "@/components/auth/auth-shell";
import { AuthMessage } from "@/components/auth/auth-message";
import { PasswordStrength } from "@/components/settings/password-strength";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(register, null);
  const [password, setPassword] = useState("");

  return (
    <AuthCard>
      <div className="p-6 pb-0">
        <h2 className="text-heading-3">Criar conta</h2>
        <p className="text-muted-foreground text-sm">Comece a monitorar sua rede local</p>
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
          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
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
        <div className="flex flex-col gap-4 border-t p-6 pt-0">
          <Button type="submit" className="cyber-cta-glow w-full" disabled={pending}>
            {pending ? "Criando…" : "Criar conta"}
          </Button>
          <p className="text-muted-foreground text-center text-sm">
            Já tem conta?{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </form>
    </AuthCard>
  );
}
