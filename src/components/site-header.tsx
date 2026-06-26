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

const SCROLL_RANGE = 140;

const headerShellBorderClass =
  "border-[0.5px] border-foreground/10 dark:border-foreground/15";

const headerCtaButtonClass =
  "h-auto shrink-0 rounded-full border-transparent px-4 py-2 shadow-[0_1px_4px_rgba(26,30,44,0.05),0_12px_36px_-4px_rgba(26,30,44,0.11)] hover:shadow-[0_1px_4px_rgba(26,30,44,0.06),0_14px_40px_-4px_rgba(26,30,44,0.13)] dark:border-transparent dark:shadow-[0_1px_4px_rgba(0,0,0,0.22),0_12px_36px_-4px_rgba(0,0,0,0.3)] dark:hover:shadow-[0_1px_4px_rgba(0,0,0,0.24),0_14px_40px_-4px_rgba(0,0,0,0.34)]";

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

export function SiteHeader() {
  const [mounted, setMounted] = useState(false);
  const reducedMotion = useReducedMotion();
  const openWidth = useOpenHeaderWidth();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || reducedMotion) {
    return <SiteHeaderStatic openWidth={openWidth} />;
  }

  return <SiteHeaderMotion openWidth={openWidth} />;
}

function SiteHeaderMotion({ openWidth }: { openWidth: number }) {
  const { scrollY } = useScroll();

  const rawProgress = useTransform(scrollY, [0, SCROLL_RANGE], [0, 1], { clamp: true });
  const progress = useSpring(rawProgress, {
    stiffness: 90,
    damping: 22,
    mass: 1,
  });

  const rawGlass = useTransform(scrollY, [32, SCROLL_RANGE], [0, 1], { clamp: true });
  const glass = useSpring(rawGlass, {
    stiffness: 80,
    damping: 24,
    mass: 1,
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
          <Link
            href="/"
            className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            <KasyLogo />
          </Link>
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
        <Link
          href="/"
          className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          <KasyLogo />
        </Link>

        <nav className="flex shrink-0 items-center gap-5 sm:gap-6">
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
              isCompact && "text-[0.8125rem]",
            )}
            render={<Link href="/obter-kasy" />}
          >
            Obter Kasy Pro
          </Button>
        </nav>
      </div>
    </header>
  );
}
