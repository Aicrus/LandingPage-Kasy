"use client";

import Image from "next/image";
import {
  Camera,
  ChevronDown,
  ChevronRight,
  Layers2,
  Mic,
  Moon,
  Plus,
  Smartphone,
  SquareDashedMousePointer,
  X,
} from "lucide-react";
import type { ReactNode } from "react";
import { useId, useState } from "react";

import { ExplorerFileIcon, ExplorerFolderIcon } from "@/components/sections/explorer-icons";
import { cn } from "@/lib/utils";

const PHONE_SRC = "/assets/phone-command.png";
const PHONE_WIDTH = 1300;
const PHONE_HEIGHT = 2642;
const CURSOR_LOGO_SRC = "/assets/ide-logos/cursor-light.svg";

const editorSurfaceClass = "bg-white dark:bg-[#13120a]";
const chromeBarSurfaceClass = "bg-white dark:bg-[#1b1912]";
const toolbarSurfaceClass = "bg-[#f7f7f8] dark:bg-[#1b1912]";
const editorFontClass =
  "font-[system-ui,-apple-system,BlinkMacSystemFont,'Segoe_UI',Helvetica,Arial,sans-serif]";
const editorLineClass = "border-black/[0.07] dark:border-[#292821]";
const editorDividerClass = "bg-black/[0.1] dark:bg-[#292821]";

/** Escala tipográfica do mock — relativa ao root clamp do editor */
const editorType = {
  caption: "text-[0.625em] leading-tight",
  ui: "text-[0.6875em] leading-snug",
  body: "text-[0.75em] leading-[1.5]",
} as const;

/** Tipografia do explorer — levemente maior que o restante do mock */
const explorerType = "text-[0.78em] leading-snug";

/** Tipografia da barra superior do mock */
const chromeHeaderType = "text-[0.82em] leading-snug";

const chromeBarClass = "px-[0.75em] py-[0.55em]";

const ACTION_PILLS = [
  "Plan New Idea ⇥Tab",
  "Multitask",
  "Run in Cloud",
  "Design Mode",
] as const;

type TreeNode = {
  name: string;
  open?: boolean;
  active?: boolean;
  children?: TreeNode[];
};

const PROJECT_TREE: TreeNode[] = [
  {
    name: "flutter_app",
    open: true,
    children: [
      { name: ".dart_tool" },
      { name: "android" },
      { name: "ios" },
      { name: "assets" },
      {
        name: "lib",
        open: true,
        children: [
          { name: "main.dart" },
          {
            name: "core",
            children: [{ name: "theme.dart" }, { name: "router.dart" }],
          },
          {
            name: "features",
            open: true,
            children: [
              {
                name: "home",
                open: true,
                children: [
                  { name: "home_page.dart", active: true },
                  {
                    name: "widgets",
                    open: true,
                    children: [{ name: "product_card.dart" }],
                  },
                ],
              },
              { name: "auth" },
              { name: "profile" },
            ],
          },
          { name: "shared" },
        ],
      },
      { name: "test" },
      { name: "pubspec.yaml" },
      { name: "analysis_options.yaml" },
    ],
  },
];

function WindowDots() {
  return (
    <div className="flex shrink-0 items-center gap-[0.42em]">
      <span className="size-[0.72em] rounded-full bg-[#ff5f57]" />
      <span className="size-[0.72em] rounded-full bg-[#febc2e]" />
      <span className="size-[0.72em] rounded-full bg-[#28c840]" />
    </div>
  );
}

function Pill({ children }: { children: ReactNode }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border bg-white px-[0.9em] py-[0.35em] font-medium text-foreground/80 shadow-[0_1px_2px_rgba(26,30,44,0.04)] dark:bg-[#1c1f29] dark:text-foreground/85 dark:shadow-none",
        editorLineClass,
        editorType.ui,
      )}
    >
      {children}
    </span>
  );
}

