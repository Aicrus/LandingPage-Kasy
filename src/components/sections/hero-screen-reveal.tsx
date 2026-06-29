import type { ReactNode } from "react";

import { HeroWorkspaceMock } from "@/components/sections/hero-workspace-mock";
import { cn } from "@/lib/utils";

type HeroScreenRevealProps = {
  children: ReactNode;
};

export function HeroScreenReveal({ children }: HeroScreenRevealProps) {
  return (
    <section className="bg-background">
      <div
        className={cn(
          "mx-auto flex w-full max-w-[min(96vw,76rem)] flex-col items-center",
          "px-[clamp(0.75rem,2.5vw,2rem)]",
          "pt-[calc(var(--spacing-hero-inset-top)+var(--header-height-mobile))] sm:pt-hero-inset-top",
          "pb-[clamp(3rem,6vw,5rem)]",
        )}
      >
        <div className="w-full">{children}</div>

        <div className="mt-[clamp(2.25rem,5vw,4rem)] w-full">
          <div
            className={cn(
              "relative overflow-x-clip overflow-y-visible rounded-t-xl border border-b-0 border-black/[0.07] bg-card shadow-none dark:border-[#292821]",
            )}
          >
            <div className="relative">
              <HeroWorkspaceMock />

              <div
                aria-hidden
                className="pointer-events-none absolute inset-x-0 bottom-0 z-[4] h-[22%] bg-gradient-to-t from-background via-background/40 via-55% to-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
