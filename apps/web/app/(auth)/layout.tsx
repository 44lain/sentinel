import { Logo } from "@/components/brand/logo";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <main className="flex flex-1 flex-col items-center justify-center p-6">
      <div className="mb-8 w-64">
        <Logo variant="full" />
      </div>
      {children}
    </main>
  );
}
