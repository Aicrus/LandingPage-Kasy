"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { KasyLogo } from "@/components/kasy-logo";
import { Button } from "@/components/ui/button";
import {
  headerMorphTransition,
  motion,
  useMotionTemplate,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "@/lib/motion";
import { cn } from "@/lib/utils";

const SCROLL_RANGE = 115;
const MOBILE_MEDIA = "(max-width: 639px)";

const headerShellBorderClass =
  "border-[0.5px] border-foreground/10 dark:border-foreground/15";

const headerCtaButtonClass =
  "h-auto shrink-0 rounded-full border-transparent px-4 py-2 shadow-[0_1px_4px_rgba(26,30,44,0.05),0_12px_36px_-4px_rgba(26,30,44,0.11)] hover:shadow-[0_1px_4px_rgba(26,30,44,0.06),0_14px_40px_-4px_rgba(26,30,44,0.13)] dark:border-transparent dark:shadow-[0_1px_4px_rgba(0,0,0,0.22),0_12px_36px_-4px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_1px_4px_rgba(0,0,0,0.24),0_14px_40px_-4px_rgba(0,0,0,0.34)]";

const headerCtaButtonFlatClass =
  "border-[0.5px] border-foreground/16 bg-card hover:bg-card/92 dark:border-foreground/20 dark:bg-input/30 dark:hover:bg-input/50 shadow-none hover:shadow-none dark:shadow-none dark:hover:shadow-none";

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
      className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
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
  return (
    <nav className={cn("flex shrink-0 items-center gap-5 sm:gap-6", className)}>
      <Link
        href="/documentacao"
        className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="sm:hidden">Docs</span>
        <span className="hidden sm:inline">Documentação</span>
      </Link>
      <Button
        variant="outline"
        nativeButton={false}
        className={cn(
          headerCtaButtonClass,
          flatCta && headerCtaButtonFlatClass,
          compactCta && "text-[0.8125rem]",
        )}
        render={<Link href="/obter-kasy" />}
      >
        Obter Kasy Pro
      </Button>
    </nav>
  );
}

/** Mobile — fixo, fundo sólido, sem morph nem blur; o conteúdo rola por baixo. */
function SiteHeaderMobile() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-background px-3.5">
      <div className="flex w-full items-center justify-between py-4">
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

  const rawProgress = useTransform(scrollY, [0, SCROLL_RANGE], [0, 1], { clamp: true });
  const progress = useSpring(rawProgress, {
    stiffness: 110,
    damping: 20,
    mass: 0.9,
  });

  const rawGlass = useTransform(scrollY, [24, SCROLL_RANGE], [0, 1], { clamp: true });
  const glass = useSpring(rawGlass, {
    stiffness: 100,
    damping: 22,
    mass: 0.9,
  });

  const shellMaxWidth = useTransform(progress, (value) => {
    const compact = Math.min(openWidth, Math.max(openWidth * 0.76, 460));
    return openWidth + (compact - openWidth) * value;
  });

  const shellPaddingY = useTransform(progress, [0, 1], [16, 11]);
  const shellPaddingX = useTransform(progress, [0, 1], [0, 24]);
  const shellRadius = useTransform(glass, [0, 1], [0, 9999]);
  const topOffset = useTransform(progress, [0, 1], [0, 12]);
  const blurFill = useTransform(glass, (value) => {
    const raw = getComputedStyle(document.documentElement)
      .getPropertyValue("--header-blur-fill")
      .trim();
    const max = Number.parseFloat(raw) || 74;
    return value * max;
  });
  const blurAmount = useTransform(glass, [0, 1], [0, 16]);
  const shellBackground = useMotionTemplate`rgb(from var(--background) r g b / ${blurFill}%)`;
  const backdropFilter = useMotionTemplate`blur(${blurAmount}px)`;
  const shellBorderAlpha = useTransform(glass, [0, 1], [0, 10]);
  const shellBorderColor = useMotionTemplate`rgb(from var(--foreground) r g b / ${shellBorderAlpha}%)`;
  const navGap = useTransform(progress, [0, 1], [24, 22]);

  return (
    <motion.header
      className="sticky top-0 z-50 w-full px-page-x"
      style={{ paddingTop: topOffset }}
    >
      <motion.div
        layout
        layoutRoot
        transition={headerMorphTransition}
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
          }}
        />

        <motion.div
          layout
          transition={headerMorphTransition}
          className="relative z-10 shrink-0"
        >
          <HeaderBrand />
        </motion.div>

        <motion.nav
          layout
          transition={headerMorphTransition}
          className="relative z-10 flex shrink-0 items-center"
          style={{ gap: navGap }}
        >
          <Link
            href="/documentacao"
            className="shrink-0 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="sm:hidden">Docs</span>
            <span className="hidden sm:inline">Documentação</span>
          </Link>
          <Button
            variant="outline"
            nativeButton={false}
            className={headerCtaButtonClass}
            render={<Link href="/obter-kasy" />}
          >
            Obter Kasy Pro
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
