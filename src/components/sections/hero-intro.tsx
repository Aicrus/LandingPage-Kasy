"use client";

import Link from "next/link";

import { BlurReveal } from "@/components/motion/blur-reveal";
import { Button } from "@/components/ui/button";

import { HeroAiSubsPill } from "./hero-ai-subs-pill";
import { HeroSocialProof } from "./hero-social-proof";

export function HeroIntro() {
  return (
    <div className="mx-auto flex w-full flex-col items-center gap-hero-title-to-lead text-center">
      <h1 className="max-w-fluid-title text-balance font-heading text-fluid-display text-foreground md:max-w-none">
        <BlurReveal as="span" className="block md:inline" delay={0}>
          App no ar
        </BlurReveal>{" "}
        <BlurReveal
          as="span"
          className="block text-muted-foreground md:inline"
          delay={0.14}
        >
          em 7 dias.
        </BlurReveal>
      </h1>

      <p className="w-full max-w-fluid-subtitle font-rounded text-pretty text-fluid-subtitle text-muted-foreground">
        <BlurReveal as="span" className="md:block" delay={0.28}>
          O único kit Flutter completo: backend, auth, pagamentos, UI e lógica
          prontos.
        </BlurReveal>{" "}
        <BlurReveal as="span" className="md:block" delay={0.36}>
          Você foca no que torna seu app único.
        </BlurReveal>
      </p>

      <BlurReveal as="div" delay={0.5} className="mt-2">
        <HeroAiSubsPill />
      </BlurReveal>

      <BlurReveal as="div" delay={0.64} className="mt-2 sm:mt-2.5">
        <Button
          variant="default"
          nativeButton={false}
          className="relative h-auto overflow-hidden rounded-full border-[1.5px] border-[color-mix(in_oklch,var(--primary),white_13%)] px-6 py-2.5 text-[0.9375rem] shadow-[0_1px_3px_rgba(26,30,44,0.06),0_10px_28px_-8px_rgba(26,30,44,0.16)] transition-shadow duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-primary sm:px-7 sm:py-3 sm:text-base dark:shadow-[0_1px_3px_rgba(0,0,0,0.26),0_10px_28px_-8px_rgba(0,0,0,0.36)]"
          render={<Link href="/obter-kasy" />}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-2/5 -translate-x-[140%] -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-300 will-change-transform group-hover/button:opacity-100 group-hover/button:animate-[button-sheen_2.4s_cubic-bezier(0.45,0,0.55,1)_infinite_alternate]"
          />
          <span className="relative z-10">Obter Kasy Pro</span>
        </Button>
      </BlurReveal>

      <BlurReveal as="div" delay={0.78} className="-mt-3.5 sm:-mt-3">
        <HeroSocialProof />
      </BlurReveal>
    </div>
  );
}
