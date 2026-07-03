import Image from "next/image";
import { useTranslations } from "next-intl";

import { HashLink } from "@/components/hash-link";
import { KasyLogo } from "@/components/kasy-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { surfaceBorderClass } from "@/lib/surface-border";
import { cn } from "@/lib/utils";

/** Mesma dupla claro/escuro do hero — aqui só a base da paisagem, sutil, atrás do conteúdo. */
const FOOTER_ART_IMAGES = {
  light: { src: "/assets/hero-light.png", width: 2944, height: 1648 },
  dark: { src: "/assets/hero-dark.png", width: 2944, height: 1648 },
} as const;

const footerArtImageClass = "object-cover object-[50%_78%] scale-[1.15]";

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
  const t = useTranslations("footer");

  const FOOTER_LINKS = [
    { href: "#precos", label: t("links.pricing") },
    { href: "/documentacao", label: t("links.docs") },
  ] as const;

  return (
    <footer className="relative isolate flex min-h-[clamp(20rem,34vw,28rem)] items-end overflow-hidden">
      <FooterBackdropArt />

      <div
        className={cn(
          "relative z-10 mx-auto flex w-full flex-col",
          "max-w-[min(96vw,76rem)]",
          "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
          "py-[clamp(3rem,6vw,5rem)] max-sm:py-[clamp(2.5rem,8vw,3.5rem)]",
        )}
      >
        <div className="flex flex-col gap-7 max-sm:gap-6 sm:flex-row sm:items-center sm:justify-between sm:gap-8">
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
                {t("byAicrus")}
              </a>
            </div>
            <p className="max-w-sm text-pretty text-[0.8125rem] leading-relaxed text-muted-foreground max-sm:max-w-none max-sm:leading-snug">
              <span className="block sm:inline">{t("tagline.lead")}</span>
              <span className="block sm:inline">
                <span className="hidden sm:inline"> </span>
                {t("tagline.tail")}
              </span>
            </p>
          </div>

          <nav className="flex flex-col gap-3 max-sm:gap-2.5 sm:shrink-0 sm:flex-row sm:items-center sm:gap-6">
            <div className="flex flex-col gap-2.5 max-sm:gap-2 sm:flex-row sm:items-center sm:gap-6">
              {FOOTER_LINKS.map((link) => {
                const className =
                  "text-sm font-medium text-muted-foreground transition-colors hover:text-foreground";

                if (link.href.startsWith("#")) {
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
            </div>
            <Button
              variant="outline"
              nativeButton={false}
              className="hidden h-auto shrink-0 rounded-full px-4 py-2 sm:inline-flex"
              render={<Link href="/obter-kasy" />}
            >
              {t("cta")}
            </Button>
          </nav>
        </div>

        <div
          className={cn(
            "mt-8 flex flex-col gap-4 border-t pt-6 max-sm:mt-7 max-sm:gap-4 max-sm:pt-5",
            "sm:mt-10 sm:flex-row sm:items-center sm:justify-between",
            surfaceBorderClass,
          )}
        >
          <div className="flex items-center gap-2.5 max-sm:justify-between sm:order-2 sm:justify-end">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
          <p className="shrink-0 text-xs text-muted-foreground max-sm:whitespace-nowrap sm:order-1">
            {t("copyright")}
          </p>
        </div>
      </div>
    </footer>
  );
}
