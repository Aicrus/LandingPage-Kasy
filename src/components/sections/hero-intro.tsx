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

      <BlurReveal
        as="p"
        className="mx-auto max-w-5xl text-pretty text-fluid-body text-muted-foreground"
        delay={0.28}
      >
        <span className="block">
          O único kit Flutter que chega completo. Backend, auth, pagamentos,
        </span>
        <span className="block">
          UI e lógica prontos no dia um. Você foca no que torna o seu app
          único.
        </span>
      </BlurReveal>
    </div>
  );
}
