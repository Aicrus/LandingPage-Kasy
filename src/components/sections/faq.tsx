"use client";

import { Accordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { contactMailtoHref } from "@/lib/contact";
import { cn } from "@/lib/utils";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const cardShadowClass = cn(
  "shadow-[0_1px_2px_rgba(4,43,89,0.04),0_6px_16px_-10px_rgba(4,43,89,0.12)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_20px_-10px_rgba(0,0,0,0.4)]",
);

export function Faq() {
  const t = useTranslations("faq");
  const FAQ_ITEMS = t.raw("items") as FaqItem[];

  return (
    <section
      id="faq"
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)] pb-[clamp(3rem,6vw,5rem)]",
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
          {t("heading")}
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="w-full max-w-[46rem]">
        <Accordion.Root className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => (
            <Accordion.Item
              key={item.id}
              value={item.id}
              className={cn(
                "overflow-hidden rounded-2xl border border-border/70 bg-card",
                cardShadowClass,
              )}
            >
              <Accordion.Header>
                <Accordion.Trigger
                  className={cn(
                    "group flex w-full items-center justify-between gap-4",
                    "px-5 py-4 sm:px-6 sm:py-[1.125rem]",
                    "text-left text-[0.9375rem] font-semibold text-foreground",
                    "cursor-pointer transition-colors duration-200 hover:bg-muted/50",
                    "outline-none focus-visible:bg-muted/50",
                  )}
                >
                  {item.question}
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                      "group-data-[panel-open]:rotate-180",
                    )}
                    strokeWidth={2.5}
                  />
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Panel
                className={cn(
                  "h-[var(--accordion-panel-height)] overflow-hidden",
                  "transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "data-[starting-style]:h-0 data-[ending-style]:h-0",
                )}
              >
                <p className="px-5 pb-5 text-[0.875rem] leading-[1.6] text-muted-foreground sm:px-6 sm:pb-6">
                  {item.answer}
                </p>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>

        <div
          className={cn(
            "mt-4 flex flex-col gap-3 rounded-2xl border border-border/70 bg-card px-5 py-3.5 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:px-6 sm:py-4",
            cardShadowClass,
          )}
        >
          <div className="min-w-0 text-left">
            <h3 className="text-[0.9375rem] font-semibold text-foreground">{t("contact.heading")}</h3>
            <p className="mt-0.5 text-[0.8125rem] leading-snug text-muted-foreground">
              {t("contact.body")}
            </p>
          </div>
          <Button
            variant="outline"
            nativeButton={false}
            className="h-auto w-full shrink-0 rounded-full px-4 py-2 sm:w-auto"
            render={
              <a href={contactMailtoHref(t("contact.mailSubject"))} aria-label={t("contact.cta")} />
            }
          >
            {t("contact.cta")}
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