function ToolbarDivider() {
  return (
    <span
      aria-hidden
      className={cn("mx-[0.1em] h-[1.15em] w-px", editorDividerClass)}
    />
  );
}

function ToolbarIcon({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-[1.35em] shrink-0 items-center justify-center text-[#3a3a3c] dark:text-[#c8c8c8]",
        className,
      )}
    >
      {children}
    </span>
  );
}

function ToolbarTextToggle({
  label,
  className,
}: {
  label: "r" | "R";
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex size-[1.35em] shrink-0 items-center justify-center rounded-[0.28em] border font-medium leading-none text-[#3a3a3c] dark:text-[#d0d0d0]",
        editorLineClass,
        label === "r" ? editorType.caption : "text-[0.6875em] font-semibold leading-none",
        className,
      )}
    >
      {label}
    </span>
  );
}

function DeviceToolbar() {
  const iconStroke = 1.85;

  return (
    <div
      aria-hidden
      className={cn(
        "inline-flex h-[2.15em] max-w-full items-center rounded-full border px-[0.45em] text-[#1c1c1e]",
        toolbarSurfaceClass,
        editorLineClass,
        "dark:text-[#e8e8e8]",
      )}
    >
      <span className={cn("flex items-center gap-[0.2em] px-[0.5em] font-medium", editorType.ui)}>
        iOS
        <ChevronDown className="size-[0.75em] opacity-70" strokeWidth={2.25} />
      </span>
      <ToolbarDivider />
      <span className={cn("px-[0.55em] font-medium", editorType.ui)}>iPhone 16</span>
      <ToolbarDivider />
      <span className="flex items-center gap-[0.2em] px-[0.35em]">
        <ToolbarIcon>
          <Smartphone className="size-[0.9em]" strokeWidth={iconStroke} />
        </ToolbarIcon>
        <ToolbarIcon>
          <Moon className="size-[0.9em]" strokeWidth={iconStroke} />
        </ToolbarIcon>
        <ToolbarIcon>
          <Camera className="size-[0.9em]" strokeWidth={iconStroke} />
        </ToolbarIcon>
      </span>
      <ToolbarIcon className="mx-[0.2em] size-[1.55em] rounded-[0.32em] bg-[#0a84ff] text-white">
        <SquareDashedMousePointer className="size-[0.78em]" strokeWidth={iconStroke} />
      </ToolbarIcon>
      <ToolbarIcon className="mx-[0.1em]">
        <Layers2 className="size-[0.9em]" strokeWidth={iconStroke} />
      </ToolbarIcon>
      <ToolbarDivider />
      <span className="flex items-center gap-[0.3em] px-[0.35em]">
        <ToolbarTextToggle label="r" />
        <ToolbarTextToggle label="R" />
      </span>
      <ToolbarDivider />
      <ToolbarIcon className="mx-[0.2em]">
        <X className="size-[0.88em]" strokeWidth={2} />
      </ToolbarIcon>
    </div>
  );
}

