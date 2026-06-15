import Link from "next/link";
import { AboutSection } from "@/components/settings/about-section";
import { PreferencesSection } from "@/components/settings/preferences-section";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Bot } from "lucide-react";

export default function PreferencesSettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <PreferencesSection />
      <Card>
        <CardHeader>
          <CardTitle className="text-heading-3 flex items-center gap-2">
            <Bot className="text-primary size-5" />
            Agentes
          </CardTitle>
          <CardDescription>
            Registre tokens, acompanhe status e revogue agentes da sua rede.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Link href="/agents" className={cn(buttonVariants({ variant: "outline" }))}>
            Gerenciar agentes
          </Link>
        </CardContent>
      </Card>
      <AboutSection />
    </div>
  );
}
