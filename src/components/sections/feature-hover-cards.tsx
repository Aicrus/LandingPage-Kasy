"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { motion, fadeInUp, staggerContainer } from "@/lib/motion";
import { useMediaQuery } from "@/lib/use-media-query";
import { cn } from "@/lib/utils";
import { type as typeScale } from "@/lib/typography";

const LG_MEDIA = "(min-width: 1024px)";

type CardCopy = { title: string; description: string; alt: string };

const CARDS_META = [
  {
    key: "commands",
    num: "01",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=640&h=800&q=80",
  },
  {
    key: "branding",
    num: "02",
    image:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=640&h=800&q=80",
  },
  {
    key: "everywhere",
    num: "03",
    image:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=640&h=800&q=80",
  },
] as const;

const CARD_RADIUS_CLASS = "rounded-3xl";
const SHELL_CLASS =
  "rounded-[1.875rem] p-[var(--spacing-feature-shell-pad)] sm:rounded-[2rem]";

const CARD_W_CLOSED =
  "lg:w-[calc(2*var(--spacing-feature-card-x)+var(--feature-col-w))]";
const CARD_W_OPEN =
  "lg:w-[calc(2*var(--spacing-feature-card-x)+2*var(--feature-col-w)+var(--spacing-feature-card-gap))]";

const CARD_PAD_X = "px-[var(--spacing-feature-card-x)]";
const CARD_PAD_Y =
  "py-[var(--spacing-feature-card-y-mobile)] sm:py-[var(--spacing-feature-card-y)]";

const EASE = "ease-[cubic-bezier(0.22,1,0.36,1)]";
const TRANSITION =
  "transition-[flex-grow,flex-basis,width,opacity,gap,max-width,background-color,box-shadow] duration-500 motion-reduce:transition-none";

const CARD_ACTIVE_SHADOW =
  "bg-feature-card-active shadow-[0_1px_2px_rgba(26,30,44,0.025),0_6px_16px_-8px_rgba(26,30,44,0.05)] dark:shadow-[0_1px_8px_rgba(0,0,0,0.12),0_8px_22px_-10px_rgba(0,0,0,0.2)]";

const CARD_IDLE_SHADOW =
  "bg-feature-card shadow-[0_1px_1px_rgba(26,30,44,0.02),0_4px_12px_-8px_rgba(26,30,44,0.035)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.08),0_4px_14px_-8px_rgba(0,0,0,0.14)]";