function ComposerToolbar() {
  return (
    <div className={cn("flex items-center justify-between border-t pt-[0.9em]", editorLineClass)}>
      <div className="flex items-center gap-[0.55em]">
        <span className={cn("flex size-[1.45em] items-center justify-center rounded-full border text-foreground/70 dark:text-foreground/80", editorLineClass)}>
          <Plus className="size-[0.7em]" strokeWidth={2.25} />
        </span>
        <span className={cn("flex items-center gap-[0.25em] font-medium text-foreground/75", editorType.ui)}>
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

function TreeBranch({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const isFolder = Boolean(node.children);
  const paddingLeft = `${depth * 0.95 + 0.35}em`;

  return (
    <>
      <div
        className={cn(
          "group flex items-center gap-[0.4em] rounded-[0.3em] py-[0.34em] pr-[0.35em] transition-colors",
          explorerType,
          node.active
            ? "bg-[#e8e8e8] text-[#1e1e1e] dark:bg-[#37373d] dark:text-[#ffffff]"
            : "text-[#3c3c3c] hover:bg-black/[0.04] dark:text-[#cccccc] dark:hover:bg-white/[0.06]",
        )}
        style={{ paddingLeft }}
      >
        {isFolder ? (
          node.open ? (
            <ChevronDown
              className="size-[1em] shrink-0 text-[#8b949e] opacity-80"
              strokeWidth={2.5}
            />
          ) : (
            <ChevronRight
              className="size-[1em] shrink-0 text-[#8b949e] opacity-80"
              strokeWidth={2.5}
            />
          )
        ) : (
          <span className="inline-block w-[1em] shrink-0" aria-hidden />
        )}
        {isFolder ? (
          <ExplorerFolderIcon open={node.open} />
        ) : (
          <ExplorerFileIcon name={node.name} />
        )}
        <span className="min-w-0 truncate">{node.name}</span>
      </div>
      {node.open &&
        node.children?.map((child) => (
          <TreeBranch key={`${node.name}-${child.name}`} node={child} depth={depth + 1} />
        ))}
    </>
  );
}

function ProjectExplorer() {
  return (
    <aside
      className={cn(
        "flex w-[17%] shrink-0 flex-col border-r",
        editorLineClass,
        editorSurfaceClass,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between border-b",
          chromeBarClass,
          editorLineClass,
          editorSurfaceClass,
        )}
      >
        <span
          className={cn(
            "font-semibold tracking-[0.08em] text-[#3c3c3c] uppercase dark:text-[#cccccc]",
            explorerType,
          )}
        >
          Explorer
        </span>
        <span
          className={cn(
            "rounded bg-black/[0.05] px-[0.45em] py-[0.1em] font-mono font-medium text-[#6d758a] dark:bg-white/[0.06] dark:text-[#9aa3b8]",
            editorType.caption,
          )}
        >
          Flutter
        </span>
      </div>
      <div className="flex-1 overflow-hidden px-[0.15em] py-[0.35em]">
        {PROJECT_TREE.map((node) => (
          <TreeBranch key={node.name} node={node} />
        ))}
      </div>
    </aside>
  );
}

function ChatPanel() {
  const [message, setMessage] = useState("");

  return (
    <section
      className={cn(
        "flex min-w-0 flex-1 flex-col px-[3%] pb-[2.5%] pt-[2%]",
        editorSurfaceClass,
      )}
    >
      <div className="mt-auto flex flex-col">
        <div
          className={cn(
            "flex min-h-[62%] flex-col rounded-[0.85em] border bg-white px-[4.5%] py-[4%] shadow-[0_1px_3px_rgba(26,30,44,0.05),0_10px_30px_-16px_rgba(26,30,44,0.12)]",
            editorLineClass,
            "dark:bg-[#13120a] dark:shadow-none",
          )}
        >
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            aria-label="Mensagem do composer"
            rows={4}
            className={cn(
              "min-h-[4.5em] w-full flex-1 resize-none border-0 bg-transparent p-0 text-[#2a3040] outline-none select-text focus:ring-0 dark:text-[#d8dcea]",
              editorType.body,
            )}
          />
          <ComposerToolbar />
        </div>

        <div className="mt-[1em] flex flex-wrap gap-[0.45em]">
          {ACTION_PILLS.map((label) => (
            <Pill key={label}>{label}</Pill>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhonePanelCalloutArrow({ className }: { className?: string }) {
  const markerId = useId();

  return (
    <svg
      aria-hidden
      viewBox="0 0 72 56"
      fill="none"
      className={cn("mx-auto mt-[0.35em] block h-[2.65em] w-[54%] sm:h-[2.85em] sm:w-[52%]", className)}
    >
      <defs>
        <marker
          id={markerId}
          viewBox="0 0 10 10"
          markerWidth="8"
          markerHeight="8"
          refX="9"
          refY="5"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path
            d="M0 1 L9 5 L0 9"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.15"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </marker>
      </defs>
      <path
        d="M37 4 Q58 28 31 51"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        fill="none"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  );
}

export function HeroPhonePanelCallout() {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-30 block w-[34%] min-w-[5.25rem] text-center",
        "right-[-0.5%] top-[5.15%] translate-x-[0.7em] -translate-y-[calc(100%+0.55em)]",
        "sm:right-[-1.1%] sm:w-[29%] sm:translate-x-[1.35em]",
        "md:translate-x-[1.45em]",
      )}
    >
      <p
        className={cn(
          "font-heading text-[clamp(0.78rem,0.66rem+0.38vw,1.28rem)] font-bold leading-[1.14] tracking-[-0.028em]",
          "text-[#1a1e2c] [text-shadow:0_1px_2px_rgba(26,30,44,0.2),0_5px_18px_rgba(26,30,44,0.16)]",
          "dark:text-white dark:[text-shadow:0_1px_3px_rgba(0,0,0,0.62),0_8px_28px_rgba(0,0,0,0.42)]",
        )}
      >
        construa uma vez,
        <br />
        publique em todo lugar
      </p>
      <PhonePanelCalloutArrow
        className={cn(
          "text-[#1a1e2c] drop-shadow-[0_4px_12px_rgba(26,30,44,0.1)]",
          "dark:text-white dark:drop-shadow-[0_4px_16px_rgba(0,0,0,0.45)]",
        )}
      />
    </div>
  );
}

function PhonePanel() {
  return (
    <aside
      className={cn(
        "relative flex w-[34%] shrink-0 flex-col border-l",
        editorLineClass,
        editorSurfaceClass,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-[0.55em] border-b",
          chromeBarClass,
          editorLineClass,
          editorSurfaceClass,
        )}
      >
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center overflow-hidden rounded-[0.32em] border",
            editorLineClass,
            editorSurfaceClass,
          )}
        >
          <span
            className={cn(
              "shrink-0 border-r px-[0.65em] py-[0.35em] text-[#6d758a] dark:text-[#8b93a7]",
              editorLineClass,
              editorType.ui,
            )}
          >
            flutter run — web
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate px-[0.65em] py-[0.35em] font-mono text-[#8b93a7] dark:text-[#7d869c]",
              editorType.ui,
            )}
          >
            http://localhost:5555
          </span>
        </div>
      </div>

      <div className={cn("flex justify-center px-[3.5%] py-[0.85em]", editorSurfaceClass)}>
        <DeviceToolbar />
      </div>

      <div className="relative flex flex-1 items-start justify-center px-[4%] pb-[2%] pt-[0.5%]">
        <div className="relative w-[80%] max-w-[272px] translate-y-[4px]">
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
    </aside>
  );
}

export function HeroWorkspaceMock() {
  return (
    <div
      className={cn(
        "flex aspect-[2940/1680] w-full flex-col select-none text-[clamp(0.56rem,0.38rem+0.48vw,0.82rem)]",
        editorFontClass,
        editorSurfaceClass,
      )}
    >
      <header
        className={cn(
          "flex items-center gap-[0.75em] border-b py-[0.62em]",
          "px-[0.75em]",
          editorLineClass,
          chromeBarSurfaceClass,
        )}
      >
        <WindowDots />
        <div className={cn("flex items-center gap-[0.45em]", chromeHeaderType)}>
          <span className="flex size-[1.35em] shrink-0 overflow-hidden rounded-[0.32em] bg-white">
            {/* eslint-disable-next-line @next/next/no-img-element -- SVG local, mesmo padrão do pill IDE */}
            <img
              src={CURSOR_LOGO_SRC}
              alt=""
              className="size-full object-contain p-[0.08em]"
              draggable={false}
            />
          </span>
          <span className="font-cursor-gothic text-[0.68em] font-normal uppercase tracking-[0.08em] text-black dark:text-white">
            Cursor
          </span>
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <ProjectExplorer />
        <ChatPanel />
        <PhonePanel />
      </div>
    </div>
  );
}
