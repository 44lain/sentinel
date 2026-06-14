import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/** Dimensões reais das logos full (proporção ~3.5:1 — escalar por largura). */
const LOGO_FULL_WIDTH = 913;
const LOGO_FULL_HEIGHT = 261;

interface LogoProps {
  variant?: "full" | "icon";
  href?: string;
  className?: string;
}

/**
 * Logo do NetAtlas sensível ao tema.
 * - `logo-netatlas-light.png`: texto escuro, usado em fundo claro (tema light)
 * - `logo-netatlas.png`: texto claro, usado em fundo escuro (tema dark)
 * - `logo.png`: apenas o ícone (independe do tema)
 */
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
      <span className={cn("block w-full", className)}>
        <Image
          src="/logo-netatlas-light.png"
          alt="NetAtlas"
          width={LOGO_FULL_WIDTH}
          height={LOGO_FULL_HEIGHT}
          className="h-auto w-full dark:hidden"
          priority
        />
        <Image
          src="/logo-netatlas.png"
          alt="NetAtlas"
          width={LOGO_FULL_WIDTH}
          height={LOGO_FULL_HEIGHT}
          className="hidden h-auto w-full dark:block"
          priority
        />
      </span>
    );

  if (!href) return image;

  return (
    <Link href={href} className="block w-full transition-opacity hover:opacity-80">
      {image}
    </Link>
  );
}
