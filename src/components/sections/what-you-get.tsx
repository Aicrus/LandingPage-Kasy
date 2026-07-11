"use client";

import {
  Bell,
  CreditCard,
  KeyRound,
  LayoutGrid,
  MessageSquare,
  PlusCircle,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import { AnimatePresence, fadeIn, motion } from "@/lib/motion";
import { cn } from "@/lib/utils";

import { BrandTile } from "./brand-icons";

type TaglineCopy = {
  emphasis: string;
  rest?: string;
};

type FeatureBullet = {
  label: string;
  detail?: string;
};

type FeatureTabMeta = {
  key: string;
  icon: LucideIcon;
  /** Cor de assinatura da categoria — cada aba tem a sua, não um azul genérico repetido. */
  accent: string;
  providers: string[];
};

type FeatureTabCopy = {
  label: string;
  tagline: TaglineCopy;
  /** `null` = sem número fixo (ex.: categoria "Mais", que é uma mistura). */
  saved: string | null;
  bullets?: FeatureBullet[];
  moreItems?: { label: string; desc: string }[];
};

type FeatureTab = FeatureTabMeta & FeatureTabCopy;

const FEATURE_TABS_META: FeatureTabMeta[] = [
  { key: "auth", icon: KeyRound, accent: "#2563eb", providers: ["Google", "Apple", "Facebook"] },
  { key: "subs", icon: CreditCard, accent: "#7c3aed", providers: ["RevenueCat", "Stripe"] },
  { key: "notif", icon: Bell, accent: "#f59e0b", providers: ["iOS", "Android"] },
  { key: "ui", icon: LayoutGrid, accent: "#059669", providers: ["iOS", "Android", "Web"] },
  {
    key: "sec",
    icon: ShieldCheck,
    accent: "#0d9488",
    providers: ["Firebase", "Supabase", "REST API"],
  },
  { key: "widget", icon: Smartphone, accent: "#db2777", providers: ["iOS", "Android"] },
  {
    key: "ai",
    icon: MessageSquare,
    accent: "#9333ea",
    providers: ["Firebase", "Supabase", "REST API"],
  },
  {
    key: "more",
    icon: PlusCircle,
    accent: "#64748b",
    providers: ["Firebase", "Supabase", "REST API"],
  },
];

const CARD_SHADOW_CLASS = cn(
  "shadow-[0_1px_2px_rgba(3,26,24,0.04),0_6px_16px_-10px_rgba(3,26,24,0.12)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_20px_-10px_rgba(0,0,0,0.4)]",
);

function TabTagline({ copy }: { copy: TaglineCopy }) {
  return (
    <p className="text-pretty text-[0.9375rem] leading-snug text-muted-foreground sm:text-base">
      <span className="font-bold text-inherit">{copy.emphasis}</span>
      {copy.rest}
    </p>
  );
}

function FeatureBulletText({ bullet }: { bullet: FeatureBullet }) {
  if (!bullet.detail) {
    return (
      <span className="text-pretty font-bold text-inherit">{bullet.label}</span>
    );
  }

  return (
    <span className="flex min-w-0 flex-col gap-0.5 sm:block sm:text-pretty">
      <span className="font-bold text-inherit sm:inline">{bullet.label}</span>
      <span className="text-[0.8125rem] leading-snug text-muted-foreground sm:inline sm:text-inherit sm:leading-inherit">
        <span className="hidden sm:inline">, </span>
        {bullet.detail}
      </span>
    </span>
  );
}

function TabPanelCard({
  tab,
  fillHeight = false,
}: {
  tab: FeatureTab;
  fillHeight?: boolean;
}) {
  const t = useTranslations("whatYouGet");

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-5 sm:p-6",
        CARD_SHADOW_CLASS,
        fillHeight && "lg:min-h-full",
      )}
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-start sm:justify-between sm:gap-4">
        <div className="min-w-0">
          <TabTagline copy={tab.tagline} />
          <div
            className={cn(
              "mt-2.5 flex flex-nowrap items-center gap-1.5 overflow-x-auto overflow-y-visible py-0.5 sm:gap-2",
              "max-sm:-mx-0.5 max-sm:px-0.5",
              "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
            )}
          >
            {tab.providers.map((name) => (
              <span
                key={name}
                className="inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full bg-muted/70 py-0.5 pr-2.5 pl-0.5 text-[0.6875rem] font-medium text-muted-foreground transition-colors duration-200 hover:bg-muted sm:gap-2 sm:py-1 sm:pr-3 sm:pl-1 sm:text-xs"
              >
                <BrandTile name={name} pill />
                {name}
              </span>
            ))}
          </div>
        </div>
        {tab.saved ? (
          <span className="w-fit max-w-[14rem] shrink-0 text-pretty rounded-md bg-emerald-500/10 px-2.5 py-1 font-mono text-xs font-semibold leading-snug text-emerald-600 dark:text-emerald-400 sm:max-w-[16rem]">
            {tab.saved}
          </span>
        ) : tab.moreItems ? (
          <span className="w-fit shrink-0 rounded-md bg-primary/10 px-2.5 py-1 font-mono text-xs font-semibold text-primary">
            {t("resourcesCount", { count: tab.moreItems.length })}
          </span>
        ) : null}
      </div>

      <div className="mt-5 border-t border-border/60">
        {tab.moreItems ? (
          <div className="grid grid-cols-1 gap-2.5 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            {tab.moreItems.map((item) => (
              <div
                key={item.label}
                className="rounded-xl bg-muted/50 p-3.5 transition-colors duration-200 hover:bg-muted sm:p-4"
              >
                <p className="text-pretty text-sm font-bold text-foreground">
                  {item.label}
                </p>
                <p className="mt-0.5 text-pretty text-xs leading-snug text-muted-foreground">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <ul>
            {tab.bullets?.map((bullet) => (
              <li
                key={`${bullet.label}-${bullet.detail ?? ""}`}
                className="group -mx-2 flex items-start gap-3 rounded-lg border-b border-border/50 px-2 py-3 text-sm text-foreground/90 transition-colors duration-200 last:border-b-0 hover:bg-muted/50 sm:px-2.5"
              >
                <span
                  aria-hidden
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-foreground/30 transition-colors duration-200 group-hover:bg-foreground/50 sm:mt-[0.55em]"
                />
                <FeatureBulletText bullet={bullet} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TabPanel({
  tab,
  fillHeight = false,
}: {
  tab: FeatureTab;
  fillHeight?: boolean;
}) {
  return (
    <motion.div
      role="tabpanel"
      id={`what-you-get-panel-${tab.key}`}
      aria-labelledby={`what-you-get-tab-${tab.key}`}
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      exit="hidden"
      transition={{ duration: 0.2 }}
      className={fillHeight ? "lg:min-h-full" : undefined}
    >
      <TabPanelCard tab={tab} fillHeight={fillHeight} />
    </motion.div>
  );
}

function tabListMaskStyle(edgeFade: { left: boolean; right: boolean }) {
  const fade = "2.75rem";

  if (!edgeFade.left && !edgeFade.right) return undefined;

  const gradient = (() => {
    if (edgeFade.left && edgeFade.right) {
      return `linear-gradient(to right, transparent, black ${fade}, black calc(100% - ${fade}), transparent)`;
    }
    if (edgeFade.right) {
      return `linear-gradient(to right, black calc(100% - ${fade}), transparent)`;
    }
    return `linear-gradient(to right, transparent, black ${fade})`;
  })();

  return {
    maskImage: gradient,
    WebkitMaskImage: gradient,
  } as const;
}

export function WhatYouGet() {
  const t = useTranslations("whatYouGet");
  const tabsCopy = t.raw("tabs") as Record<string, FeatureTabCopy>;
  const FEATURE_TABS: FeatureTab[] = FEATURE_TABS_META.map((meta) => ({
    ...meta,
    ...tabsCopy[meta.key],
  }));
  const TOTAL_FEATURE_COUNT = FEATURE_TABS.reduce(
    (sum, tab) => sum + (tab.bullets?.length ?? tab.moreItems?.length ?? 0),
    0,
  );
  const [activeKey, setActiveKey] = useState(FEATURE_TABS_META[0].key);
  const [edgeFade, setEdgeFade] = useState({ left: false, right: false });
  const [panelMinHeight, setPanelMinHeight] = useState<number>();
  const [isLgViewport, setIsLgViewport] = useState(false);
  const tabListRef = useRef<HTMLDivElement>(null);
  const panelShellRef = useRef<HTMLDivElement>(null);
  const tabButtonRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const measurePanelRefs = useRef<Map<string, HTMLDivElement>>(new Map());
  const activeTab =
    FEATURE_TABS.find((tab) => tab.key === activeKey) ?? FEATURE_TABS[0];

  const measurePanelHeights = useCallback(() => {
    if (!isLgViewport) {
      setPanelMinHeight(undefined);
      return;
    }

    const activePanel = measurePanelRefs.current.get(activeKey);
    if (activePanel && activePanel.offsetHeight > 0) {
      setPanelMinHeight(Math.ceil(activePanel.offsetHeight));
    }
  }, [isLgViewport, activeKey]);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 1024px)");

    const syncViewport = () => {
      setIsLgViewport(mql.matches);
    };

    syncViewport();
    mql.addEventListener("change", syncViewport);

    return () => mql.removeEventListener("change", syncViewport);
  }, []);

  useLayoutEffect(() => {
    measurePanelHeights();
  }, [measurePanelHeights]);

  useEffect(() => {
    const shell = panelShellRef.current;
    if (!shell) return;

    const resizeObserver = new ResizeObserver(measurePanelHeights);
    resizeObserver.observe(shell);

    measurePanelRefs.current.forEach((panel) => {
      resizeObserver.observe(panel);
    });

    document.fonts?.ready.then(measurePanelHeights);

    return () => resizeObserver.disconnect();
  }, [measurePanelHeights]);

  const updateEdgeFade = useCallback(() => {
    const el = tabListRef.current;
    if (!el) return;

    const maxScroll = el.scrollWidth - el.clientWidth;
    if (maxScroll <= 1) {
      setEdgeFade({ left: false, right: false });
      return;
    }

    const tolerance = 4;
    setEdgeFade({
      left: el.scrollLeft > tolerance,
      right: el.scrollLeft < maxScroll - tolerance,
    });
  }, []);

  const scrollActiveTabIntoView = useCallback(
    (key: string, behavior: ScrollBehavior = "smooth") => {
      const list = tabListRef.current;
      const button = tabButtonRefs.current.get(key);
      if (!list || !button) return;

      const listRect = list.getBoundingClientRect();
      const buttonRect = button.getBoundingClientRect();
      const delta =
        buttonRect.left +
        buttonRect.width / 2 -
        (listRect.left + listRect.width / 2);

      if (Math.abs(delta) < 1) {
        updateEdgeFade();
        return;
      }

      list.scrollBy({ left: delta, behavior });

      if (behavior === "smooth") {
        window.setTimeout(updateEdgeFade, 320);
      } else {
        updateEdgeFade();
      }
    },
    [updateEdgeFade],
  );

  useEffect(() => {
    const el = tabListRef.current;
    if (!el) return;

    updateEdgeFade();

    el.addEventListener("scroll", updateEdgeFade, { passive: true });
    const resizeObserver = new ResizeObserver(updateEdgeFade);
    resizeObserver.observe(el);

    return () => {
      el.removeEventListener("scroll", updateEdgeFade);
      resizeObserver.disconnect();
    };
  }, [updateEdgeFade]);

  useEffect(() => {
    scrollActiveTabIntoView(activeKey);
  }, [activeKey, scrollActiveTabIntoView]);

  return (
    <section
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)] pb-[clamp(3rem,6vw,5rem)]",
      )}
    >
      <div className="grid w-full grid-cols-1 gap-10 lg:grid-cols-[minmax(0,19rem)_1fr] lg:gap-14">
        <Reveal className="flex flex-col gap-3.5">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            {t("eyebrow")}
          </span>
          <h2
            className={cn(
              "text-balance font-heading font-bold text-foreground",
              "text-[clamp(1.625rem,1.15rem+1.6vw,2.25rem)]",
              "leading-[1.14] tracking-[-0.02em]",
            )}
          >
            {t("headingPart1")}{" "}
            <span className="text-heading-accent">{t("headingEmphasis")}</span>
          </h2>
          <p className="text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
            {t("descPart1")}{" "}
            <span className="text-copy-emphasis">{t("descEmphasis1")}</span>.{" "}
            {t("descPart2")}{" "}
            <span className="text-copy-mark">{t("descEmphasis2")}</span>.
          </p>
          <span className="font-mono text-[0.8125rem] text-muted-foreground/70">
            {t("statsLabel", { categories: FEATURE_TABS_META.length, features: TOTAL_FEATURE_COUNT })}
          </span>
        </Reveal>

        <Reveal delay={0.05} className="flex min-w-0 flex-col gap-4">
          <div
            className={cn(
              "relative",
              "max-sm:-mx-[clamp(1rem,3.25vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
            )}
          >
            <div
              ref={tabListRef}
              role="tablist"
              aria-label={t("tablistLabel")}
              style={tabListMaskStyle(edgeFade)}
              className={cn(
                "flex flex-nowrap gap-2 overflow-x-auto overscroll-x-contain touch-pan-x pb-0.5",
                "transition-[mask-image,-webkit-mask-image] duration-300",
                "[scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden",
              )}
            >
              {FEATURE_TABS.map((tab) => {
                const isActive = tab.key === activeKey;
                return (
                  <button
                    key={tab.key}
                    ref={(node) => {
                      if (node) tabButtonRefs.current.set(tab.key, node);
                      else tabButtonRefs.current.delete(tab.key);
                    }}
                    id={`what-you-get-tab-${tab.key}`}
                    aria-controls={`what-you-get-panel-${tab.key}`}
                    type="button"
                    role="tab"
                    aria-selected={isActive}
                    onClick={(event) => {
                      setActiveKey(tab.key);
                      event.currentTarget.focus({ preventScroll: true });
                    }}
                    style={
                      isActive ? { backgroundColor: tab.accent } : undefined
                    }
                    className={cn(
                      "inline-flex shrink-0 scroll-mx-4 items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[0.8125rem] font-medium whitespace-nowrap transition-all duration-200",
                      isActive
                        ? "text-white shadow-sm"
                        : "border border-border/70 bg-card text-muted-foreground hover:border-border hover:text-foreground",
                    )}
                  >
                    <tab.icon className="size-3.5" strokeWidth={2} />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          <div
            ref={panelShellRef}
            className="relative transition-[min-height] duration-300 ease-out"
            style={isLgViewport && panelMinHeight ? { minHeight: panelMinHeight } : undefined}
          >
            <div aria-hidden className="pointer-events-none invisible absolute inset-x-0 top-0 -z-10">
              {FEATURE_TABS.map((tab) => (
                <div
                  key={tab.key}
                  ref={(node) => {
                    if (node) measurePanelRefs.current.set(tab.key, node);
                    else measurePanelRefs.current.delete(tab.key);
                  }}
                  className="absolute inset-x-0 top-0"
                >
                  <TabPanelCard tab={tab} />
                </div>
              ))}
            </div>

            <AnimatePresence mode="wait" initial={false}>
              <TabPanel key={activeTab.key} tab={activeTab} fillHeight={isLgViewport} />
            </AnimatePresence>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
