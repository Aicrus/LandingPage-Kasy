"use client";

import Image from "next/image";
import {
  Camera,
  ChevronDown,
  ChevronRight,
  Globe,
  Layers2,
  Mic,
  Moon,
  Plus,
  Smartphone,
  SquareDashedMousePointer,
  X,
} from "lucide-react";
import { SiAndroid, SiApple } from "@icons-pack/react-simple-icons";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useId, useState } from "react";

import { BlurReveal } from "@/components/motion/blur-reveal";
import { ExplorerFileIcon, ExplorerFolderIcon } from "@/components/sections/explorer-icons";
import { cn } from "@/lib/utils";

/** Continua o stagger do hero intro (último item em 0.78). */
const HERO_CALLOUT_REVEAL_DELAY = 0.92;

const PHONE_IMAGES = {
  light: {
    src: "/assets/editor-device-light.png",
    width: 1300,
    height: 2642,
  },
  dark: {
    src: "/assets/editor-device-dark.png",
    width: 1300,
    height: 2642,
  },
} as const;
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

type TreeNode = {
  name: string;
  open?: boolean;
  active?: boolean;
  children?: TreeNode[];
};

const PROJECT_TREE: TreeNode[] = [
  {
    name: "kasy_app",
    open: true,
    children: [
      {
        name: "lib",
        open: true,
        children: [
          { name: "main.dart" },
          {
            name: "core",
            children: [{ name: "router.dart" }, { name: "theme.dart" }],
          },
          {
            name: "features",
            open: true,
            children: [
              {
                name: "auth",
                open: true,
                children: [
                  { name: "login_page.dart" },
                  { name: "auth_provider.dart" },
                ],
              },
              {
                name: "home",
                open: true,
                children: [
                  { name: "home_page.dart", active: true },
                  {
                    name: "widgets",
                    children: [{ name: "product_card.dart" }],
                  },
                ],
              },
              {
                name: "paywall",
                children: [{ name: "paywall_page.dart" }, { name: "plans_sheet.dart" }],
              },
              {
                name: "profile",
                children: [{ name: "profile_page.dart" }],
              },
            ],
          },
          {
            name: "shared",
            children: [{ name: "app_button.dart" }, { name: "loading_view.dart" }],
          },
        ],
      },
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
        "inline-flex h-[2.15em] max-w-full flex-nowrap items-center rounded-full border px-[0.45em] text-[#1c1c1e]",
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
      <span className={cn("shrink-0 whitespace-nowrap px-[0.5em] font-medium", editorType.ui)}>
        iPhone 16
      </span>
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
        <span className="flex size-[1.55em] items-center justify-center rounded-full bg-foreground text-background dark:bg-[#f5f8f7] dark:text-[#0b1211]">
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
        "flex w-[17%] shrink-0 flex-col border-r max-sm:w-[19%]",
        editorLineClass,
        editorSurfaceClass,
      )}
    >
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
  const t = useTranslations("heroWorkspaceMock");

  return (
    <section
      className={cn(
        "flex min-w-0 flex-1 flex-col px-[3%] pb-[2.5%] pt-[2%] max-sm:w-[33%] max-sm:shrink-0 max-sm:flex-none",
        editorSurfaceClass,
      )}
    >
      <div className="mt-auto flex flex-col">
        <div
          className={cn(
            "flex min-h-[62%] flex-col rounded-[0.85em] border bg-white px-[4.5%] py-[4%] shadow-[0_1px_3px_rgba(3,26,24,0.05),0_10px_30px_-16px_rgba(3,26,24,0.12)]",
            editorLineClass,
            "dark:bg-[#13120a] dark:shadow-none",
          )}
        >
          <textarea
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            aria-label={t("composerAriaLabel")}
            rows={4}
            className={cn(
              "min-h-[4.5em] w-full flex-1 resize-none border-0 bg-transparent p-0 text-[#2a3040] outline-none select-text focus:ring-0 dark:text-[#d8dcea]",
              editorType.body,
            )}
          />
          <ComposerToolbar />
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
      className={cn(
        "hero-callout-arrow-shadow mx-auto mt-[0.35em] block h-[2.65em] w-[54%] text-white sm:h-[2.85em] sm:w-[52%]",
        className,
      )}
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
      {/* mobile: curva espelhada — aponta para o celular à direita */}
      <path
        d="M35 4 Q14 28 41 51"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        fill="none"
        markerEnd={`url(#${markerId})`}
        className="sm:hidden"
      />
      <path
        d="M37 4 Q58 28 31 51"
        stroke="currentColor"
        strokeWidth="2.25"
        strokeLinecap="round"
        fill="none"
        markerEnd={`url(#${markerId})`}
        className="hidden sm:block"
      />
    </svg>
  );
}

