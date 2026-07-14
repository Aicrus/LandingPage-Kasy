"use client";

import { useTheme } from "next-themes";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

import { HashLink } from "@/components/hash-link";
import { KasyLogo } from "@/components/kasy-logo";
import { Button } from "@/components/ui/button";
import { Link } from "@/i18n/navigation";
import {
  animate,
  motion,
  useMotionTemplate,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "@/lib/motion";
import { cn } from "@/lib/utils";
import { surfaceBorderClass } from "@/lib/surface-border";

const COLLAPSE_AT = 24;
const MOBILE_MEDIA = "(max-width: 639px)";

// Tween (não mola) com a mesma curva "premium" usada no blurReveal do site
// (lib/motion.ts). Uma mola solta do repouso começa com velocidade zero e
// só ganha ritmo depois de ~50-60ms — lê como um atraso antes de "acordar".
// O tween já parte com velocidade máxima, então a resposta é imediata, e a
// duração fixa evita a cauda quase invisível que uma mola deixa no final.
const MORPH_EASE = [0.16, 1, 0.3, 1] as const;
const MORPH_DURATION_DOWN = 0.32;
const MORPH_DURATION_UP = 0.26;

const headerShellBorderClass = cn("border-[0.5px]", surfaceBorderClass);

const headerCtaButtonClass =
  "h-auto shrink-0 rounded-full px-4 py-2 shadow-[0_1px_4px_rgba(4,43,89,0.05),0_12px_36px_-4px_rgba(4,43,89,0.11)] hover:shadow-[0_1px_4px_rgba(4,43,89,0.06),0_14px_40px_-4px_rgba(4,43,89,0.13)] dark:shadow-none dark:hover:shadow-none";

const headerCtaButtonFlatClass =
  "bg-card hover:bg-card/92 dark:bg-input/30 dark:hover:bg-input/50 shadow-none hover:shadow-none dark:shadow-none dark:hover:shadow-none";

function useOpenHeaderWidth() {
  const [openWidth, setOpenWidth] = useState(992);

  useEffect(() => {
    const sync = () => {
      setOpenWidth(Math.min(992, window.innerWidth * 0.92));
    };

    sync();
    window.addEventListener("resize", sync, { passive: true });
    return () => window.removeEventListener("resize", sync);
  }, []);

  return openWidth;
}

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia(MOBILE_MEDIA);
    const sync = () => setIsMobile(media.matches);

    sync();
    media.addEventListener("change", sync);
    return () => media.removeEventListener("change", sync);
  }, []);

  return isMobile;
}

function HeaderBrand() {
  return (
    <Link
      href="/"
      aria-label="Kasy"
      className="flex rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
    >
      <KasyLogo />
    </Link>
  );
}

function HeaderNav({
  compactCta,
  flatCta,
  className,
}: {
  compactCta?: boolean;
  flatCta?: boolean;
  className?: string;
}) {
  const t = useTranslations("header");

  return (
    <nav className={cn("flex shrink-0 items-center gap-5 sm:gap-6", className)}>
      <Link
        href="/docs"
        className="font-sans text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="sm:hidden">{t("docsShort")}</span>
        <span className="hidden sm:inline">{t("docs")}</span>
      </Link>
      <Button
        variant="outline"
        nativeButton={false}
        className={cn(
          headerCtaButtonClass,
          "font-sans",
          flatCta && headerCtaButtonFlatClass,
          compactCta && "text-[0.8125rem]",
        )}
        render={<HashLink href="#precos" />}
      >
        {t("cta")}
      </Button>
    </nav>
  );
}

/** Mobile — fixo, fundo sólido, sem morph nem blur; o conteúdo rola por baixo. */
function SiteHeaderMobile() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background px-3.5">
      <div className="flex w-full items-center justify-between py-2.5">
        <HeaderBrand />
        <HeaderNav className="gap-3" flatCta />
      </div>
    </header>
  );
}

/** Placeholder pré-hidratação — mesma aparência expandida do desktop, sem animação. */
function SiteHeaderPlaceholder({ openWidth }: { openWidth: number }) {
  return (
    <header className="sticky top-0 z-50 w-full px-page-x">
      <div
        className="mx-auto flex w-full items-center justify-between py-4"
        style={{ maxWidth: openWidth }}
      >
        <HeaderBrand />
        <HeaderNav />
      </div>
    </header>
  );
}

export function SiteHeader() {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();
  const openWidth = useOpenHeaderWidth();
  const isMobile = useIsMobileViewport();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <SiteHeaderPlaceholder openWidth={openWidth} />;
  }

  if (isMobile) {
    return <SiteHeaderMobile />;
  }

  if (reducedMotion) {
    return <SiteHeaderStatic openWidth={openWidth} />;
  }

  return <SiteHeaderMotion openWidth={openWidth} />;
}

