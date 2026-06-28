"use client";

import Image from "next/image";
import {
  Camera,
  ChevronDown,
  ChevronRight,
  FileCode2,
  Folder,
  FolderOpen,
  Layers2,
  Mic,
  Moon,
  Plus,
  Smartphone,
  SquareDashedMousePointer,
  X,
} from "lucide-react";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils";

const PHONE_SRC = "/assets/phone-command.png";
const PHONE_WIDTH = 1300;
const PHONE_HEIGHT = 2642;

const editorSurfaceClass = "bg-white dark:bg-[#0a0a0a]";
const barSurfaceClass = "bg-[#f0f0f0] dark:bg-[#141414]";

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
  return (
    <span
      aria-hidden
      className="mx-[0.1em] h-[1.15em] w-px bg-black/[0.1] dark:bg-white/[0.12]"
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
        "inline-flex size-[1.35em] shrink-0 items-center justify-center rounded-[0.28em] border border-black/[0.08] font-medium leading-none text-[#3a3a3c] dark:border-white/[0.1] dark:text-[#d0d0d0]",
        label === "r" ? "text-[0.58em]" : "text-[0.68em] font-semibold",
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
        "inline-flex h-[2.15em] max-w-full items-center rounded-full border border-black/[0.08] px-[0.45em] text-[#1c1c1e] shadow-[0_2px_12px_rgba(0,0,0,0.08),0_1px_2px_rgba(0,0,0,0.04)]",
        barSurfaceClass,
        "dark:border-white/[0.1] dark:text-[#e8e8e8]",
      )}
    >
      <span className="flex items-center gap-[0.2em] px-[0.5em] text-[0.62em] font-medium">
        iOS
        <ChevronDown className="size-[0.75em] opacity-70" strokeWidth={2.25} />
      </span>
      <ToolbarDivider />
      <span className="px-[0.55em] text-[0.62em] font-medium">iPhone 16</span>
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

function TreeBranch({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const isFolder = Boolean(node.children);
  const paddingLeft = `${depth * 1.15 + 0.4}em`;

  return (
    <>
      <div
        className={cn(
          "group mx-[0.1em] flex items-center gap-[0.4em] rounded-[0.4em] py-[0.38em] pr-[0.4em] font-mono text-[0.88em] leading-snug transition-colors",
          node.active
            ? "border-l-2 border-[#4a7fd4] bg-[#dfe8ff] pl-[0.35em] text-[#1a1e2c] dark:border-[#8ba4e8] dark:bg-[#24304d] dark:text-[#e8edff]"
            : "border-l-2 border-transparent text-[#3d465c] hover:bg-black/[0.04] dark:text-[#b8c0d4] dark:hover:bg-white/[0.05]",
        )}
        style={{ paddingLeft }}
      >
        {isFolder ? (
          node.open ? (
            <ChevronDown
              className="size-[1em] shrink-0 text-[#6d758a] dark:text-[#8b93a7]"
              strokeWidth={2.25}
            />
          ) : (
            <ChevronRight
              className="size-[1em] shrink-0 text-[#6d758a] dark:text-[#8b93a7]"
              strokeWidth={2.25}
            />
          )
        ) : (
          <span className="inline-block w-[1em] shrink-0" aria-hidden />
        )}
        {isFolder ? (
          node.open ? (
            <FolderOpen
              className="size-[1.08em] shrink-0 text-[#c9953d] dark:text-[#e0b35c]"
              strokeWidth={1.85}
            />
          ) : (
            <Folder
              className="size-[1.08em] shrink-0 text-[#c9953d] dark:text-[#e0b35c]"
              strokeWidth={1.85}
            />
          )
        ) : (
          <FileCode2
            className={cn(
              "size-[1.08em] shrink-0",
              node.name.endsWith(".dart")
                ? "text-[#4a9fd8] dark:text-[#6ec1f2]"
                : "text-[#4a5270] dark:text-[#8ba4e8]",
            )}
            strokeWidth={1.85}
          />
        )}
        <span className="min-w-0 truncate font-medium">{node.name}</span>
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
        "flex w-[19%] shrink-0 flex-col border-r border-black/[0.07] dark:border-white/[0.07]",
        editorSurfaceClass,
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between border-b border-black/[0.06] px-[0.6em] py-[0.5em] dark:border-white/[0.06]",
          barSurfaceClass,
        )}
      >
        <span className="text-[0.62em] font-semibold tracking-[0.1em] text-[#5f677a] uppercase dark:text-[#8b93a7]">
          Explorer
        </span>
        <span className="rounded bg-black/[0.05] px-[0.45em] py-[0.1em] font-mono text-[0.48em] font-medium text-[#6d758a] dark:bg-white/[0.06] dark:text-[#9aa3b8]">
          Flutter
        </span>
      </div>
      <div className="flex-1 overflow-hidden px-[0.25em] py-[0.45em]">
        {PROJECT_TREE.map((node) => (
          <TreeBranch key={node.name} node={node} />
        ))}
      </div>
    </aside>
  );
}

