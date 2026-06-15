import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { SiteFooter } from "@/components/layout/site-footer";
import { AuthShell } from "@/components/auth/auth-shell";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-full flex-1 flex-col">
      <AuthShell>
        <Link href="/" className="mb-8 block w-56 transition-opacity hover:opacity-90">
          <Logo variant="full" />
        </Link>
        {children}
      </AuthShell>
      <SiteFooter />
    </div>
  );
}
