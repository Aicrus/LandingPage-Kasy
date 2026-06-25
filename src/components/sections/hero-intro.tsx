"use client";

import { BlurReveal } from "@/components/motion/blur-reveal";

export function HeroIntro() {
  return (
    <div className="mx-auto flex w-full flex-col items-center gap-stack text-center">
      <h1 className="max-w-fluid-title text-balance text-fluid-display text-foreground">
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

      <p className="w-full max-w-fluid-subtitle text-pretty text-fluid-subtitle text-muted-foreground md:text-balance">
        <BlurReveal as="span" delay={0.28}>
          O único kit Flutter que chega completo. Backend, auth, pagamentos,
          <br className="hidden md:block" />
          UI e lógica prontos no dia um. Você foca no que torna o seu app
          único.
        </BlurReveal>
      </p>
    </div>
  );
}
