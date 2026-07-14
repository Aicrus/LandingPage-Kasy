"use client";

import { useTranslations } from "next-intl";

import { HashLink } from "@/components/hash-link";
import { BlurReveal } from "@/components/motion/blur-reveal";
import { Button } from "@/components/ui/button";

import { HeroAiSubsPill } from "./hero-ai-subs-pill";
import { HeroSocialProof } from "./hero-social-proof";

export function HeroIntro() {
  const t = useTranslations("heroIntro");

  return (
    <div className="mx-auto flex w-full flex-col items-center gap-hero-title-to-lead text-center">
      <h1 className="whitespace-nowrap font-heading text-fluid-display text-foreground">
        <BlurReveal as="span" delay={0}>
          {t("titleEmphasis")}
        </BlurReveal>{" "}
        <BlurReveal as="span" className="text-muted-foreground" delay={0.14}>
          {t("titleRest")}
        </BlurReveal>
      </h1>

      <p className="w-full max-w-fluid-subtitle font-rounded text-pretty text-fluid-subtitle text-foreground">
        <BlurReveal as="span" className="md:block" delay={0.28}>
          {t("leadPart1")}
        </BlurReveal>{" "}
        <BlurReveal as="span" className="md:block" delay={0.36}>
          {t("leadPart2")}
        </BlurReveal>
      </p>

      <BlurReveal as="div" delay={0.5} className="mt-2">
        <HeroAiSubsPill />
      </BlurReveal>

      <BlurReveal as="div" delay={0.64} className="mt-2 sm:mt-2.5">
        <Button
          variant="default"
          nativeButton={false}
          className="relative h-auto overflow-hidden rounded-full border-[1.5px] border-[color-mix(in_oklch,var(--primary),white_13%)] px-6 py-2.5 font-sans text-[0.9375rem] shadow-[0_1px_3px_rgba(4,43,89,0.06),0_10px_28px_-8px_rgba(4,43,89,0.16)] transition-[transform,box-shadow,filter] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-safe:hover:-translate-y-0.5 motion-safe:hover:shadow-[0_4px_12px_rgba(4,43,89,0.1),0_18px_44px_-12px_rgba(4,43,89,0.24)] motion-safe:hover:brightness-[1.03] motion-safe:active:translate-y-0 motion-safe:active:scale-[0.985] motion-safe:active:shadow-[0_1px_2px_rgba(4,43,89,0.08),0_6px_18px_-6px_rgba(4,43,89,0.14)] hover:bg-primary sm:px-7 sm:py-3 sm:text-base dark:shadow-[0_1px_3px_rgba(0,0,0,0.26),0_10px_28px_-8px_rgba(0,0,0,0.36)] motion-safe:dark:hover:shadow-[0_4px_14px_rgba(0,0,0,0.32),0_20px_48px_-12px_rgba(0,0,0,0.48)]"
          render={<HashLink href="#precos" />}
        >
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 w-[42%] -skew-x-[14deg] bg-gradient-to-r from-transparent via-white/22 to-transparent opacity-0 will-change-[transform,opacity] motion-safe:group-hover/button:animate-[button-sheen_1.05s_cubic-bezier(0.22,1,0.36,1)]"
          />
          <span className="relative z-10">{t("cta")}</span>
        </Button>
      </BlurReveal>

      <BlurReveal as="div" delay={0.78} className="-mt-3.5 sm:-mt-3">
        <HeroSocialProof />
      </BlurReveal>
    </div>
  );
}
