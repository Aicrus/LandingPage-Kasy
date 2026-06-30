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
    alt: "Laptop com editor de código e terminal aberto",
  },
  {
    num: "02",
    title: "Personalize o visual",
    description:
      "Ícone, splash, cores claro e escuro. Dois arquivos e app com sua marca.",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=640&h=800&q=80",
    alt: "Paleta de cores e ferramentas de identidade visual de um app",
  },
  {
    num: "03",
    title: "Publique onde quiser",
    description:
      "App Store, Play Store e Web. O Codemagic publica iOS até sem Mac.",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=640&h=800&q=80",
    alt: "Smartphones com apps instalados sobre uma mesa",
  },
] as const;

/** Raio do shell = raio do card + padding. Cantos concêntricos. */
const CARD_RADIUS_CLASS = "rounded-3xl";
const SHELL_CLASS = "rounded-[1.875rem] p-2 sm:rounded-[2rem] sm:p-2.5";

/** Coluna fixa: mesma largura aberto/fechado (texto não reflowa). */
const COL_CLASS =
  "w-[10.25rem] shrink-0 flex-none sm:w-[10.75rem] lg:w-[11.25rem] max-sm:w-full";

const CARD_W_CLOSED =
  "w-[calc(2*var(--spacing-feature-card-x)+10.25rem)] sm:w-[calc(2*var(--spacing-feature-card-x)+10.75rem)] lg:w-[calc(2*var(--spacing-feature-card-x)+11.25rem)]";
const CARD_W_OPEN =
  "w-[calc(2*var(--spacing-feature-card-x)+20.5rem+var(--spacing-feature-card-gap))] sm:w-[calc(2*var(--spacing-feature-card-x)+21.5rem+var(--spacing-feature-card-gap))] lg:w-[calc(2*var(--spacing-feature-card-x)+22.5rem+var(--spacing-feature-card-gap))]";

const CARD_INNER_PAD =
  "px-[var(--spacing-feature-card-x)] py-[var(--spacing-feature-card-y)]";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const TRANSITION =
  "transition-[flex-grow,flex-basis,width,opacity,gap,max-width,background-color,box-shadow,border-color] duration-500 motion-reduce:transition-none";

export function FeatureHoverCards() {
  const [active, setActive] = useState(0);

  return (
    <div
      className={cn(
        "flex justify-center",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[clamp(2.5rem,5vw,4rem)]",
      )}
    >
      <div
        className={cn(
          SHELL_CLASS,
          "w-fit max-w-full",
          "border border-border/55 bg-feature-shell",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
          "dark:border-border/70 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        )}
      >
        <div className="flex w-fit max-w-full gap-1.5 sm:gap-2 max-sm:w-full max-sm:flex-col max-sm:gap-2">
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
                  "relative flex min-h-[16rem] min-w-0 cursor-default overflow-hidden sm:min-h-[19.5rem]",
                  CARD_RADIUS_CLASS,
                  "border border-black/[0.06] dark:border-[#949eb822]",
                  TRANSITION,
                  EASE,
                  "outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "shrink-0 flex-none max-sm:w-full",
                  isActive
                    ? cn(
                        CARD_W_OPEN,
                        "border-black/[0.08] bg-feature-card-active",
                        "shadow-[0_1px_2px_rgba(26,30,44,0.025),0_6px_16px_-8px_rgba(26,30,44,0.05)]",
                        "dark:border-[#949eb838] dark:shadow-[0_1px_8px_rgba(0,0,0,0.12),0_8px_22px_-10px_rgba(0,0,0,0.2)]",
                      )
                    : cn(
                        CARD_W_CLOSED,
                        "bg-feature-card",
                        "shadow-[0_1px_1px_rgba(26,30,44,0.02),0_4px_12px_-8px_rgba(26,30,44,0.035)]",
                        "dark:shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_14px_-8px_rgba(0,0,0,0.14)]",
                      ),
                )}
              >
                <div
                  className={cn(
                    "flex h-full w-full",
                    CARD_INNER_PAD,
                    TRANSITION,
                    EASE,
                    isActive
                      ? "gap-[var(--spacing-feature-card-gap)]"
                      : "gap-0",
                    "max-sm:flex-col",
                  )}
                >
                  <div
                    className={cn(
                      COL_CLASS,
                      "flex h-full flex-col justify-between",
                    )}
                  >
                    <span className="font-normal tabular-nums text-fluid-feature-num text-muted-foreground/55">
                      {card.num}
                    </span>

                    <div className="min-w-0">
                      <h3 className="truncate font-heading text-fluid-feature-title font-normal tracking-[var(--text-fluid-feature-title--letter-spacing)] text-foreground">
                        {card.title}
                      </h3>
                      <p className="mt-1.5 font-rounded text-pretty text-fluid-feature-desc leading-[var(--text-fluid-feature-desc--line-height)] text-muted-foreground">
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "relative h-full min-w-0 overflow-hidden rounded-2xl",
                      TRANSITION,
                      EASE,
                      isActive
                        ? cn(COL_CLASS, "opacity-100 max-sm:!h-[10.5rem]")
                        : "w-0 min-w-0 opacity-0 max-sm:!h-0 max-sm:!w-0",
                      !isActive && "pointer-events-none",
                    )}
                    aria-hidden={!isActive}
                  >
                    {isActive ? (
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, 180px"
                        className="object-cover object-top"
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
