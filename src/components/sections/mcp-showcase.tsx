"use client";

import { ChevronDown, Mic, Plus } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

import { Reveal } from "@/components/motion/reveal";
import {
  fadeInUp,
  motion,
  staggerContainer,
  useInView,
  useReducedMotion,
} from "@/lib/motion";
import { surfaceBorderClass } from "@/lib/surface-border";
import { cn } from "@/lib/utils";

const IDE_LOGOS = [
  {
    src: "/assets/ide-logos/antigravity.png",
    alt: "Antigravity",
    rotate: -6,
    bg: "#ffffff",
    fit: "contain" as const,
  },
  {
    src: "/assets/ide-logos/claude.webp",
    alt: "Claude",
    rotate: 4,
    boost: true,
  },
  {
    src: "/assets/ide-logos/cursor-light.svg",
    alt: "Cursor",
    rotate: -3,
    bg: "#ffffff",
    fit: "contain" as const,
  },
  {
    src: "/assets/ide-logos/openai-icon.svg",
    alt: "OpenAI",
    rotate: 6,
    boost: true,
  },
] as const;

const DEMO_KEYS = ["prepare", "create", "screen"] as const;

type DemoCopy = { ask: string; reply: string };

const iconHoverSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 22,
  mass: 0.55,
};

const CARD_SHADOW = cn(
  "shadow-[0_1px_2px_rgba(4,43,89,0.04),0_8px_24px_-12px_rgba(4,43,89,0.12)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.12),0_14px_36px_-16px_rgba(0,0,0,0.5)]",
);

const CURSOR_LOGO_SRC = "/assets/ide-logos/cursor-light.svg";

const TYPE_MS = 26;
const PAUSE_AFTER_ASK_MS = 420;
const PAUSE_AFTER_REPLY_MS = 720;

function IdeLogo({
  src,
  alt,
  fit = "cover",
  boost = false,
}: {
  src: string;
  alt: string;
  fit?: "cover" | "contain";
  boost?: boolean;
}) {
  const isSvg = src.endsWith(".svg");
  const objectClass = fit === "contain" ? "object-contain p-0.5" : "object-cover";
  const sizeClass = boost ? "size-full scale-[1.14]" : "size-full";

  if (isSvg) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- SVGs locais, sem pipeline do Image
      <img
        src={src}
        alt={alt}
        className={`${sizeClass} ${objectClass}`}
        draggable={false}
      />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      width={64}
      height={64}
      className={`${sizeClass} ${objectClass}`}
      draggable={false}
    />
  );
}

function IdeLogoRow() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex shrink-0 items-center" aria-hidden>
      {IDE_LOGOS.map((logo, index) => (
        <motion.span
          key={logo.src}
          className={cn(
            "relative flex size-8 shrink-0 overflow-hidden rounded-[0.45rem] border border-solid will-change-transform sm:size-9 sm:rounded-[0.5rem]",
            surfaceBorderClass,
          )}
          style={{
            zIndex: index + 1,
            marginLeft: index === 0 ? 0 : "-0.4rem",
            rotate: `${logo.rotate}deg`,
            backgroundColor: "bg" in logo ? logo.bg : "#fff",
          }}
          whileHover={
            reducedMotion ? undefined : { scale: 1.16, zIndex: 20, rotate: "0deg" }
          }
          transition={iconHoverSpring}
        >
          <IdeLogo
            src={logo.src}
            alt={logo.alt}
            fit={"fit" in logo ? logo.fit : "cover"}
            boost={"boost" in logo ? logo.boost : false}
          />
        </motion.span>
      ))}
    </div>
  );
}

function McpMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex size-[1.05em] shrink-0 items-center justify-center overflow-hidden rounded-[0.28em] bg-[#0a1220]",
        className,
      )}
    >
      <Image
        src="/assets/mcp-server-solid-sharp-512.webp"
        alt=""
        width={40}
        height={40}
        className="size-[78%] object-contain brightness-0 invert"
        draggable={false}
        aria-hidden
      />
    </span>
  );
}

function TypingCursor({ active }: { active: boolean }) {
  if (!active) return null;
  return (
    <span
      className="ml-0.5 inline-block h-[1em] w-[0.08em] translate-y-[0.12em] bg-foreground/70 align-baseline animate-pulse"
      aria-hidden
    />
  );
}

function TypingDots() {
  return (
    <span className="inline-flex items-center gap-1 px-0.5 py-1" aria-hidden>
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 rounded-full bg-foreground/35"
          style={{
            animation: "mcp-chat-dot 1.05s ease-in-out infinite",
            animationDelay: `${i * 0.16}s`,
          }}
        />
      ))}
    </span>
  );
}