function SiteHeaderMotion({ openWidth }: { openWidth: number }) {
  const { scrollY } = useScroll();
  const { resolvedTheme } = useTheme();
  const t = useTranslations("header");

  // Estado por posição, com um único limiar nos dois sentidos: passou do
  // limiar → compacto, e continua compacto mesmo com pequenas rolagens pra
  // cima no meio da página. Só reabre ao voltar pra perto do topo de novo.
  const [isCompact, setIsCompact] = useState(false);
  const morph = useMotionValue(0);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsCompact(latest > COLLAPSE_AT);
  });

  useEffect(() => {
    const controls = animate(morph, isCompact ? 1 : 0, {
      duration: isCompact ? MORPH_DURATION_DOWN : MORPH_DURATION_UP,
      ease: MORPH_EASE,
    });
    return () => controls.stop();
  }, [isCompact, morph]);

  // Lido do CSS uma vez por tema (não a cada frame) — --header-blur-fill só
  // muda quando a classe .dark alterna, nunca durante o scroll.
  const blurFillMax = useMotionValue(74);

  useEffect(() => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-blur-fill")
      .trim();
    blurFillMax.set(Number.parseFloat(raw) || 74);
  }, [resolvedTheme, blurFillMax]);

  const shellMaxWidth = useTransform(morph, (value) => {
    const compact = Math.min(openWidth, Math.max(openWidth * 0.76, 460));
    return openWidth + (compact - openWidth) * value;
  });

  const shellPaddingY = useTransform(morph, [0, 1], [16, 11]);
  const shellPaddingX = useTransform(morph, [0, 1], [0, 24]);
  const shellRadius = useTransform(morph, [0, 1], [0, 9999]);
  const topOffset = useTransform(morph, [0, 1], [0, 12]);
  const blurFill = useTransform(
    [morph, blurFillMax],
    ([g, max]: number[]) => g * max,
  );
  const blurAmount = useTransform(morph, [0, 1], [0, 16]);
  const shellBackground = useMotionTemplate`rgb(from var(--background) r g b / ${blurFill}%)`;
  const backdropFilter = useMotionTemplate`blur(${blurAmount}px)`;
  const shellBorderMix = useTransform(morph, [0, 1], [0, 60]);
  const shellBorderColor = useMotionTemplate`color-mix(in oklch, var(--border) ${shellBorderMix}%, transparent)`;
  const navGap = useTransform(morph, [0, 1], [24, 22]);

  return (
    <motion.header
      className="sticky top-0 z-50 w-full px-page-x"
      style={{ paddingTop: topOffset }}
    >
      <motion.div
        className="relative mx-auto isolate flex w-full min-w-0 items-center justify-between"
        style={{
          maxWidth: shellMaxWidth,
          paddingTop: shellPaddingY,
          paddingBottom: shellPaddingY,
          paddingLeft: shellPaddingX,
          paddingRight: shellPaddingX,
          borderRadius: shellRadius,
        }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden border-[0.5px]"
          style={{
            backgroundColor: shellBackground,
            borderRadius: shellRadius,
            borderColor: shellBorderColor,
            backdropFilter,
            WebkitBackdropFilter: backdropFilter,
            willChange: "backdrop-filter",
          }}
        />

        <div className="relative z-10 flex shrink-0 items-center">
          <HeaderBrand />
        </div>

        <motion.nav
          className="relative z-10 flex shrink-0 items-center"
          style={{ gap: navGap }}
        >
          <Link
            href="/docs"
            className="shrink-0 font-sans text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="sm:hidden">{t("docsShort")}</span>
            <span className="hidden sm:inline">{t("docs")}</span>
          </Link>
          <Button
            variant="outline"
            nativeButton={false}
            className={cn(headerCtaButtonClass, "font-sans")}
            render={<HashLink href="#precos" />}
          >
            {t("cta")}
          </Button>
        </motion.nav>
      </motion.div>
    </motion.header>
  );
}

function SiteHeaderStatic({ openWidth }: { openWidth: number }) {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsCompact(window.scrollY > 48);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full px-page-x",
        isCompact ? "pt-3" : "",
      )}
    >
      <div
        className={cn(
          "relative mx-auto flex w-full items-center justify-between",
          isCompact
            ? cn(
                "header-blur-surface max-w-fit gap-5 rounded-full py-3 px-6 sm:gap-6 sm:px-6",
                headerShellBorderClass,
              )
            : "max-w-header py-4",
        )}
        style={!isCompact ? { maxWidth: openWidth } : undefined}
      >
        <HeaderBrand />
        <HeaderNav compactCta={isCompact} />
      </div>
    </header>
  );
}
