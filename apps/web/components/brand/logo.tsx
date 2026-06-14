import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Dimensões reais de logo-netatlas.png (proporção ~3.5:1 — escalar por largura, não altura). */
const LOGO_FULL_WIDTH = 913;
const LOGO_FULL_HEIGHT = 261;

interface LogoProps {
  variant?: "full" | "icon";
  href?: string;
  className?: string;
}

export function Logo({ variant = "full", href, className }: LogoProps) {
  const image =
    variant === "icon" ? (
      <Image
        src="/logo.png"
        alt="NetAtlas"
        width={120}
        height={120}
        className={cn("h-10 w-10", className)}
        priority
      />
    ) : (
      <Image
        src="/logo-netatlas.png"
        alt="NetAtlas"
        width={LOGO_FULL_WIDTH}
        height={LOGO_FULL_HEIGHT}
        className={cn("h-auto w-full", className)}
        priority
      />
    );

  if (!href) return image;

  return (
    <Link href={href} className="block w-full">
      {image}
    </Link>
  );
}