function ComposerToolbar({ modelLabel }: { modelLabel: string }) {
  return (
    <div className="flex items-center justify-between border-t border-border/70 pt-3">
      <div className="flex items-center gap-2.5">
        <span className="flex size-6 items-center justify-center rounded-full border border-border/70 text-muted-foreground">
          <Plus className="size-3" strokeWidth={2.25} />
        </span>
        <span className="flex items-center gap-1 text-[0.75rem] font-medium text-muted-foreground">
          {modelLabel}
          <ChevronDown className="size-3 opacity-60" strokeWidth={2.25} />
        </span>
      </div>
      <div className="flex items-center gap-2">
        <Mic className="size-4 text-muted-foreground/60" strokeWidth={2} />
        <span className="flex size-6 items-center justify-center rounded-full bg-foreground text-background">
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="size-2.5"
            fill="currentColor"
          >
            <path d="M8 3.5 12.5 8 8 12.5 6.9 11.4 9.8 8.5H3.5V7.5h6.3L6.9 4.6 8 3.5Z" />
          </svg>
        </span>
      </div>
    </div>
  );
}

function McpAvatar({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-full bg-foreground",
        className,
      )}
    >
      <Image
        src="/assets/mcp-server-solid-sharp-512.webp"
        alt=""
        width={24}
        height={24}
        className="size-[70%] object-contain brightness-0 invert dark:invert-0 dark:brightness-0 dark:invert"
        draggable={false}
        aria-hidden
      />
    </span>
  );
}

function CursorMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-6 shrink-0 items-center justify-center overflow-hidden rounded-[0.4rem] border border-border/70 bg-white",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- SVG local do mock IDE */}
      <img
        src={CURSOR_LOGO_SRC}
        alt=""
        className="size-[70%] object-contain"
        draggable={false}
        aria-hidden
      />
    </span>
  );
}

