"use client";

import { ExternalLink, Lock, Radio } from "lucide-react";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const KIT_PREVIEW_URL = "https://fir-kit-8e56b.web.app/";
/** Endereço exibido na barra do mock (o iframe usa a URL real acima). */
const KIT_PREVIEW_DISPLAY_HOST = "demo.kasy.dev";

const FRAME_SHADOW = cn(
  "shadow-[0_1px_2px_rgba(4,43,89,0.05),0_24px_48px_-20px_rgba(4,43,89,0.22)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_28px_56px_-18px_rgba(0,0,0,0.65)]",
);

function BrowserChrome() {
  const t = useTranslations("kitLivePreview");

  return (
    <div
      className={cn(
        "flex items-center gap-2.5 border-b border-border/70 px-3 py-2.5 sm:gap-3 sm:px-4 sm:py-3",
        "bg-card/95 backdrop-blur-sm",
      )}
    >
      <div className="flex shrink-0 items-center gap-1.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-[#ff5f57] sm:size-3" />
        <span className="size-2.5 rounded-full bg-[#febc2e] sm:size-3" />
        <span className="size-2.5 rounded-full bg-[#28c840] sm:size-3" />
      </div>

      <div
        className={cn(
          "flex min-w-0 flex-1 items-center gap-2 rounded-lg border border-border/60 bg-muted/50 px-2.5 py-1.5 sm:px-3 sm:py-2",
        )}
      >
        <Lock
          className="size-3 shrink-0 text-emerald-600 dark:text-emerald-400 sm:size-3.5"
          strokeWidth={2.25}
          aria-hidden
        />
        <span className="truncate font-mono text-[0.6875rem] text-muted-foreground sm:text-xs">
          {KIT_PREVIEW_DISPLAY_HOST}
        </span>
      </div>

      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5",
          "bg-emerald-500/10 text-[0.625rem] font-semibold uppercase tracking-[0.08em] text-emerald-600",
          "dark:text-emerald-400 sm:px-2.5 sm:py-1 sm:text-[0.6875rem]",
        )}
      >
        <Radio className="size-2.5 animate-pulse sm:size-3" strokeWidth={2.5} aria-hidden />
        {t("liveBadge")}
      </span>
    </div>
  );
}

export function KitLivePreview() {
  const t = useTranslations("kitLivePreview");
  const shellRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const node = shellRef.current;
    if (!node) return;

    const activate = () => setShouldLoad(true);

    const isVisible = () => {
      const rect = node.getBoundingClientRect();
      return rect.top < window.innerHeight + 200 && rect.bottom > -200;
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          activate();
          observer.disconnect();
        }
      },
      { rootMargin: "200px 0px", threshold: 0 },
    );

    observer.observe(node);

    if (isVisible()) {
      activate();
      observer.disconnect();
      return () => observer.disconnect();
    }

    const retryId = window.setTimeout(() => {
      if (isVisible()) {
        activate();
        observer.disconnect();
      }
    }, 400);

    return () => {
      window.clearTimeout(retryId);
      observer.disconnect();
    };
  }, []);

  return (
    <section
      id="kit-live-preview"
      aria-label={t("ariaLabel")}
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[clamp(2.5rem,5vw,4rem)] pb-[clamp(3rem,6vw,5rem)]",
      )}
    >
      <Reveal
        className={cn(
          "flex w-full flex-col items-center text-center",
          "gap-[clamp(0.75rem,1vw+0.25rem,1.125rem)]",
          "mb-[clamp(1.75rem,3vw,2.5rem)] px-[clamp(0.5rem,3vw,2rem)]",
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
        <p className="max-w-[38rem] text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
          {t("subtitle")}
        </p>
      </Reveal>

      <Reveal delay={0.06} className="w-full">
        <div
          ref={shellRef}
          className={cn(
            "relative mx-auto w-full max-w-[min(100%,68rem)] overflow-hidden rounded-2xl border border-border/70 bg-card",
            "sm:rounded-[1.35rem]",
            FRAME_SHADOW,
          )}
        >
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-px rounded-[inherit] bg-gradient-to-b from-primary/[0.07] via-transparent to-transparent"
          />

          <BrowserChrome />

          <div
            className={cn(
              "relative bg-muted/30",
              "h-[min(72vh,38rem)] min-h-[22rem] sm:min-h-[26rem] md:min-h-[30rem]",
            )}
          >
            {shouldLoad ? (
              <iframe
                src={KIT_PREVIEW_URL}
                title={t("iframeTitle")}
                loading="lazy"
                allow="fullscreen; clipboard-read; clipboard-write"
                className="absolute inset-0 size-full border-0 bg-background"
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-muted/40 px-6 text-center">
                <span className="size-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
                <p className="text-pretty text-sm text-muted-foreground">{t("loading")}</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
          <p className="text-pretty text-center text-[0.8125rem] text-muted-foreground sm:text-sm">
            {t("hint")}
          </p>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            className="shrink-0 gap-1.5"
            render={
              <a
                href={KIT_PREVIEW_URL}
                target="_blank"
                rel="noopener noreferrer"
              />
            }
          >
            {t("openFull")}
            <ExternalLink className="size-3.5" strokeWidth={2.25} aria-hidden />
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