function HeroMockBottomFade() {
  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-x-0 bottom-0 z-[5]",
        "h-hero-mock-fade-height",
        "bg-gradient-to-t",
        "from-background/75 from-0%",
        "via-background/28 via-[18%]",
        "via-background/12 via-[38%]",
        "via-background/5 via-[58%]",
        "via-background/[0.03] via-[78%]",
        "to-transparent to-100%",
      )}
    />
  );
}

export function HeroPhonePanelCallout() {
  const t = useTranslations("heroWorkspaceMock");

  return (
    <div
      aria-hidden
      className={cn(
        "pointer-events-none absolute z-30 text-center",
        /* mobile: sobrepõe o topo do editor, mais baixo no card */
        "right-[5%] w-[36%]",
        "top-[6.25%] -translate-y-[calc(100%-1.05em)] -translate-x-[0.25em]",
        /* sm+: ancorado no card do mock — seta aponta para o celular */
        "sm:block sm:min-w-[5.25rem] sm:right-[6%] sm:top-[6.25%] sm:w-[26%]",
        "sm:-translate-y-[calc(100%+0.25em)] sm:translate-x-0",
      )}
    >
      <BlurReveal as="div" delay={HERO_CALLOUT_REVEAL_DELAY}>
        <p
          className={cn(
            "font-heading font-bold leading-[1.14] tracking-[-0.028em]",
            "text-[clamp(0.7rem,3.05vw,0.84rem)] sm:text-[clamp(0.78rem,0.66rem+0.38vw,1.28rem)]",
            "text-white hero-callout-text-shadow",
          )}
        >
          <span className="block whitespace-nowrap">{t("calloutLine1")}</span>
          <span className="block whitespace-nowrap">{t("calloutLine2")}</span>
        </p>
        <PhonePanelCalloutArrow
          className={cn(
            "mt-[0.55em] max-sm:mt-[0.5em] max-sm:!mx-0 max-sm:ml-[12%] max-sm:mr-auto",
          )}
        />
      </BlurReveal>
    </div>
  );
}

function PlatformTargets() {
  const targets = [
    { id: "web", label: "Web", Icon: Globe, color: "#38BDF8", active: false },
    { id: "ios", label: "iOS", Icon: SiApple, color: null, active: true },
    { id: "android", label: "Android", Icon: SiAndroid, color: "#3DDC84", active: false },
  ] as const;

  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-[0.2em] border-l px-[0.35em] py-[0.2em]",
        editorLineClass,
      )}
    >
      {targets.map(({ id, label, Icon, color, active }) => (
        <span
          key={id}
          title={label}
          className={cn(
            "flex size-[1.55em] items-center justify-center rounded-[0.28em] transition-colors",
            active
              ? "bg-black/[0.06] text-foreground dark:bg-white/[0.1] dark:text-[#f5f8f7]"
              : "text-[#8b93a7] opacity-70 dark:text-[#7d869c]",
          )}
        >
          <Icon
            size="0.82em"
            color={active ? (color ?? "currentColor") : "currentColor"}
            aria-hidden
          />
        </span>
      ))}
    </div>
  );
}

function PhonePanel() {
  const t = useTranslations("heroWorkspaceMock");

  return (
    <aside
      className={cn(
        "relative flex w-[34%] shrink-0 flex-col border-l max-sm:w-[48%]",
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
            flutter run
          </span>
          <span
            className={cn(
              "min-w-0 flex-1 truncate px-[0.65em] py-[0.35em] font-mono text-[#8b93a7] dark:text-[#7d869c]",
              editorType.ui,
            )}
          >
            http://localhost:5555
          </span>
          <PlatformTargets />
        </div>
      </div>

      <div className={cn("flex justify-center px-[3.5%] py-[0.85em]", editorSurfaceClass)}>
        <DeviceToolbar />
      </div>

      <div className="relative flex min-h-0 flex-1 justify-center px-[4%] pb-[3.5%] pt-[0.5%]">
        <div className="relative h-full w-[76%] max-w-[258px] -translate-y-[0.1em]">
          <Image
            src={PHONE_IMAGES.light.src}
            alt={t("phoneAlt")}
            width={PHONE_IMAGES.light.width}
            height={PHONE_IMAGES.light.height}
            className="h-full w-full object-contain object-top drop-shadow-[0_20px_36px_rgba(0,0,0,0.16)] dark:hidden"
            priority
            unoptimized
            draggable={false}
          />
          <Image
            src={PHONE_IMAGES.dark.src}
            alt={t("phoneAlt")}
            width={PHONE_IMAGES.dark.width}
            height={PHONE_IMAGES.dark.height}
            className="hidden h-full w-full object-contain object-top drop-shadow-[0_20px_36px_rgba(0,0,0,0.45)] dark:block"
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
        "relative flex aspect-[2940/1680] w-full flex-col select-none",
        "text-[clamp(0.56rem,0.38rem+0.48vw,0.82rem)]",
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
        </div>
      </header>

      <div className="flex min-h-0 flex-1">
        <ProjectExplorer />
        <ChatPanel />
        <PhonePanel />
      </div>

      <HeroMockBottomFade />
    </div>
  );
}
