import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ThemeSelector } from "@/components/theme/theme-selector";

export function PreferencesSection() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-heading-3">Preferências</CardTitle>
        <CardDescription>Personalize a aparência da aplicação.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <p className="text-sm font-medium">Tema</p>
          <ThemeSelector />
          <p className="text-caption">
            &quot;Sistema&quot; segue automaticamente o tema do navegador. Sua escolha é salva
            localmente neste dispositivo.
          </p>
        </div>
        <div className="space-y-2 opacity-60">
          <p className="text-sm font-medium">Idioma</p>
          <select
            disabled
            className="border-input bg-muted h-9 w-full max-w-xs rounded-md border px-3 text-sm"
            defaultValue="pt-BR"
          >
            <option value="pt-BR">Português (Brasil)</option>
            <option value="en">English (em breve)</option>
          </select>
          <p className="text-caption">Estrutura preparada para internacionalização futura.</p>
        </div>
      </CardContent>
    </Card>
  );
}
