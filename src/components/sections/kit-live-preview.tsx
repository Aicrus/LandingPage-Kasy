"use client";

import {
  ExternalLink,
  LayoutDashboard,
  Radio,
  Smartphone,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useRef, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const KIT_PREVIEW_ORIGIN = "https://fir-kit-8e56b.web.app";

type PreviewMode = "app" | "admin";
type CanvasTheme = "light" | "dark";

const PREVIEW_MODES: PreviewMode[] = ["app", "admin"];
/** Flutter web nem sempre dispara onLoad de forma limpa; evita overlay infinito. */
const IFRAME_READY_TIMEOUT_MS = 12_000;

function buildKitEmbedUrl(mode: PreviewMode, theme: CanvasTheme) {
  const url = new URL(`${KIT_PREVIEW_ORIGIN}/`);
  if (theme === "dark") {
    url.searchParams.set("embedCanvas", "dark");
  }
  if (mode === "admin") {
    url.searchParams.set("enter", "demo");
  } else {
    // Explicit preview mode keeps App guest session isolated from Admin.
    url.searchParams.set("embed", "preview");
  }
  return url.toString();
}

function getExternalUrl(mode: PreviewMode) {
  return mode === "admin"
    ? `${KIT_PREVIEW_ORIGIN}/?enter=demo`
    : KIT_PREVIEW_ORIGIN;
}

function embedModeFromMessage(embed: unknown): PreviewMode | null {
  if (embed === "admin") return "admin";
  if (embed === "preview" || embed === "app") return "app";
  return null;
}

const FRAME_SHADOW = cn(
  "shadow-[0_1px_2px_rgba(4,43,89,0.05),0_24px_48px_-20px_rgba(4,43,89,0.22)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_28px_56px_-18px_rgba(0,0,0,0.65)]",
);

const MODE_ICONS = {
  app: Smartphone,
  admin: LayoutDashboard,
} as const;

const IFRAME_TITLES = {
  app: "iframeTitle",
  admin: "iframeTitleAdmin",
} as const;

const LOADING_KEYS = {
  app: "loading",
  admin: "adminLoading",
} as const;

function PreviewLoading({ mode }: { mode: PreviewMode }) {
  const t = useTranslations("kitLivePreview");

  return (
    <div className="absolute inset-0 z-[2] flex flex-col items-center justify-center gap-3 bg-muted/40 px-6 text-center">
      <span className="size-8 animate-spin rounded-full border-2 border-primary/25 border-t-primary" />
      <p className="text-pretty text-sm text-muted-foreground">{t(LOADING_KEYS[mode])}</p>
    </div>
  );
}

function BrowserTabs({
  mode,
  onChange,
}: {
  mode: PreviewMode;
  onChange: (mode: PreviewMode) => void;
}) {
  const t = useTranslations("kitLivePreview");

  return (
    <div
      role="tablist"
      aria-label={t("tablistLabel")}
      className="flex min-w-0 items-end gap-px"
    >
      {PREVIEW_MODES.map((value) => {
        const Icon = MODE_ICONS[value];
        const isActive = mode === value;

        return (
          <button
            key={value}
            type="button"
            role="tab"
            id={`kit-preview-tab-${value}`}
            aria-selected={isActive}
            aria-controls="kit-preview-panel"
            onClick={() => onChange(value)}
            className={cn(
              "inline-flex max-w-[7.5rem] items-center gap-1.5 border border-b-0 px-2.5 py-1.5 sm:max-w-none sm:px-3",
              "rounded-t-[0.625rem] text-[0.6875rem] font-medium transition-colors sm:text-xs",
              isActive
                ? "z-10 -mb-px border-border/70 bg-card text-foreground"
                : "border-transparent bg-black/[0.03] text-muted-foreground hover:bg-black/[0.05] hover:text-foreground/85 dark:bg-white/[0.04] dark:hover:bg-white/[0.07]",
            )}
          >
            <Icon className="size-3 shrink-0" strokeWidth={2.25} aria-hidden />
            <span className="truncate">{t(`tab${value === "app" ? "App" : "Admin"}`)}</span>
          </button>
        );
      })}
    </div>
  );
}

function BrowserChrome({
  mode,
  onModeChange,
}: {
  mode: PreviewMode;
  onModeChange: (mode: PreviewMode) => void;
}) {
  const t = useTranslations("kitLivePreview");

  return (
    <div
      className={cn(
        "flex items-end gap-2 border-b border-border/70 bg-muted/40 px-3 pt-2 pb-0 sm:gap-2.5 sm:px-4",
      )}
    >
      <div className="flex shrink-0 items-center gap-1.5 pb-2.5" aria-hidden>
        <span className="size-2.5 rounded-full bg-[#ff5f57] sm:size-3" />
        <span className="size-2.5 rounded-full bg-[#febc2e] sm:size-3" />
        <span className="size-2.5 rounded-full bg-[#28c840] sm:size-3" />
      </div>

      <BrowserTabs mode={mode} onChange={onModeChange} />

      <div className="min-w-0 flex-1" aria-hidden />

      <span
        className={cn(
          "mb-2.5 inline-flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5",
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
  const { resolvedTheme } = useTheme();
  const shellRef = useRef<HTMLDivElement>(null);
  const [mode, setMode] = useState<PreviewMode>("app");
  const [shouldLoad, setShouldLoad] = useState(false);
  const [themeReady, setThemeReady] = useState(false);
  const [ready, setReady] = useState<Record<PreviewMode, boolean>>({
    app: false,
    admin: false,
  });
  const [adminSrcEnabled, setAdminSrcEnabled] = useState(false);

  useEffect(() => {
    setThemeReady(true);
  }, []);

  useEffect(() => {
    if (mode === "admin") {
      setAdminSrcEnabled(true);
    }
  }, [mode]);

  useEffect(() => {
    if (!ready.app || adminSrcEnabled) return;

    const preloadId = window.setTimeout(() => {
      setAdminSrcEnabled(true);
    }, 2_500);

    return () => window.clearTimeout(preloadId);
  }, [adminSrcEnabled, ready.app]);

  const canvasTheme: CanvasTheme =
    themeReady && resolvedTheme === "dark" ? "dark" : "light";

  const appSrc = useMemo(
    () => buildKitEmbedUrl("app", canvasTheme),
    [canvasTheme],
  );
  const adminSrc = useMemo(
    () => buildKitEmbedUrl("admin", canvasTheme),
    [canvasTheme],
  );

  // Only reset readiness when the iframe URL changes (theme), never on tab
  // switch. Switching tabs used to clear ready while the already-booted iframe
  // skipped a second onLoad, leaving the spinner stuck until the timeout.
  useEffect(() => {
    setReady({ app: false, admin: false });
  }, [appSrc, adminSrc]);

  const externalUrl = getExternalUrl(mode);

  const frameSrc = (tab: PreviewMode) => {
    if (!shouldLoad) return undefined;
    if (tab === "admin" && !adminSrcEnabled) return undefined;
    return tab === "app" ? appSrc : adminSrc;
  };

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== KIT_PREVIEW_ORIGIN) return;
      const data = event.data;
      if (!data || typeof data !== "object") return;
      const payload = data as { type?: unknown; embed?: unknown };
      if (payload.type !== "kasy-embed-ready") return;
      const tab = embedModeFromMessage(payload.embed);
      if (!tab) return;
      setReady((current) =>
        current[tab] ? current : { ...current, [tab]: true },
      );
    };

    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  useEffect(() => {
    if (!shouldLoad) return;

    const timeouts = PREVIEW_MODES.map((tab) => {
      if (ready[tab] || (tab === "admin" && !adminSrcEnabled)) return undefined;

      return window.setTimeout(() => {
        setReady((current) =>
          current[tab] ? current : { ...current, [tab]: true },
        );
      }, IFRAME_READY_TIMEOUT_MS);
    });

    return () => {
      timeouts.forEach((id) => {
        if (id !== undefined) window.clearTimeout(id);
      });
    };
  }, [adminSrcEnabled, ready, shouldLoad]);

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

          <BrowserChrome mode={mode} onModeChange={setMode} />

          <div
            id="kit-preview-panel"
            role="tabpanel"
            aria-labelledby={`kit-preview-tab-${mode}`}
            className={cn(
              "relative bg-card",
              "h-[min(72vh,38rem)] min-h-[22rem] sm:min-h-[26rem] md:min-h-[30rem]",
              mode === "admin" && "md:min-h-[32rem]",
            )}
          >
            {shouldLoad ? (
              <>
                {PREVIEW_MODES.map((tab) => {
                  const isActive = mode === tab;
                  const src = frameSrc(tab);
                  if (!src) return null;

                  return (
                    <iframe
                      key={`kit-preview-${tab}-${src}`}
                      ref={
                        tab === "app"
                          ? (node) => node?.setAttribute("credentialless", "")
                          : undefined
                      }
                      src={src}
                      title={t(IFRAME_TITLES[tab])}
                      loading="lazy"
                      allow="fullscreen; clipboard-read; clipboard-write"
                      tabIndex={isActive ? 0 : -1}
                      aria-hidden={!isActive}
                      onLoad={() =>
                        setReady((current) => ({ ...current, [tab]: true }))
                      }
                      className={cn(
                        "absolute inset-0 size-full border-0 bg-background",
                        isActive
                          ? "z-[1] visible opacity-100"
                          : "z-0 invisible opacity-0 pointer-events-none",
                      )}
                    />
                  );
                })}
                {!ready[mode] ? <PreviewLoading mode={mode} /> : null}
              </>
            ) : (
              <PreviewLoading mode="app" />
            )}
          </div>
        </div>

        <div className="mt-5 flex flex-col items-center justify-center gap-3">
          <p className="max-w-[32rem] text-pretty text-center text-[0.8125rem] text-muted-foreground sm:text-sm">
            {mode === "admin" ? t("hintAdmin") : t("hintApp")}
          </p>
          <Button
            variant="outline"
            size="sm"
            nativeButton={false}
            className="gap-1.5"
            render={
              <a href={externalUrl} target="_blank" rel="noopener noreferrer" />
            }
          >
            {mode === "admin" ? t("openFullAdmin") : t("openFullApp")}
            <ExternalLink className="size-3.5" strokeWidth={2.25} aria-hidden />
          </Button>
        </div>
      </Reveal>
    </section>
  );
}
