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
    const compact = Math.min(openWidth, Math.max(openWidth * 0.56, 380));
    return openWidth + (compact - openWidth) * value;
  });

  const shellPaddingY = useTransform(progress, [0, 1], [16, 10]);
  const shellPaddingX = useTransform(progress, [0, 1], [0, 16]);
  const shellRadius = useTransform(glass, [0, 1], [0, 9999]);
  const topOffset = useTransform(progress, [0, 1], [0, 12]);
  const glassOpacity = useTransform(glass, [0, 1], [0, 0.68]);
  const blurAmount = useTransform(glass, [0, 1], [0, 14]);
  const backdropFilter = useMotionTemplate`blur(${blurAmount}px) saturate(1.12)`;
  const shadowAlpha = useTransform(glass, [0, 1], [0, 0.12]);
  const borderAlpha = useTransform(glass, [0, 1], [0, 0.28]);
  const ringShadow = useMotionTemplate`inset 0 0 0 1px color-mix(in oklch, var(--border) ${borderAlpha}, transparent)`;
  const boxShadow = useMotionTemplate`${ringShadow}, 0 6px 28px -8px rgba(26, 30, 44, ${shadowAlpha}), 0 1px 2px rgba(26, 30, 44, ${shadowAlpha})`;
  const navGap = useTransform(progress, [0, 1], [24, 16]);

  return (
    <motion.header
      className="sticky top-0 z-50 w-full px-page-x"
      style={{ paddingTop: topOffset }}
    >
      <motion.div
        layout
        layoutRoot
        transition={headerMorphTransition}
        className="relative mx-auto flex w-full min-w-0 items-center justify-between"
        style={{
          maxWidth: shellMaxWidth,
          paddingTop: shellPaddingY,
          paddingBottom: shellPaddingY,
          paddingLeft: shellPaddingX,
          paddingRight: shellPaddingX,
          borderRadius: shellRadius,
          boxShadow,
        }}
      >
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 overflow-hidden bg-background"
          style={{
            opacity: glassOpacity,
            borderRadius: shellRadius,
            backdropFilter,
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
            className="h-auto shrink-0 rounded-full px-4 py-2"
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
            ? "max-w-fit gap-4 rounded-full border border-border/40 bg-background/68 py-2.5 px-4 shadow-[0_6px_28px_-8px_rgba(26,30,44,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-background/58 sm:gap-4 sm:px-5"
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
              "h-auto shrink-0 rounded-full",
              isCompact ? "px-4 py-2 text-[0.8125rem]" : "px-4 py-2",
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
