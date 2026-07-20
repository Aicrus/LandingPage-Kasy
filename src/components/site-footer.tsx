import Image from "next/image";
import { useTranslations } from "next-intl";

import { HashLink } from "@/components/hash-link";
import { KasyLogo } from "@/components/kasy-logo";
import { LanguageSwitcher } from "@/components/language-switcher";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import { CONTACT_EMAIL, contactMailtoHref } from "@/lib/contact";
import { surfaceBorderClass } from "@/lib/surface-border";
import { cn } from "@/lib/utils";

/** Mesma dupla claro/escuro do hero — aqui só a base da paisagem, sutil, atrás do conteúdo. */
const FOOTER_ART_IMAGES = {
  light: { src: "/assets/hero-light.png", width: 2944, height: 1648 },
  dark: { src: "/assets/hero-dark.png", width: 2944, height: 1648 },
} as const;

const footerArtImageClass = "object-cover object-[50%_78%] scale-[1.15]";

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="2.5" y="2.5" width="19" height="19" rx="5.5" />
      <circle cx="12" cy="12" r="4.25" />
      <circle cx="17.35" cy="6.65" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function XIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function YouTubeIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden
    >
      <path d="M23.5 6.2a3.02 3.02 0 0 0-2.12-2.14C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.38.56A3.02 3.02 0 0 0 .5 6.2 31.6 31.6 0 0 0 0 12a31.6 31.6 0 0 0 .5 5.8 3.02 3.02 0 0 0 2.12 2.14C4.5 20.5 12 20.5 12 20.5s7.5 0 9.38-.56a3.02 3.02 0 0 0 2.12-2.14A31.6 31.6 0 0 0 24 12a31.6 31.6 0 0 0-.5-5.8zM9.75 15.02V8.98L15.5 12l-5.75 3.02z" />
    </svg>
  );
}

const SOCIAL_LINKS = [
  {
    href: "https://www.instagram.com/trykasy",
    labelKey: "social.instagram" as const,
    icon: InstagramIcon,
  },
  {
    href: "https://x.com/trykasy",
    labelKey: "social.twitter" as const,
    icon: XIcon,
  },
  {
    href: "https://www.youtube.com/@trykasy",
    labelKey: "social.youtube" as const,
    icon: YouTubeIcon,
  },
] as const;

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
        className={cn(
          footerArtImageClass,
          "hero-kit-backdrop-flutter-tint hidden dark:block",
        )}
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden bg-[color-mix(in_srgb,var(--flutter-navy)_22%,transparent)] mix-blend-soft-light dark:block"
      />
      <div className="footer-backdrop-fade absolute inset-0" />
    </div>
  );
}

export function SiteFooter() {
  const t = useTranslations("footer");

  const FOOTER_LINKS = [
    { href: "#precos", label: t("links.pricing") },
    { href: "/docs", label: t("links.docs") },
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
            <div className="flex flex-wrap items-center gap-1.5">
              <KasyLogo />
              <a
                href="https://aicrus.io/"
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "translate-y-[0.35rem] rounded-full border px-2 py-px text-[0.625rem] font-medium leading-none text-muted-foreground transition-colors hover:text-foreground",
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
            <p className="text-[0.8125rem] text-muted-foreground">
              {t("contactLabel")}{" "}
              <a
                href={contactMailtoHref()}
                className="font-medium text-foreground transition-colors hover:text-primary"
              >
                {CONTACT_EMAIL}
              </a>
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
              render={<HashLink href="#precos" />}
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
          <div className="flex items-center justify-between gap-3 max-sm:w-full sm:order-1 sm:justify-start sm:gap-4">
            <p className="shrink-0 text-xs text-muted-foreground max-sm:whitespace-nowrap">
              {t("copyright")}
            </p>
            <div className="flex items-center gap-0.5">
              {SOCIAL_LINKS.map(({ href, labelKey, icon: Icon }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={t(labelKey)}
                  className="inline-flex size-9 items-center justify-center rounded-full text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2.5 max-sm:justify-between sm:order-2 sm:justify-end">
            <LanguageSwitcher />
            <ThemeToggle />
          </div>
        </div>
      </div>
    </footer>
  );
}
