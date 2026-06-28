"use client";

import type { ReactNode } from "react";

import { BlurReveal } from "@/components/motion/blur-reveal";
import { HeroWorkspaceMock } from "@/components/sections/hero-workspace-mock";
import { surfaceBorderClass } from "@/lib/surface-border";
import { cn } from "@/lib/utils";

const FADE_MASK =
  "[mask-image:linear-gradient(to_bottom,black_0%,black_76%,transparent_100%)]";

type HeroScreenRevealProps = {
  children: ReactNode;
};

export function HeroScreenReveal({ children }: HeroScreenRevealProps) {
  return (
    <section className="relative bg-background">
      {/* Hero flutuando no topo da 1ª viewport — não empurra a imagem */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 flex min-h-svh flex-col items-center px-page-x pt-[calc(var(--spacing-hero-inset-top)+var(--header-height-mobile))] sm:pt-hero-inset-top">
        <div className="pointer-events-auto w-full">{children}</div>
      </div>

      {/*
        Mock do workspace — só desce no scroll da página.
        padding-top alto: no load aparece só uma faixa no fim da 1ª tela.
      */}
      <div className="mx-auto w-full max-w-[min(96vw,76rem)] px-[clamp(0.75rem,2.5vw,2rem)] pt-[min(72vh,40rem)] pb-[min(28vh,14rem)] sm:pt-[min(74vh,42rem)] sm:pb-[min(32vh,16rem)]">
        <BlurReveal as="div" delay={0.78} className="w-full">
          <div
            className={cn(
              "relative overflow-hidden rounded-t-2xl border-t border-x-0 border-b-0 bg-card shadow-none",
              surfaceBorderClass,
            )}
          >
            <div className="relative">
              <HeroWorkspaceMock />

              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-y-0 left-0 z-[1] w-px bg-border-surface",
                  FADE_MASK,
                )}
              />
              <div
                aria-hidden
                className={cn(
                  "pointer-events-none absolute inset-y-0 right-0 z-[1] w-px bg-border-surface",
                  FADE_MASK,
                )}
              />
              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[22%] bg-gradient-to-t from-background via-background/40 via-55% to-transparent"
              />
            </div>
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
