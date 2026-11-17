"use client";

import { SiAndroid, SiApple } from "@icons-pack/react-simple-icons";
import { ArrowUpRight, Download } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentType } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Links do app de teste (o mesmo app que o `kasy new` entrega).
 * - iOS: link público do grupo "Testadores Externos" no TestFlight.
 * - Android: APK assinado publicado como asset da Release mais recente do
 *   repositório público LandingPage-Kasy. `latest/download` mantém a URL fixa:
 *   pra atualizar o APK basta publicar uma Release nova com o mesmo nome de arquivo.
 */
const TESTFLIGHT_INVITE_URL = "https://testflight.apple.com/join/WVZT4XKr";
const TESTFLIGHT_APP_URL = "https://apps.apple.com/app/testflight/id899247664";
const ANDROID_APK_URL =
  "https://github.com/Aicrus/LandingPage-Kasy/releases/latest/download/kasy-app.apk";

type Step = { title: string; body: string };

type PlatformCopy = {
  title: string;
  badge: string;
  steps: Step[];
  cta: string;
  secondaryCta?: string;
  note?: string;
};

const cardShadowClass = cn(
  "shadow-[0_1px_2px_rgba(4,43,89,0.04),0_6px_16px_-10px_rgba(4,43,89,0.12)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_20px_-10px_rgba(0,0,0,0.4)]",
);

const primaryCtaClass = cn(
  "h-auto w-full rounded-full px-5 py-2.5 text-[0.9375rem]",
  "border-[1.5px] border-[color-mix(in_oklch,var(--primary),white_13%)]",
  "transition-[transform,filter] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
  "motion-safe:hover:-translate-y-0.5 motion-safe:hover:brightness-[1.03] hover:bg-primary",
);

function PlatformCard({
  Icon,
  copy,
  ctaHref,
  ctaIcon: CtaIcon,
  ctaDownload,
  secondaryHref,
}: {
  Icon: ComponentType<{ className?: string; color?: string }>;
  copy: PlatformCopy;
  ctaHref: string;
  ctaIcon: ComponentType<{ className?: string; strokeWidth?: number }>;
  ctaDownload?: boolean;
  secondaryHref?: string;
}) {
  return (
    <div
      className={cn(
        "flex h-full flex-col rounded-2xl border border-border/70 bg-card",
        "p-5 sm:p-6",
        cardShadowClass,
      )}
    >
      <div className="flex items-center gap-3">
        <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-muted text-foreground">
          <Icon className="size-5" color="currentColor" />
        </span>
        <h3 className="font-heading text-lg font-semibold tracking-[-0.01em] text-foreground">
          {copy.title}
        </h3>
        <span className="ml-auto rounded-full border border-border/70 px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
          {copy.badge}
        </span>
      </div>

      <ol className="mt-5 flex flex-1 flex-col gap-4">
        {copy.steps.map((step, i) => (
          <li key={step.title} className="flex gap-3">
            <span
              aria-hidden
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold tabular-nums text-muted-foreground"
            >
              {i + 1}
            </span>
            <div className="min-w-0 pt-0.5">
              <p className="text-[0.9375rem] font-medium leading-snug text-foreground">
                {step.title}
              </p>
              <p className="mt-0.5 text-pretty text-sm leading-[1.55] text-muted-foreground">
                {step.body}
              </p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-6 flex flex-col gap-2">
        <Button
          variant="default"
          nativeButton={false}
          className={primaryCtaClass}
          render={
            <a
              href={ctaHref}
              {...(ctaDownload ? { download: "" } : { target: "_blank", rel: "noopener noreferrer" })}
            />
          }
        >
          <CtaIcon className="size-4" strokeWidth={2.25} />
          {copy.cta}
        </Button>
        {secondaryHref && copy.secondaryCta ? (
          <Button
            variant="ghost"
            nativeButton={false}
            className="h-auto w-full rounded-full px-5 py-2 text-sm text-muted-foreground"
            render={<a href={secondaryHref} target="_blank" rel="noopener noreferrer" />}
          >
            {copy.secondaryCta}
            <ArrowUpRight className="size-3.5" strokeWidth={2.25} />
          </Button>
        ) : copy.note ? (
          <p className="py-2 text-center text-sm text-muted-foreground">{copy.note}</p>
        ) : null}
      </div>
    </div>
  );
}

export function TryTheApp() {
  const t = useTranslations("tryTheApp");
  const ios = t.raw("ios") as PlatformCopy;
  const android = t.raw("android") as PlatformCopy;

  return (
    <section
      id="testar"
      className={cn(
        "mx-auto flex w-full scroll-mt-24 flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)] pb-[clamp(2rem,4vw,3.5rem)]",
      )}
    >
      <Reveal
        className={cn(
          "flex w-full flex-col items-center text-center",
          "gap-[clamp(0.75rem,1vw+0.25rem,1.125rem)]",
          "mb-[clamp(1.75rem,3vw,2.5rem)] px-[clamp(1.25rem,4vw,3.5rem)]",
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
        <p className="max-w-fluid-subtitle text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
          {t("subtitle")}
        </p>
      </Reveal>

      <Reveal delay={0.1} className="w-full max-w-[52rem]">
        <div className="grid gap-4 md:grid-cols-2">
          <PlatformCard
            Icon={SiApple}
            copy={ios}
            ctaHref={TESTFLIGHT_INVITE_URL}
            ctaIcon={ArrowUpRight}
            secondaryHref={TESTFLIGHT_APP_URL}
          />
          <PlatformCard
            Icon={SiAndroid}
            copy={android}
            ctaHref={ANDROID_APK_URL}
            ctaIcon={Download}
            ctaDownload
          />
        </div>
        <p className="mt-5 text-center text-[0.8125rem] text-muted-foreground/80 max-md:hidden">
          {t("desktopHint")}
        </p>
      </Reveal>
    </section>
  );
}
