"use client";

import { ArrowUpRight, Layers, Play, Terminal } from "lucide-react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FLOWS_URL = "https://flows.kasy.dev";

const CARDS_META = [
  { key: "preview", Icon: Play },
  { key: "install", Icon: Terminal },
  { key: "growing", Icon: Layers },
] as const;

type CardCopy = { title: string; description: string };

const cardShadowClass = cn(
  "shadow-[0_1px_2px_rgba(4,43,89,0.04),0_6px_16px_-10px_rgba(4,43,89,0.12)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_20px_-10px_rgba(0,0,0,0.4)]",
);

/** Flows: acervo de telas e fluxos prontos, incluído nos dois planos. */
export function FlowsShowcase() {
  const t = useTranslations("flowsShowcase");
  const cards = t.raw("cards") as Record<(typeof CARDS_META)[number]["key"], CardCopy>;

  return (
    <section
      id="flows"
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)]",
        "scroll-mt-[calc(var(--header-height-mobile)+0.75rem)] sm:scroll-mt-24",
      )}
    >
      <Reveal
        className={cn(
          "flex w-full flex-col items-center text-center",
          "gap-[clamp(0.75rem,1vw+0.25rem,1.125rem)]",
          "mb-[clamp(2rem,4vw,3rem)] px-[clamp(1.25rem,4vw,3.5rem)]",
        )}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          {t("eyebrow")}
        </span>
        <h2
          className={cn(
            "text-balance font-heading font-bold text-foreground",
            "text-[clamp(1.625rem,1.15rem+1.6vw,2.5rem)]",
            "leading-[1.12] tracking-[-0.02em]",
          )}
        >
          {t("headingPart1")} <span className="text-primary">{t("headingEmphasis")}</span>
        </h2>
        <p className="max-w-fluid-subtitle text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
          {t("subtitle")}
        </p>
      </Reveal>

      <Reveal delay={0.1} className="grid w-full max-w-[60rem] grid-cols-1 gap-4 sm:grid-cols-3">
        {CARDS_META.map(({ key, Icon }) => (
          <div
            key={key}
            className={cn(
              "flex flex-col gap-3 rounded-2xl border border-border/70 bg-card p-6",
              cardShadowClass,
            )}
          >
            <span className="flex size-9 items-center justify-center rounded-lg bg-muted text-foreground">
              <Icon className="size-4.5" strokeWidth={2} />
            </span>
            <h3 className="font-heading text-base font-semibold text-foreground">
              {cards[key].title}
            </h3>
            <p className="text-[0.875rem] leading-snug text-muted-foreground">
              {cards[key].description}
            </p>
          </div>
        ))}
      </Reveal>

      <Reveal delay={0.15} className="mt-8">
        <Button
          variant="outline"
          nativeButton={false}
          className="h-auto gap-1.5 rounded-full px-5 py-2.5 font-sans text-[0.9375rem]"
          render={<a href={FLOWS_URL} />}
        >
          {t("cta")}
          <ArrowUpRight className="size-4" />
        </Button>
      </Reveal>
    </section>
  );
}
