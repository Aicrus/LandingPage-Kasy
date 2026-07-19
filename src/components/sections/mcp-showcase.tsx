"use client";

import Image from "next/image";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";
import { motion, useReducedMotion } from "@/lib/motion";
import { surfaceBorderClass } from "@/lib/surface-border";
import { cn } from "@/lib/utils";

const IDE_LOGOS = [
  {
    src: "/assets/ide-logos/antigravity.png",
    alt: "Antigravity",
    rotate: -7,
    bg: "#ffffff",
    fit: "contain" as const,
  },
  {
    src: "/assets/ide-logos/claude.webp",
    alt: "Claude",
    rotate: 5,
    boost: true,
  },
  {
    src: "/assets/ide-logos/cursor-light.svg",
    alt: "Cursor",
    rotate: -4,
    bg: "#ffffff",
    fit: "contain" as const,
  },
  {
    src: "/assets/ide-logos/openai-icon.svg",
    alt: "OpenAI",
    rotate: 8,
    boost: true,
  },
] as const;

const PROMPT_KEYS = ["prepare", "create", "screen"] as const;
const TOOL_KEYS = [
  "prepare_machine",
  "create_project",
  "list_features",
  "add_feature",
  "list_components",
  "check_status",
  "update_project",
  "run_kasy_command",
] as const;

const iconHoverSpring = {
  type: "spring" as const,
  stiffness: 420,
  damping: 22,
  mass: 0.55,
};

const CARD_SHADOW = cn(
  "shadow-[0_1px_2px_rgba(4,43,89,0.04),0_12px_36px_-14px_rgba(4,43,89,0.16)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.12),0_18px_48px_-18px_rgba(0,0,0,0.55)]",
);

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
      width={72}
      height={72}
      className={`${sizeClass} ${objectClass}`}
      draggable={false}
    />
  );
}

function FloatingIdeLogos() {
  const reducedMotion = useReducedMotion();

  return (
    <div className="flex items-center justify-center" aria-hidden>
      {IDE_LOGOS.map((logo, index) => (
        <motion.span
          key={logo.src}
          className={cn(
            "relative flex size-11 shrink-0 overflow-hidden rounded-[0.7rem] border border-solid will-change-transform sm:size-12 sm:rounded-[0.8rem]",
            surfaceBorderClass,
            "shadow-[0_8px_24px_-10px_rgba(4,43,89,0.28)] dark:shadow-[0_10px_28px_-10px_rgba(0,0,0,0.55)]",
          )}
          style={{
            zIndex: index + 1,
            marginLeft: index === 0 ? 0 : "-0.7rem",
            rotate: `${logo.rotate}deg`,
            backgroundColor: "bg" in logo ? logo.bg : "#fff",
            y: index % 2 === 0 ? -6 : 8,
          }}
          whileHover={
            reducedMotion ? undefined : { scale: 1.14, zIndex: 20, rotate: "0deg", y: 0 }
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
        "inline-flex size-[1.05em] shrink-0 items-center justify-center overflow-hidden rounded-[0.28em] bg-[#0a1220] align-[-0.12em]",
        className,
      )}
    >
      <Image
        src="/assets/mcp-server-solid-sharp-512.webp"
        alt=""
        width={48}
        height={48}
        className="size-[78%] object-contain brightness-0 invert"
        draggable={false}
        aria-hidden
      />
    </span>
  );
}

export function McpShowcase() {
  const t = useTranslations("mcpShowcase");
  const prompts = t.raw("prompts") as Record<
    (typeof PROMPT_KEYS)[number],
    { quote: string; detail: string }
  >;
  const tools = t.raw("tools") as Record<(typeof TOOL_KEYS)[number], string>;

  return (
    <section
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)]",
      )}
    >
      <Reveal className="flex w-full max-w-[42rem] flex-col items-center text-center">
        <span className="mb-5 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          <McpMark className="size-4 rounded-[0.3rem]" />
          {t("eyebrow")}
        </span>

        <FloatingIdeLogos />

        <p className="mt-5 font-rounded text-[0.8125rem] font-semibold text-muted-foreground sm:text-sm">
          {t("worksWith")}
        </p>

        <h2
          className={cn(
            "mt-6 text-balance font-heading font-bold text-foreground",
            "text-[clamp(1.75rem,1.2rem+2vw,2.75rem)]",
            "leading-[1.12] tracking-[-0.025em]",
          )}
        >
          <span className="block">{t("headingLine1")}</span>
          <span className="block">{t("headingLine2")}</span>
          <span className="mt-1 block text-heading-accent">{t("headingLine3")}</span>
        </h2>

        <p className="mt-5 max-w-[34rem] text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
          {t("subtitle")}
        </p>
      </Reveal>

      <Reveal delay={0.08} className="mt-10 w-full max-w-[34rem] sm:mt-12">
        <div
          className={cn(
            "overflow-hidden rounded-[1.75rem] border border-black/[0.06]",
            "bg-white text-[#0a1220]",
            CARD_SHADOW,
          )}
        >
          <div className="flex items-start justify-between gap-4 border-b border-black/[0.06] px-5 py-4 sm:px-6 sm:py-5">
            <div className="flex min-w-0 items-center gap-3 text-left">
              <McpMark className="size-9 rounded-[0.65rem] sm:size-10" />
              <div className="min-w-0">
                <p className="font-heading text-[0.9375rem] font-bold tracking-[-0.02em] sm:text-base">
                  {t("cardTitle")}
                </p>
                <p className="mt-0.5 text-[0.8125rem] text-[#0a1220]/65">
                  {t("cardSubtitle")}
                </p>
              </div>
            </div>
            <span className="shrink-0 rounded-md bg-emerald-500/10 px-2.5 py-1 font-mono text-[0.6875rem] font-semibold leading-snug text-emerald-700 sm:text-xs">
              {t("cardBadge")}
            </span>
          </div>

          <ul className="divide-y divide-black/[0.06]">
            {PROMPT_KEYS.map((key) => {
              const item = prompts[key];
              return (
                <li
                  key={key}
                  className="flex flex-col gap-1 px-5 py-4 text-left sm:px-6 sm:py-[1.125rem]"
                >
                  <p className="text-pretty font-heading text-[0.9375rem] font-bold tracking-[-0.015em] sm:text-base">
                    “{item.quote}”
                  </p>
                  <p className="text-pretty text-[0.8125rem] leading-snug text-[#0a1220]/62 sm:text-[0.875rem]">
                    {item.detail}
                  </p>
                </li>
              );
            })}
          </ul>

          <div className="border-t border-black/[0.06] bg-[#f4f7fb] px-5 py-4 sm:px-6 sm:py-5">
            <p className="mb-3 text-left text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-[#0a1220]/45">
              {t("toolsLabel")}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {TOOL_KEYS.map((key) => (
                <span
                  key={key}
                  className="rounded-md border border-black/[0.06] bg-white px-2 py-1 font-mono text-[0.6875rem] font-medium text-[#0a1220]/78 sm:text-[0.75rem]"
                >
                  {tools[key]}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
