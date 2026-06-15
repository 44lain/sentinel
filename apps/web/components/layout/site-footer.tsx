import Link from "next/link";
import { cn } from "@/lib/utils";

interface SiteFooterProps {
  className?: string;
}

export function SiteFooter({ className }: SiteFooterProps) {
  return (
    <footer
      className={cn(
        "text-muted-foreground border-border flex flex-wrap items-center justify-center gap-x-4 gap-y-2 border-t px-6 py-6 text-xs",
        className
      )}
    >
      <span>© {new Date().getFullYear()} NetAtlas</span>
      <Link href="/terms" className="hover:text-foreground transition-colors">
        Termos de uso
      </Link>
      <Link href="/privacy" className="hover:text-foreground transition-colors">
        Privacidade
      </Link>
      <a href="mailto:lain.fork@gmail.com" className="hover:text-foreground transition-colors">
        lain.fork@gmail.com
      </a>
    </footer>
  );
}
