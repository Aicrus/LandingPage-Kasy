import Image from "next/image";
import Link from "next/link";

import { HashLink } from "@/components/hash-link";
import { KasyLogo } from "@/components/kasy-logo";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { surfaceBorderClass } from "@/lib/surface-border";
import { cn } from "@/lib/utils";

const FOOTER_LINKS = [
  { href: "/#precos", label: "Preços" },
  { href: "/documentacao", label: "Documentação" },
] as const;

/** Mesma dupla claro/escuro do hero — aqui só a base da paisagem, sutil, atrás do conteúdo. */
const FOOTER_ART_IMAGES = {
  light: { src: "/assets/hero-light.png", width: 2944, height: 1648 },
  dark: { src: "/assets/hero-dark.png", width: 2944, height: 1648 },
} as const;

const footerArtImageClass =
  "object-cover object-[50%_78%] scale-[1.15]";

function FooterBackdropArt() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <Image
        src={FOOTER_ART_IMAGES.light.src}
        alt=""
        fill
        /* Frame é 100vw, mas scale-[1.15] amplia o render visual — sizes reflete isso */
        sizes="115vw"
        className={cn(footerArtImageClass, "dark:hidden")}
      />
      <Image
        src={FOOTER_ART_IMAGES.dark.src}
        alt=""
        fill
        sizes="115vw"
        className={cn(footerArtImageClass, "hidden dark:block")}
      />
      <div className="footer-backdrop-fade absolute inset-0" />
    </div>
  );
}

export function SiteFooter() {
  return (
    <footer className="relative isolate flex min-h-[clamp(24rem,42vw,34rem)] items-end overflow-hidden">
      <FooterBackdropArt />

      <div
        className={cn(
          "relative z-10 mx-auto flex w-full flex-col",
          "max-w-[min(96vw,76rem)]",
          "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
          "py-[clamp(3rem,6vw,5rem)]",
        )}
      >
        <div className="flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-center gap-2.5">
              <KasyLogo />
              <a
                href="https://aicrus.io/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "rounded-full border px-2.5 py-0.5 text-[0.6875rem] font-medium text-muted-foreground transition-colors hover:text-foreground",
                  surfaceBorderClass,
                )}
              >
                by Aicrus LLC
              </a>
            </div>
            <p className="max-w-xs text-[0.8125rem] text-muted-foreground">
              O starter Flutter que publica em iOS, Android e Web no dia um.
            </p>
          </div>

          <nav className="flex shrink-0 items-center gap-6">
            {FOOTER_LINKS.map((link) => {
              const className =
                "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

              if (link.href.includes("#")) {
                return (
                  <HashLink key={link.href} href={link.href} className={className}>
                    {link.label}
                  </HashLink>
                );
              }

              return (
                <Link key={link.href} href={link.href} className={className}>
                  {link.label}
                </Link>
              );
            })}
            <Button
              variant="outline"
              nativeButton={false}
              className="h-auto shrink-0 rounded-full px-4 py-2"
              render={<Link href="/obter-kasy" />}
            >
              Obter Kasy Pro
            </Button>
          </nav>
        </div>

        <div className="mt-10 flex items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            © 2026 Kasy. Todos os direitos reservados.
          </p>
          <ThemeToggle />
        </div>
      </div>
    </footer>
  );
}
