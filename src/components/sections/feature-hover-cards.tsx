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
      "https://framerusercontent.com/images/hYqXfHm4SLL09lb8eXINkwGpaY.png?width=640&height=857",
    alt: "Tela de criação de conta com campos de usuário e e-mail",
  },
  {
    num: "02",
    title: "Personalize o visual",
    description:
      "Ícone, splash, cores claro e escuro. Dois arquivos e app com sua marca.",
    image:
      "https://framerusercontent.com/images/lpUXQzvzgT4sfG94CeE4ukM15U.png?width=578&height=800",
    alt: "Lista de tarefas com cards de brainstorming e pesquisa",
  },
  {
    num: "03",
    title: "Publique onde quiser",
    description:
      "App Store, Play Store e Web. O Codemagic publica iOS até sem Mac.",
    image:
      "https://framerusercontent.com/images/XoXQ8sesm7JX8MLXDCX4E5uw.png?width=560&height=800",
    alt: "Dashboard de desempenho de vendas com gráfico",
  },
] as const;

/** Raio do shell = raio do card + padding. Cantos concêntricos. */
const CARD_RADIUS_CLASS = "rounded-3xl";
const SHELL_CLASS = "rounded-[1.875rem] p-2 sm:rounded-[2rem] sm:p-2.5";

/** Coluna fixa: mesma largura aberto/fechado (texto não reflowa). */
const COL_CLASS =
  "w-[10.25rem] shrink-0 flex-none sm:w-[10.75rem] lg:w-[11.25rem] max-sm:w-full";

const CARD_MAX_CLOSED =
  "max-w-[calc(2*var(--spacing-feature-card-x)+10.25rem)] sm:max-w-[calc(2*var(--spacing-feature-card-x)+10.75rem)] lg:max-w-[calc(2*var(--spacing-feature-card-x)+11.25rem)]";
const CARD_MAX_OPEN =
  "max-w-[calc(2*var(--spacing-feature-card-x)+20.5rem+var(--spacing-feature-card-gap))] sm:max-w-[calc(2*var(--spacing-feature-card-x)+21.5rem+var(--spacing-feature-card-gap))] lg:max-w-[calc(2*var(--spacing-feature-card-x)+22.5rem+var(--spacing-feature-card-gap))]";

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
        "mx-auto w-full max-w-[min(94vw,64rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[clamp(2.5rem,5vw,4rem)]",
      )}
    >
      <div
        className={cn(
          SHELL_CLASS,
          "border border-border/55 bg-feature-shell",
          "shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]",
          "dark:border-border/70 dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]",
        )}
      >
        <div className="flex gap-1.5 sm:gap-2 max-sm:flex-col max-sm:gap-2">
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
                  "max-sm:max-w-none max-sm:!flex-none",
                  isActive
                    ? cn(
                        "flex-[2]",
                        CARD_MAX_OPEN,
                        "border-black/[0.08] bg-feature-card-active",
                        "shadow-[0_1px_2px_rgba(26,30,44,0.05),0_10px_28px_-8px_rgba(26,30,44,0.1)]",
                        "dark:border-[#949eb838] dark:shadow-[0_2px_14px_rgba(0,0,0,0.28),0_16px_40px_-10px_rgba(0,0,0,0.42)]",
                      )
                    : cn(
                        "flex-1",
                        CARD_MAX_CLOSED,
                        "bg-feature-card",
                        "shadow-[0_1px_2px_rgba(26,30,44,0.03),0_6px_18px_-8px_rgba(26,30,44,0.06)]",
                        "dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_22px_-8px_rgba(0,0,0,0.3)]",
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
