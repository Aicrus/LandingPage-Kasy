"use client";

import Image from "next/image";
import type { ReactNode } from "react";

import { BlurReveal } from "@/components/motion/blur-reveal";
import { surfaceBorderClass } from "@/lib/surface-border";
import { cn } from "@/lib/utils";

const SCREENSHOT_SRC = "https://www.clonk.ai/clonk-screen.png";
const SCREENSHOT_ALT =
  "Interface do Clonk — ambiente de desenvolvimento com assistente de IA";

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
        Imagem full, já revelada — só desce no scroll da página.
        padding-top alto: no load aparece só uma faixa no fim da 1ª tela.
        A altura da seção (~2 viewports) vem da imagem + respiro inferior.
      */}
      <div className="mx-auto w-full max-w-[min(94vw,72rem)] px-page-x pt-[min(72vh,40rem)] pb-[min(28vh,14rem)] sm:pt-[min(74vh,42rem)] sm:pb-[min(32vh,16rem)]">
        <BlurReveal as="div" delay={0.78} className="w-full">
          <div
            className={cn(
              "overflow-hidden rounded-t-2xl border bg-card shadow-[0_24px_80px_-24px_rgba(26,30,44,0.22)] dark:shadow-[0_24px_80px_-24px_rgba(0,0,0,0.55)]",
              surfaceBorderClass,
            )}
          >
            <Image
              src={SCREENSHOT_SRC}
              alt={SCREENSHOT_ALT}
              width={2400}
              height={1500}
              className="h-auto w-full select-none"
              priority
              sizes="(max-width: 768px) 94vw, 72rem"
              draggable={false}
            />
          </div>
        </BlurReveal>
      </div>
    </section>
  );
}
