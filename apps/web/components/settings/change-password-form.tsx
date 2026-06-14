"use client";

import { useState } from "react";
import { Check, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast-provider";
import { cn } from "@/lib/utils";
import { evaluatePassword, PasswordStrength } from "./password-strength";

interface ChangePasswordFormProps {
  email: string;
}

function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete: string;
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          autoComplete={autoComplete}
          required
          className="pr-10"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          className="text-muted-foreground hover:text-foreground absolute top-1/2 right-2 -translate-y-1/2 rounded p-1"
          aria-label={visible ? "Ocultar senha" : "Mostrar senha"}
          tabIndex={-1}
        >
          {visible ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}

export function ChangePasswordForm({ email }: ChangePasswordFormProps) {
  const { push } = useToast();
  const [current, setCurrent] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const matches = confirm.length > 0 && password === confirm;
  const strongEnough = evaluatePassword(password).score >= 2;
  const canSubmit = current.length > 0 && strongEnough && matches && !loading;

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    if (password === current) {
      push({
        variant: "error",
        title: "Escolha uma senha diferente",
        description: "A nova senha não pode ser igual à atual.",
      });
      return;
    }

    setLoading(true);
    const supabase = createClient();

    // 1. Reautentica o usuário validando a senha atual antes de permitir a troca.
    const { error: reauthError } = await supabase.auth.signInWithPassword({
      email,
      password: current,
    });

    if (reauthError) {
      setLoading(false);
      push({
        variant: "error",
        title: "Senha atual incorreta",
        description: "Não conseguimos confirmar sua identidade. Verifique a senha atual.",
      });
      return;
    }

    // 2. Aplica a nova senha somente após a validação.
    const { error: updateError } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (updateError) {
      push({
        variant: "error",
        title: "Não foi possível alterar a senha",
        description: updateError.message,
      });
      return;
    }

    setCurrent("");
    setPassword("");
    setConfirm("");
    setSuccess(true);
    window.setTimeout(() => setSuccess(false), 4000);
    push({
      variant: "success",
      title: "Senha atualizada com sucesso",
      description: "Sua nova senha já está em vigor neste dispositivo.",
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md space-y-5">
      <PasswordInput
        id="current-password"
        label="Senha atual"
        value={current}
        onChange={setCurrent}
        autoComplete="current-password"
      />

      <div className="bg-border h-px" />

      <div className="space-y-2">
        <PasswordInput
          id="new-password"
          label="Nova senha"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
        />
        <PasswordStrength password={password} />
      </div>

      <div className="space-y-2">
        <PasswordInput
          id="confirm-password"
          label="Confirmar nova senha"
          value={confirm}
          onChange={setConfirm}
          autoComplete="new-password"
        />
        {confirm.length > 0 ? (
          <p
            className={cn(
              "flex items-center gap-1.5 text-xs",
              matches ? "text-success" : "text-danger"
            )}
          >
            <Check className={cn("size-3.5", matches ? "opacity-100" : "opacity-40")} />
            {matches ? "As senhas conferem" : "As senhas não conferem"}
          </p>
        ) : null}
      </div>

      <Button type="submit" disabled={!canSubmit}>
        {success ? (
          <>
            <Check className="size-4" />
            Senha alterada
          </>
        ) : loading ? (
          "Validando…"
        ) : (
          <>
            <ShieldCheck className="size-4" />
            Alterar senha
          </>
        )}
      </Button>
    </form>
  );
}
