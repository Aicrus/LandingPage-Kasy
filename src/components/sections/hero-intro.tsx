"use client";

import { BlurReveal } from "@/components/motion/blur-reveal";

export function HeroIntro() {
  return (
    <div className="mx-auto flex w-full flex-col items-center gap-hero-title-to-lead text-center">
      <h1 className="max-w-fluid-title text-balance font-features-linear text-fluid-display text-foreground">
        <BlurReveal as="span" className="block" delay={0}>
          Do zero ao app Flutter
        </BlurReveal>
        <BlurReveal
          as="span"
          className="block text-muted-foreground"
          delay={0.14}
        >
          em apenas 7 dias.
        </BlurReveal>
      </h1>

      <p className="w-full max-w-fluid-subtitle font-mono text-pretty text-fluid-subtitle text-muted-foreground">
        <BlurReveal as="span" className="md:block" delay={0.28}>
          O único kit Flutter que chega completo. Backend, auth, pagamentos,
        </BlurReveal>{" "}
        <BlurReveal as="span" className="md:block" delay={0.36}>
          UI e lógica prontos no dia um. Você foca no que torna o seu app
          único.
        </BlurReveal>
      </p>
    </div>
  );
}
