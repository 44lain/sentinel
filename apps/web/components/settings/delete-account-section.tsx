"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { deleteAccount } from "@/app/(dashboard)/settings/actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast-provider";
import { AlertTriangle } from "lucide-react";

interface DeleteAccountSectionProps {
  email: string;
}

export function DeleteAccountSection({ email }: DeleteAccountSectionProps) {
  const router = useRouter();
  const { push } = useToast();
  const [confirmEmail, setConfirmEmail] = useState("");
  const [pending, startTransition] = useTransition();

  const canDelete = confirmEmail.trim().toLowerCase() === email.toLowerCase();

  function onDelete() {
    startTransition(async () => {
      const result = await deleteAccount();
      if (result.error) {
        push({
          title: "Não foi possível excluir a conta",
          description: result.error,
          variant: "error",
        });
        return;
      }
      push({
        title: "Conta excluída",
        description: "Sua conta foi removida permanentemente.",
        variant: "success",
      });
      router.push("/");
      router.refresh();
    });
  }

  return (
    <Card className="border-danger/30">
      <CardHeader>
        <CardTitle className="text-heading-3 text-danger flex items-center gap-2">
          <AlertTriangle className="size-5" />
          Excluir conta
        </CardTitle>
        <CardDescription>
          Remove permanentemente sua conta, agentes e todos os dados associados. Esta ação não pode
          ser desfeita.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="confirm-email">Digite seu e-mail para confirmar</Label>
          <Input
            id="confirm-email"
            type="email"
            value={confirmEmail}
            onChange={(e) => setConfirmEmail(e.target.value)}
            placeholder={email}
            autoComplete="off"
          />
        </div>
        <Button
          type="button"
          variant="destructive"
          disabled={!canDelete || pending}
          onClick={onDelete}
        >
          {pending ? "Excluindo…" : "Excluir minha conta"}
        </Button>
      </CardContent>
    </Card>
  );
}
