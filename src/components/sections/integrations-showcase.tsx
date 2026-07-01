"use client";

import {
  Braces,
  Cat,
  FileSpreadsheet,
  Flame,
  Grid2x2,
  Plug,
  Send,
  Sparkle,
  Sparkles,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { motion, staggerContainer, type Variants } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Integration = {
  name: string;
  Icon: LucideIcon;
  /** Cor de marca — `null` usa o tom neutro do texto (ex.: OpenAI). */
  color: string | null;
};

const CORE_INTEGRATIONS: Integration[] = [
  { name: "Supabase", Icon: Zap, color: "#3ecf8e" },
  { name: "RevenueCat", Icon: Cat, color: "#f6533f" },
  { name: "Firebase", Icon: Flame, color: "#f5820b" },
  { name: "API", Icon: Plug, color: "#38bdf8" },
];

const EXTRA_INTEGRATIONS: Integration[] = [
  { name: "Gemini", Icon: Sparkles, color: "#8b5cf6" },
  { name: "Airtable", Icon: Grid2x2, color: "#fcb400" },
  { name: "Open AI", Icon: Sparkle, color: null },
  { name: "Postman", Icon: Send, color: "#ff6c37" },
  { name: "Swagger", Icon: Braces, color: "#85ea2d" },
  { name: "Xano", Icon: X, color: "#2f6feb" },
  { name: "Google Sheet", Icon: FileSpreadsheet, color: "#22a565" },
];

const badgeVariant: Variants = {
  hidden: { opacity: 0, y: 14, scale: 0.92 },
  visible: { opacity: 1, y: 0, scale: 1 },
};

function IntegrationBadge({
  integration,
  size = "md",
}: {
  integration: Integration;
  size?: "md" | "sm";
}) {
  const { name, Icon, color } = integration;
  const glow = color ?? "var(--foreground)";

  return (
    <motion.span
      variants={badgeVariant}
      transition={{ type: "tween", duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{ "--integration-glow": glow } as React.CSSProperties}
      className={cn(
        "group inline-flex select-none items-center rounded-full",
        "border border-border/70 bg-card",
        "shadow-[0_1px_2px_rgba(26,30,44,0.04),0_6px_16px_-10px_rgba(26,30,44,0.12)]",
        "dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_20px_-10px_rgba(0,0,0,0.4)]",
        "transition-[transform,box-shadow,border-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
        "hover:-translate-y-0.5 hover:border-[color-mix(in_srgb,var(--integration-glow)_45%,var(--border))]",
        "hover:shadow-[0_0_0_1px_color-mix(in_srgb,var(--integration-glow)_35%,transparent),0_10px_26px_-10px_color-mix(in_srgb,var(--integration-glow)_55%,transparent)]",
        size === "md"
          ? "gap-2.5 px-[1.05rem] py-[0.7rem]"
          : "gap-2 px-[0.9rem] py-[0.6rem]",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full",
          "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110",
          size === "md" ? "size-7" : "size-6",
        )}
        style={{
          backgroundColor:
            "color-mix(in srgb, var(--integration-glow) 16%, transparent)",
        }}
      >
        <Icon
          strokeWidth={2}
          className={size === "md" ? "size-4" : "size-3.5"}
          style={{ color: glow }}
        />
      </span>
      <span
        className={cn(
          "whitespace-nowrap font-medium text-foreground",
          size === "md" ? "text-[0.95rem]" : "text-[0.85rem]",
        )}
      >
        {name}
      </span>
    </motion.span>
  );
}

export function IntegrationsShowcase() {
  return (
    <section
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)] pb-[clamp(3rem,6vw,5rem)]",
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden",
          "rounded-[1.875rem] sm:rounded-[2rem]",
          "bg-feature-shell",
          "px-[clamp(1.25rem,4vw,3.5rem)] py-[clamp(2.5rem,6vw,4rem)]",
        )}
      >
        <div
          aria-hidden
          className={cn(
            "pointer-events-none absolute left-1/2 top-0 -z-0 h-[22rem] w-[46rem] -translate-x-1/2 -translate-y-1/2",
            "rounded-full bg-[radial-gradient(closest-side,color-mix(in_srgb,var(--primary)_16%,transparent),transparent)]",
            "blur-2xl",
          )}
        />

        <Reveal
          className={cn(
            "relative flex w-full flex-col items-center text-center",
            "gap-[clamp(0.75rem,1vw+0.25rem,1.125rem)]",
            "mb-[clamp(2rem,4vw,3rem)]",
          )}
        >
          <h2
            className={cn(
              "text-balance font-heading font-bold text-foreground",
              "text-[clamp(1.625rem,1.15rem+1.6vw,2.5rem)]",
              "leading-[1.12] tracking-[-0.02em]",
            )}
          >
            Conecte a qualquer fonte de dados
          </h2>
          <p className="max-w-fluid-subtitle text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
            Supabase, Firebase, APIs próprias ou qualquer serviço com API,
            como OpenAI, Gemini, Airtable, Google Sheets e Xano. Importe do
            Swagger ou Postman com um clique. Gerencie tudo visualmente ou
            com IA.
          </p>
        </Reveal>

        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="relative flex w-full flex-col items-center gap-3 sm:gap-3.5"
        >
          <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            {CORE_INTEGRATIONS.map((integration) => (
              <IntegrationBadge key={integration.name} integration={integration} />
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-2.5">
            {EXTRA_INTEGRATIONS.map((integration) => (
              <IntegrationBadge
                key={integration.name}
                integration={integration}
                size="sm"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
