"use client";

import Image from "next/image";
import {
  Camera,
  ChevronDown,
  Layers2,
  Mic,
  Moon,
  Plus,
  Smartphone,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const PHONE_SRC = "/assets/phone-command.png";
const PHONE_WIDTH = 1300;
const PHONE_HEIGHT = 2642;

const ACTION_PILLS = [
  "Plan New Idea ⇥Tab",
  "Multitask",
  "Run in Cloud",
  "Design Mode",
] as const;

function WindowDots() {
  return (
    <div className="flex shrink-0 items-center gap-[0.35em]">
      <span className="size-[0.55em] rounded-full bg-[#ff5f57]" />
      <span className="size-[0.55em] rounded-full bg-[#febc2e]" />
      <span className="size-[0.55em] rounded-full bg-[#28c840]" />
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-black/[0.07] bg-white px-[0.9em] py-[0.35em] text-[0.58em] font-medium text-foreground/80 shadow-[0_1px_2px_rgba(26,30,44,0.04)] dark:border-white/[0.09] dark:bg-[#1c1f29] dark:text-foreground/85 dark:shadow-none">
      {children}
    </span>
  );
}

function ToolbarDivider() {
  return <span aria-hidden className="mx-[0.1em] h-[1.15em] w-px bg-black/[0.1] dark:bg-white/[0.12]" />;
}

function InspectToolIcon() {
  return (
    <svg aria-hidden viewBox="0 0 16 16" className="size-[0.72em]" fill="none">
      <rect
        x="2.5"
        y="2.5"
        width="7.5"
        height="7.5"
        rx="1"
        stroke="white"
        strokeWidth="1.2"
        strokeDasharray="1.6 1.4"
      />
      <path
        d="M8.8 8.8 12.8 12.8"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M11.2 12.8h1.6v-1.6"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function DeviceToolbar() {
  return (
    <div
      aria-hidden
      className="inline-flex h-[2.15em] max-w-full items-center rounded-full border border-black/[0.07] bg-white px-[0.45em] text-[#1c1c1e] shadow-[0_2px_12px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)] dark:border-white/[0.1] dark:bg-[#f4f5f8] dark:text-[#10131a]"
    >
      <span className="flex items-center gap-[0.2em] px-[0.5em] text-[0.62em] font-medium">
        iOS
        <ChevronDown className="size-[0.75em] opacity-70" strokeWidth={2.25} />
      </span>

      <ToolbarDivider />

      <span className="px-[0.55em] text-[0.62em] font-medium">iPhone 16</span>

      <ToolbarDivider />

      <span className="flex items-center gap-[0.45em] px-[0.4em] text-[#3a3a3c]">
        <Smartphone className="size-[0.9em]" strokeWidth={1.9} />
        <Moon className="size-[0.9em]" strokeWidth={1.9} />
        <Camera className="size-[0.9em]" strokeWidth={1.9} />
      </span>

      <span className="mx-[0.2em] flex size-[1.55em] shrink-0 items-center justify-center rounded-[0.32em] bg-[#0a84ff]">
        <InspectToolIcon />
      </span>

      <Layers2 className="mx-[0.15em] size-[0.9em] text-[#3a3a3c]" strokeWidth={1.9} />

      <ToolbarDivider />

      <span className="flex items-baseline gap-[0.08em] px-[0.45em] font-medium leading-none text-[#3a3a3c]">
        <span className="text-[0.58em]">r</span>
        <span className="text-[0.72em]">R</span>
      </span>

      <ToolbarDivider />

      <X className="mx-[0.35em] size-[0.88em] text-[#3a3a3c]" strokeWidth={2} />
    </div>
  );
}

function ComposerToolbar() {
  return (
    <div className="flex items-center justify-between border-t border-black/[0.05] pt-[0.9em] dark:border-white/[0.07]">
      <div className="flex items-center gap-[0.55em]">
        <span className="flex size-[1.45em] items-center justify-center rounded-full border border-black/[0.08] text-foreground/70 dark:border-white/[0.1] dark:text-foreground/80">
          <Plus className="size-[0.7em]" strokeWidth={2.25} />
        </span>
        <span className="flex items-center gap-[0.25em] text-[0.58em] font-medium text-foreground/75">
          Composer 2.5
          <ChevronDown className="size-[0.75em] opacity-60" strokeWidth={2.25} />
        </span>
      </div>
      <div className="flex items-center gap-[0.45em]">
        <Mic className="size-[0.95em] text-foreground/45" strokeWidth={2} />
        <span className="flex size-[1.55em] items-center justify-center rounded-full bg-foreground text-background dark:bg-[#eceef6] dark:text-[#10131a]">
          <svg
            aria-hidden
            viewBox="0 0 16 16"
            className="size-[0.62em]"
            fill="currentColor"
          >
            <path d="M8 3.5 12.5 8 8 12.5 6.9 11.4 9.8 8.5H3.5V7.5h6.3L6.9 4.6 8 3.5Z" />
          </svg>
        </span>
      </div>
    </div>
  );
}

export function HeroWorkspaceMock() {
  return (
    <div className="flex aspect-[2940/1680] w-full select-none text-[clamp(0.56rem,0.38rem+0.48vw,0.82rem)]">
      {/* Painel esquerdo — Composer */}
      <div className="flex min-w-0 flex-[1.74] flex-col bg-[#ecedf2] px-[3.8%] pb-[3%] pt-[2.8%] dark:bg-[#0f1117]">
        <div className="mb-[3.5%] flex items-center gap-[0.35em] text-[0.54em] text-[#8b93a7] dark:text-[#6f7890]">
          <span className="font-medium text-[#5f677a] dark:text-[#9aa3b8]">kasy</span>
          <span aria-hidden className="opacity-70">
            ›
          </span>
          <span>main</span>
          <span aria-hidden className="opacity-70">
            ›
          </span>
          <span>Local</span>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <div
            className={cn(
              "flex min-h-[58%] flex-col rounded-[1.35em] border border-black/[0.06] bg-white px-[4.8%] py-[4.2%] shadow-[0_1px_3px_rgba(26,30,44,0.05),0_10px_30px_-16px_rgba(26,30,44,0.12)]",
              "dark:border-white/[0.07] dark:bg-[#171a23] dark:shadow-[0_12px_40px_-24px_rgba(0,0,0,0.65)]",
            )}
          >
            <div className="flex-1">
              <p className="text-[0.74em] leading-[1.55] text-[#2a3040] dark:text-[#d8dcea]">
                Edite isso: Edit this exact widget (Flutter debug inspector):
              </p>
              <p className="mt-[0.55em] font-mono text-[0.66em] leading-[1.6] text-[#4d5568] dark:text-[#a8b0c4]">
                Widget:{" "}
                <span className="text-[#4a5270] dark:text-[#8ba4e8]">`KasyCard`</span>{" "}
                &quot;Elena Park&quot; Screen:{" "}
                <span className="text-[#4a5270] dark:text-[#8ba4e8]">`HomePage`</span>{" "}
                -&gt;{" "}
                <span className="text-[#4a5270] dark:text-[#8ba4e8]">
                  `lib/features/home/home_page.dart`
                </span>
              </p>
            </div>

            <ComposerToolbar />
          </div>

          <div className="mt-[1.1em] flex flex-wrap gap-[0.45em]">
            {ACTION_PILLS.map((label) => (
              <Pill key={label}>{label}</Pill>
            ))}
          </div>
        </div>

        <p className="mt-[2.2%] text-[0.54em] leading-relaxed text-[#8b93a7] dark:text-[#6f7890]">
          Use{" "}
          <span className="font-mono text-[#6d758a] dark:text-[#9aa3b8]">
            /create-subagent
          </span>{" "}
          to set up specialized agents that Cursor can use to parallelize work.
        </p>
      </div>

      {/* Painel direito — emulador + celular (única imagem) */}
      <div className="relative flex w-[36.5%] shrink-0 flex-col border-l border-black/[0.05] bg-[#fbfbfc] dark:border-white/[0.06] dark:bg-[#12151c]">
        <div className="flex items-center gap-[0.55em] border-b border-black/[0.05] px-[3.5%] py-[1.35em] dark:border-white/[0.06]">
          <WindowDots />
          <div className="flex min-w-0 flex-1 items-center overflow-hidden rounded-[0.45em] border border-black/[0.06] bg-white dark:border-white/[0.08] dark:bg-[#1a1d27]">
            <span className="shrink-0 border-r border-black/[0.05] px-[0.65em] py-[0.3em] text-[0.5em] text-[#6d758a] dark:border-white/[0.07] dark:text-[#8b93a7]">
              kasy run — web
            </span>
            <span className="min-w-0 flex-1 truncate px-[0.65em] py-[0.3em] font-mono text-[0.5em] text-[#8b93a7] dark:text-[#7d869c]">
              http://localhost:5555
            </span>
          </div>
        </div>

        <div className="flex justify-center px-[3.5%] py-[0.85em]">
          <DeviceToolbar />
        </div>

        <div className="relative flex flex-1 items-start justify-center px-[4%] pb-[2%] pt-[0.5%]">
          <div className="relative w-[78%] max-w-[272px]">
            <span className="pointer-events-none absolute -right-[0.35em] top-[1.8em] z-[2] rotate-45 bg-[#e5484d] px-[1.1em] py-[0.12em] text-[0.42em] font-bold tracking-[0.08em] text-white shadow-sm">
              DEBUG
            </span>
            <Image
              src={PHONE_SRC}
              alt="Interface mobile do Clonk — controle remoto dos agentes"
              width={PHONE_WIDTH}
              height={PHONE_HEIGHT}
              className="h-auto w-full drop-shadow-[0_20px_36px_rgba(0,0,0,0.16)] dark:drop-shadow-[0_20px_36px_rgba(0,0,0,0.45)]"
              priority
              unoptimized
              draggable={false}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