function ChatPanel() {
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
            "flex min-h-[62%] flex-col rounded-[1.2em] border border-black/[0.06] bg-white px-[4.5%] py-[4%] shadow-[0_1px_3px_rgba(26,30,44,0.05),0_10px_30px_-16px_rgba(26,30,44,0.12)]",
            "dark:border-white/[0.08] dark:bg-[#0a0a0a] dark:shadow-none",
          )}
        >
          <div className="flex-1">
            <p className="text-[0.74em] leading-[1.55] text-[#2a3040] dark:text-[#d8dcea]">
              Edite isso: Edit this exact widget (Flutter debug inspector):
            </p>
            <p className="mt-[0.55em] font-mono text-[0.66em] leading-[1.6] text-[#4d5568] dark:text-[#a8b0c4]">
              Widget:{" "}
              <span className="text-[#4a5270] dark:text-[#8ba4e8]">`ProductCard`</span>{" "}
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

        <div className="mt-[1em] flex flex-wrap gap-[0.45em]">
          {ACTION_PILLS.map((label) => (
            <Pill key={label}>{label}</Pill>
          ))}
        </div>
      </div>
    </section>
  );
}

function PhonePanel() {
  return (
    <aside
      className={cn(
        "relative flex w-[34%] shrink-0 flex-col border-l border-black/[0.05] dark:border-white/[0.06]",
        editorSurfaceClass,
      )}
    >
      <div
        className={cn(
          "flex items-center gap-[0.55em] border-b border-black/[0.05] px-[3.5%] py-[1.1em] dark:border-white/[0.06]",
          barSurfaceClass,
        )}
      >
        <div
          className={cn(
            "flex min-w-0 flex-1 items-center overflow-hidden rounded-[0.45em] border border-black/[0.06] dark:border-white/[0.08]",
            editorSurfaceClass,
          )}
        >
          <span className="shrink-0 border-r border-black/[0.05] px-[0.65em] py-[0.3em] text-[0.5em] text-[#6d758a] dark:border-white/[0.07] dark:text-[#8b93a7]">
            flutter run — web
          </span>
          <span className="min-w-0 flex-1 truncate px-[0.65em] py-[0.3em] font-mono text-[0.5em] text-[#8b93a7] dark:text-[#7d869c]">
            http://localhost:5555
          </span>
        </div>
      </div>

      <div className={cn("flex justify-center px-[3.5%] py-[0.85em]", barSurfaceClass)}>
        <DeviceToolbar />
      </div>

      <div className="relative flex flex-1 items-start justify-center px-[4%] pb-[2%] pt-[0.5%]">
        <div className="relative w-[80%] max-w-[272px]">
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
        editorSurfaceClass,
      )}
    >
      <header
        className={cn(
          "flex items-center gap-[0.65em] border-b border-black/[0.05] px-[1.2%] py-[0.55em] dark:border-white/[0.06]",
          barSurfaceClass,
        )}
      >
        <WindowDots />
        <div className="flex items-center gap-[0.35em] text-[0.54em] text-[#8b93a7] dark:text-[#6f7890]">
          <span className="font-medium text-[#5f677a] dark:text-[#9aa3b8]">flutter_app</span>
          <span aria-hidden className="opacity-70">
            ›
          </span>
          <span>main</span>
          <span aria-hidden className="opacity-70">
            ›
          </span>
          <span>Local</span>
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
