"use client";

import Link from "next/link";
import { useActionState } from "react";
import { login } from "@/app/(auth)/actions";
import { AuthMessage } from "@/components/auth/auth-message";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface LoginFormProps {
  redirectTo?: string;
  authError?: string;
}

export function LoginForm({ redirectTo, authError }: LoginFormProps) {
  const [state, formAction, pending] = useActionState(login, null);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Entrar</CardTitle>
        <CardDescription>Acesse sua conta NetAtlas</CardDescription>
      </CardHeader>
      <form action={formAction}>
        {redirectTo ? <input type="hidden" name="redirect" value={redirectTo} /> : null}
        <CardContent className="space-y-4">
          <AuthMessage error={authError ?? state?.error} success={state?.success} />
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
          <div className="space-y-2 pb-6">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              disabled={pending}
            />
            {state?.fieldErrors?.password ? (
              <p className="text-destructive text-sm">{state.fieldErrors.password[0]}</p>
            ) : null}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button type="submit" className="w-full" disabled={pending}>
            {pending ? "Entrando…" : "Entrar"}
          </Button>
          <div className="text-muted-foreground flex w-full flex-col gap-2 text-center text-sm">
            <Link href="/forgot-password" className="hover:text-primary transition-colors">
              Esqueci minha senha
            </Link>
            <p>
              Não tem conta?{" "}
              <Link href="/register" className="text-primary font-medium hover:underline">
                Criar conta
              </Link>
            </p>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}