function useChatDemo(
  demos: DemoCopy[],
  active: boolean,
  reducedMotion: boolean,
) {
  const [step, setStep] = useState(0);
  const [askText, setAskText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [doneCount, setDoneCount] = useState(0);
  const [isThinking, setIsThinking] = useState(false);
  const timers = useRef<number[]>([]);
  const demosKey = demos.map((d) => `${d.ask}|${d.reply}`).join("::");

  const clearTimers = () => {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
  };

  useEffect(() => {
    clearTimers();
    setStep(0);
    setAskText("");
    setReplyText("");
    setDoneCount(0);
    setIsThinking(false);

    if (!active) return;

    if (reducedMotion) {
      setDoneCount(demos.length);
      setStep(demos.length * 2);
      return;
    }

    let cancelled = false;
    const schedule = (fn: () => void, ms: number) => {
      const id = window.setTimeout(() => {
        if (!cancelled) fn();
      }, ms);
      timers.current.push(id);
    };

    const typeString = (
      full: string,
      onTick: (value: string) => void,
      onDone: () => void,
    ) => {
      let i = 0;
      const tick = () => {
        if (cancelled) return;
        i += 1;
        onTick(full.slice(0, i));
        if (i >= full.length) {
          onDone();
          return;
        }
        schedule(tick, TYPE_MS);
      };
      schedule(tick, TYPE_MS);
    };

    const runExchange = (index: number) => {
      if (index >= demos.length) return;
      const demo = demos[index];
      setStep(index * 2);
      setAskText("");
      setReplyText("");
      setIsThinking(false);

      typeString(demo.ask, setAskText, () => {
        setIsThinking(true);
        schedule(() => {
          setIsThinking(false);
          setStep(index * 2 + 1);
          setAskText("");
          typeString(demo.reply, setReplyText, () => {
            schedule(() => {
              setDoneCount(index + 1);
              setReplyText("");
              runExchange(index + 1);
            }, PAUSE_AFTER_REPLY_MS);
          });
        }, PAUSE_AFTER_ASK_MS);
      });
    };

    runExchange(0);

    return () => {
      cancelled = true;
      clearTimers();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- demosKey
  }, [active, reducedMotion, demosKey]);

  return { step, askText, replyText, doneCount, isThinking };
}

function McpChatCard({
  demos,
  composerPlaceholder,
  youLabel,
  mcpLabel,
  cursorLabel,
  modelLabel,
}: {
  demos: DemoCopy[];
  composerPlaceholder: string;
  youLabel: string;
  mcpLabel: string;
  cursorLabel: string;
  modelLabel: string;
}) {
  const reducedMotion = useReducedMotion() ?? false;
  const cardRef = useRef<HTMLDivElement>(null);
  const threadRef = useRef<HTMLDivElement>(null);
  const inView = useInView(cardRef, { once: true, margin: "-12% 0px" });
  const { step, askText, replyText, doneCount, isThinking } = useChatDemo(
    demos,
    inView,
    reducedMotion,
  );

  const activeIndex = Math.min(Math.floor(step / 2), demos.length - 1);
  const typingAsk = step % 2 === 0 && doneCount < demos.length && !isThinking;
  const typingReply = step % 2 === 1 && doneCount < demos.length;
  const composerValue = typingAsk ? askText : "";

  useEffect(() => {
    const el = threadRef.current;
    if (!el) return;
    el.scrollTop = el.scrollHeight;
  }, [doneCount, askText, replyText, isThinking, step]);

  return (
    <div
      ref={cardRef}
      className={cn(
        "flex h-[26.5rem] flex-col overflow-hidden rounded-[1.25rem] border border-border/70 bg-card sm:h-[28.5rem]",
        CARD_SHADOW,
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-border/70 px-4 py-2.5">
        <CursorMark />
        <div className="min-w-0">
          <p className="text-[0.8125rem] font-semibold tracking-[-0.01em] text-foreground">
            {cursorLabel}
          </p>
          <p className="text-[0.6875rem] text-muted-foreground">{mcpLabel}</p>
        </div>
      </div>

      <div
        ref={threadRef}
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4 py-4"
      >
        {demos.map((demo, index) => {
          const isComplete = index < doneCount || reducedMotion;
          const isActive =
            !reducedMotion && index === activeIndex && doneCount < demos.length;
          const showAskInThread =
            isComplete || (isActive && (isThinking || typingReply));
          const showThinking = isActive && isThinking;
          const showReply =
            isComplete || (isActive && (typingReply || replyText.length > 0));
          const replyDisplay = isComplete
            ? demo.reply
            : isActive
              ? replyText
              : "";

          if (!showAskInThread && !showThinking && !showReply) return null;

          return (
            <div key={demo.ask} className="flex flex-col gap-3">
              {showAskInThread ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[0.6875rem] font-medium text-muted-foreground">
                    {youLabel}
                  </span>
                  <p className="text-pretty text-[0.875rem] leading-snug text-foreground sm:text-[0.9375rem]">
                    {demo.ask}
                  </p>
                </div>
              ) : null}

              {showThinking ? (
                <div className="flex items-start gap-2.5">
                  <McpAvatar className="mt-0.5" />
                  <div className="rounded-xl border border-border/70 bg-muted px-3 py-2">
                    <TypingDots />
                  </div>
                </div>
              ) : null}

              {showReply ? (
                <div className="flex items-start gap-2.5">
                  <McpAvatar className="mt-0.5" />
                  <div className="min-w-0 flex-1">
                    <span className="mb-1 block text-[0.6875rem] font-medium text-muted-foreground">
                      {mcpLabel}
                    </span>
                    <p className="text-pretty text-[0.875rem] leading-snug text-foreground sm:text-[0.9375rem]">
                      {replyDisplay}
                      <TypingCursor active={isActive && typingReply} />
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="shrink-0 px-3 pb-3 sm:px-4 sm:pb-4">
        <div className="flex flex-col rounded-[0.85rem] border border-border/70 bg-background px-3.5 py-3">
          <p
            className={cn(
              "min-h-[3.25rem] text-[0.875rem] leading-snug sm:text-[0.9375rem]",
              composerValue ? "text-foreground" : "text-muted-foreground/55",
            )}
          >
            {composerValue || composerPlaceholder}
            <TypingCursor active={typingAsk} />
          </p>
          <ComposerToolbar modelLabel={modelLabel} />
        </div>
      </div>
    </div>
  );
}

export function McpShowcase() {
  const t = useTranslations("mcpShowcase");
  const demosRaw = t.raw("demos") as Record<(typeof DEMO_KEYS)[number], DemoCopy>;
  const demos = DEMO_KEYS.map((key) => demosRaw[key]);

  return (
    <section
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)] pb-[clamp(3rem,6vw,5rem)]",
      )}
    >
      <Reveal
        variants={staggerContainer}
        className="grid w-full grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-14"
      >
        <motion.div
          variants={fadeInUp}
          className="order-2 min-w-0 w-full lg:order-1"
        >
          <McpChatCard
            demos={demos}
            composerPlaceholder={t("composerPlaceholder")}
            youLabel={t("youLabel")}
            mcpLabel={t("mcpLabel")}
            cursorLabel={t("cursorLabel")}
            modelLabel={t("modelLabel")}
          />
        </motion.div>

        <motion.div
          variants={fadeInUp}
          className="order-1 flex flex-col gap-3.5 lg:order-2 lg:max-w-[28rem] lg:justify-self-end"
        >
          <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
            <McpMark className="size-4 rounded-[0.3rem]" />
            {t("eyebrow")}
          </span>

          <div className="flex flex-wrap items-center gap-3">
            <IdeLogoRow />
            <p className="font-rounded text-[0.8125rem] font-semibold text-muted-foreground sm:text-sm">
              {t("worksWith")}
            </p>
          </div>

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
            {t("subtitle")}
          </p>

          <span className="font-mono text-[0.8125rem] text-muted-foreground/70">
            {t("moreTools")}
          </span>
        </motion.div>
      </Reveal>
    </section>
  );
}
