import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChangePasswordForm } from "./change-password-form";

interface SecuritySectionProps {
  email: string;
}

export function SecuritySection({ email }: SecuritySectionProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading-3">Segurança</CardTitle>
        <CardDescription>Gerencie credenciais e sessões da sua conta.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm font-medium">Alterar senha</p>
          <ChangePasswordForm email={email} />
        </div>
        <div className="border-border space-y-2 rounded-lg border border-dashed p-4">
          <p className="text-sm font-medium">Sessões ativas</p>
          <p className="text-caption">
            Em breve você poderá ver e revogar sessões em outros dispositivos.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