export function FeatureHoverCards() {
  const t = useTranslations("featureHoverCards");
  const isLgUp = useMediaQuery(LG_MEDIA);
  const [active, setActive] = useState(0);
  const cardsCopy = t.raw("cards") as Record<string, CardCopy>;
  const CARDS = CARDS_META.map((meta) => ({ ...meta, ...cardsCopy[meta.key] }));

  const activate = useCallback(
    (index: number) => {
      if (isLgUp) setActive(index);
    },
    [isLgUp],
  );

  return (
    <div
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)]",
      )}
    >
      <Reveal
        className={cn(
          "flex w-full flex-col items-center text-center",
          "gap-[clamp(0.75rem,1vw+0.25rem,1.125rem)]",
          "mb-[var(--spacing-features-title-to-cards)]",
        )}
      >
        <h2
          className={cn(
            "text-balance font-heading font-bold text-foreground",
            "text-[clamp(1.625rem,1.15rem+1.6vw,2.5rem)]",
            "leading-[1.12] tracking-[-0.02em]",
          )}
        >
          {t("heading")}
        </h2>
        <p
          className={cn(
            "max-w-fluid-subtitle text-pretty font-rounded text-fluid-subtitle text-muted-foreground",
          )}
        >
          {t("subtitle")}
        </p>
      </Reveal>

      <div className="flex w-full justify-center">
        <div
          className={cn(
            SHELL_CLASS,
            "w-full min-w-0 overflow-hidden",
            "lg:w-[var(--feature-shell-w)] lg:max-w-full",
            "bg-feature-shell",
          )}
        >
          <Reveal
            variants={staggerContainer}
            delay={0.1}
            className={cn(
              "grid w-full gap-[var(--spacing-feature-shell-pad)]",
              "max-sm:grid-cols-1",
              "sm:grid-cols-2 lg:flex lg:w-[var(--feature-track-w)] lg:max-w-full lg:shrink-0",
            )}
          >
          {CARDS.map((card, index) => {
            const isActive = active === index;
            const isExpanded = isLgUp ? isActive : true;

            return (
              <motion.article
                key={card.num}
                variants={fadeInUp}
                onMouseEnter={() => activate(index)}
                onFocus={() => activate(index)}
                tabIndex={isLgUp ? 0 : -1}
                aria-expanded={isExpanded}
                className={cn(
                  "relative flex min-w-0 overflow-hidden",
                  CARD_RADIUS_CLASS,
                  TRANSITION,
                  EASE,
                  isLgUp &&
                    "cursor-default outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                  "w-full lg:shrink-0 lg:flex-none",
                  "sm:min-h-[17rem] lg:min-h-[22rem]",
                  index === 2 && "sm:col-span-2",
                  isLgUp && (isActive ? CARD_W_OPEN : CARD_W_CLOSED),
                  isExpanded ? CARD_ACTIVE_SHADOW : CARD_IDLE_SHADOW,
                )}
              >
                <div
                  className={cn(
                    "flex w-full min-w-0",
                    CARD_PAD_X,
                    CARD_PAD_Y,
                    TRANSITION,
                    EASE,
                    isExpanded
                      ? "gap-[var(--spacing-feature-card-gap)]"
                      : "lg:gap-0",
                    "max-sm:flex-col",
                    "sm:flex-row sm:items-stretch",
                  )}
                >
                  <div
                    className={cn(
                      "flex min-w-0 flex-col",
                      "gap-[var(--spacing-feature-num-to-title)]",
                      "lg:h-full lg:justify-between lg:gap-0",
                      "max-lg:flex-1",
                      "lg:w-[var(--feature-col-w)] lg:shrink-0 lg:flex-none",
                    )}
                  >
                    <span
                      className={cn(
                        typeScale.featureNum,
                        "text-muted-foreground/50",
                      )}
                    >
                      {card.num}
                    </span>

                    <div className="min-w-0">
                      <h3
                        className={cn(
                          typeScale.featureTitle,
                          "text-foreground",
                          "max-lg:text-balance",
                          "lg:truncate",
                        )}
                      >
                        {card.title}
                      </h3>
                      <p
                        className={cn(
                          typeScale.featureDesc,
                          "mt-[var(--spacing-feature-title-to-desc)] text-pretty text-muted-foreground",
                        )}
                      >
                        {card.description}
                      </p>
                    </div>
                  </div>

                  <div
                    className={cn(
                      "relative min-w-0 shrink-0 overflow-hidden rounded-2xl",
                      TRANSITION,
                      EASE,
                      isExpanded
                        ? cn(
                            "opacity-100",
                            "h-[var(--spacing-feature-image-h-mobile)] w-full",
                            "sm:min-h-[var(--spacing-feature-image-h-tablet)] sm:flex-1 sm:self-stretch",
                            "lg:h-full lg:w-[var(--feature-col-w)] lg:flex-none",
                          )
                        : cn(
                            "pointer-events-none w-0 opacity-0",
                            "lg:h-full",
                          ),
                    )}
                    aria-hidden={!isExpanded}
                  >
                    {isExpanded ? (
                      <Image
                        src={card.image}
                        alt={card.alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 260px"
                        className="object-cover object-top"
                      />
                    ) : null}
                  </div>
                </div>
              </motion.article>
            );
          })}
          </Reveal>
        </div>
      </div>
    </div>
  );
}
