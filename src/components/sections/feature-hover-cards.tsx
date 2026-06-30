"use client";

import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

const CARDS = [
  {
    num: "01",
    title: "Poucos comandos",
    description:
      "Firebase, Supabase ou REST. Login, banco, storage, push e IA num passo.",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=640&h=800&q=80",
    alt: "Terminal com comando de configuração em um laptop",
  },
  {
    num: "02",
    title: "Personalize o visual",
    description:
      "Ícone, splash, cores claro e escuro. Dois arquivos e app com sua marca.",
    image:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=640&h=800&q=80",
    alt: "Paleta de cores e elementos de identidade visual de um app",
  },
  {
    num: "03",
    title: "Publique onde quiser",
    description:
      "App Store, Play Store e Web. O Codemagic publica iOS até sem Mac.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=640&h=800&q=80",
    alt: "Smartphones exibindo apps publicados nas lojas",
  },
] as const;

/** Raio do shell = raio do card + padding. Cantos concêntricos. */
const CARD_RADIUS_CLASS = "rounded-3xl";
const SHELL_CLASS = "rounded-[1.875rem] p-2 sm:rounded-[2rem] sm:p-2.5";

export function FeatureHoverCards() {
  const [active, setActive] = useState(0);

  return (
    <div
      className={cn(
        "mx-auto w-full max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[clamp(2.5rem,5vw,4rem)]",
      )}
    >
      <div
        className={cn(
          SHELL_CLASS,
          "bg-[color-mix(in_srgb,var(--secondary)_72%,var(--background)_28%)]",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.55)]",
          "dark:bg-[color-mix(in_srgb,var(--secondary)_88%,var(--background)_12%)]",
          "dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]",
        )}
      >
        <div className="flex gap-2 sm:gap-2.5 max-sm:flex-col max-sm:gap-2">
          {CARDS.map((card, index) => {
            const isActive = active === index;

            return (
              <article
                key={card.num}
                onMouseEnter={() => setActive(index)}
                onFocus={() => setActive(index)}
                onClick={() => setActive(index)}
                tabIndex={0}
                aria-expanded={isActive}
                className={cn(
                  "relative flex min-h-[17.5rem] cursor-default overflow-hidden sm:min-h-[21.25rem]",
                  CARD_RADIUS_CLASS,
                  "bg-card",
                  "shadow-[0_1px_2px_rgba(26,30,44,0.04),0_8px_24px_-6px_rgba(26,30,44,0.08)]",
                  "transition-[flex-grow,flex-basis] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "motion-reduce:transition-none",
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_8px_24px_-6px_rgba(0,0,0,0.35)]",
                  "max-sm:min-h-0",
                  isActive
                    ? "flex-[2] max-sm:flex-none"
                    : "flex-1 max-sm:flex-none",
                )}
              >
                <div
                  className={cn(
                    "grid h-full w-full gap-3 p-5 sm:gap-4 sm:p-6",
                    "transition-[grid-template-columns,gap] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    "motion-reduce:transition-none",
                    isActive
                      ? "grid-cols-2"
                      : "grid-cols-1 gap-0",
                    "max-sm:grid-cols-1",
                  )}
                >
                  <div className="flex min-w-0 flex-col justify-between">
                    <span className="text-[0.96875rem] font-normal tabular-nums leading-none text-muted-foreground/50 sm:text-[1.03125rem]">
                      {card.num}
                    </span>

                    <div className="mt-4">
                      <h3 className="whitespace-nowrap font-heading text-xl font-medium tracking-tight text-foreground sm:text-[1.375rem]">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground sm:text-[0.9375rem]">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "relative min-h-0 overflow-hidden rounded-2xl",
                      "transition-[opacity,width] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      "motion-reduce:transition-none",
                      isActive
                        ? "h-full opacity-100 max-sm:mt-2 max-sm:h-[11rem]"
                        : "h-0 w-0 opacity-0",
                    )}
                    aria-hidden={!isActive}
                  >
                    {isActive ? (
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 50vw"
                        className="object-cover"
                      />
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}
