import Image from "next/image";
import type { ReactNode } from "react";

import { BlurReveal } from "@/components/motion/blur-reveal";
import { FeatureHoverCards } from "@/components/sections/feature-hover-cards";
import {
  HeroPhonePanelCallout,
  HeroWorkspaceMock,
} from "@/components/sections/hero-workspace-mock";
import { cn } from "@/lib/utils";

/** Continua o stagger do hero intro (callout em 0.92). */
const HERO_EDITOR_REVEAL_DELAY = 1.06;

const HERO_KIT_IMAGE = {
  src: "/assets/hero-sacred-valley.png",
  width: 2688,
  height: 1792,
} as const;

type HeroScreenRevealProps = {
  children: ReactNode;
};

const heroEditorCardClass = cn(
  "overflow-hidden rounded-xl border border-black/[0.07] bg-card shadow-none dark:border-[#292821]",
);

function HeroKitLandscapeBackdrop() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-x-0 bottom-0 top-hero-kit-bg-top z-0 overflow-hidden"
    >
      <Image
        src={HERO_KIT_IMAGE.src}
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-[center_35%]"
      />
      <div className="hero-kit-backdrop-fade-top absolute inset-0" />
      <div className="hero-kit-backdrop-fade-bottom absolute inset-x-0 bottom-0" />
    </div>
  );
}

function HeroEditorBlock({ mobileBleed }: { mobileBleed: boolean }) {
  return (
    <div
      className={cn(
        "relative w-full",
        mobileBleed
          ? "max-sm:mt-hero-to-mock-mobile"
          : "mt-hero-to-mock sm:overflow-visible sm:pt-[clamp(1rem,2.25vw,2rem)]",
      )}
    >
      {mobileBleed ? <HeroPhonePanelCallout /> : null}

      {mobileBleed ? (
        /* Mobile: wrapper transparente — sem bg-card/borda (evita faixa visível no crop) */
        <div className="overflow-hidden bg-transparent pt-3">
          <BlurReveal as="div" delay={HERO_EDITOR_REVEAL_DELAY}>
            <div className="relative left-1/2 w-[35rem] min-w-[35rem] translate-x-[calc(-50%+0.75rem)]">
              <HeroWorkspaceMock />
            </div>
          </BlurReveal>
        </div>
      ) : (
        /* sm+: mock um pouco menor e centralizado — mais respiro sem deslocar para a direita */
        <div className="relative mx-auto w-full max-w-[min(100%,93%)] md:max-w-[min(100%,88%)] lg:max-w-[min(100%,86%)]">
          <HeroPhonePanelCallout />
          <BlurReveal
            as="div"
            delay={HERO_EDITOR_REVEAL_DELAY}
            className={heroEditorCardClass}
          >
            <HeroWorkspaceMock />
          </BlurReveal>
        </div>
      )}
    </div>
  );
}

export function HeroScreenReveal({ children }: HeroScreenRevealProps) {
  return (
    <section className="bg-background">
      <div className="relative w-full pb-[clamp(3rem,6vw,5rem)]">
        <HeroKitLandscapeBackdrop />

        {/* Intro — container com padding */}
        <div
          className={cn(
            "relative z-10 mx-auto flex w-full max-w-[min(96vw,76rem)] flex-col items-center",
            "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
            "pt-[calc(var(--spacing-hero-inset-top)+var(--header-height-mobile))] sm:pt-hero-inset-top",
          )}
        >
          <div className="w-full">{children}</div>

          {/* sm+: editor dentro do container com padding */}
          <div className="hidden w-full sm:block">
            <HeroEditorBlock mobileBleed={false} />
          </div>
        </div>

        {/* Mobile: editor full-bleed na largura da seção (fora do padding) */}
        <div className="relative z-10 w-full sm:hidden">
          <HeroEditorBlock mobileBleed />
        </div>
      </div>

      <FeatureHoverCards />
    </section>
  );
}
