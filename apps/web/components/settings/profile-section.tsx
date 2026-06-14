import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileSectionProps {
  email: string;
  displayName: string | null;
}

function getInitials(email: string, displayName: string | null): string {
  if (displayName?.trim()) {
    return displayName
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase())
      .join("");
  }
  return email.slice(0, 2).toUpperCase();
}

export function ProfileSection({ email, displayName }: ProfileSectionProps) {
  const initials = getInitials(email, displayName);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading-3">Conta</CardTitle>
        <CardDescription>Informações básicas do seu perfil.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 sm:flex-row sm:items-center">
        <div className="bg-primary/15 text-primary flex size-16 items-center justify-center rounded-full text-lg font-semibold">
          {initials}
        </div>
        <div className="space-y-3 text-sm">
          <div>
            <p className="text-caption">Nome</p>
            <p className="font-medium">{displayName?.trim() || "Não informado"}</p>
          </div>
          <div>
            <p className="text-caption">E-mail</p>
            <p className="font-medium">{email}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
