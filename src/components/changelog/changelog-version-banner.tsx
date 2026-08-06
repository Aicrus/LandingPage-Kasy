"use client";

import { useEffect, useRef, useState } from "react";

import { ChangelogCommandChip } from "@/components/changelog/changelog-command-chip";
import type { ChangelogPageCopy, KasyVersions } from "@/lib/changelog";
import { cn } from "@/lib/utils";

type ChangelogVersionBannerProps = {
  copy: ChangelogPageCopy["versions"];
  versions: KasyVersions;
};

const FOOTER_CLEARANCE_PX = 48;
const SCROLL_HIDE_THRESHOLD_PX = 40;

export function ChangelogVersionBanner({
  copy,
  versions,
}: ChangelogVersionBannerProps) {
  const [visible, setVisible] = useState(true);
  const lastY = useRef(0);

  useEffect(() => {
    lastY.current = window.scrollY;

    const onScroll = () => {
      const y = window.scrollY;
      const doc = document.documentElement;
      const nearBottom =
        y + window.innerHeight >= doc.scrollHeight - FOOTER_CLEARANCE_PX;
      const scrollingDown = y > lastY.current;

      if (nearBottom || (scrollingDown && y > SCROLL_HIDE_THRESHOLD_PX)) {
        setVisible(false);
      } else if (y <= SCROLL_HIDE_THRESHOLD_PX || !scrollingDown) {
        setVisible(true);
      }

      lastY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-border/60 bg-background/95 backdrop-blur-sm transition-transform duration-300 supports-backdrop-filter:bg-background/80",
        visible ? "translate-y-0" : "translate-y-full",
      )}
    >
      <div className="mx-auto flex w-full max-w-[min(96vw,46rem)] flex-wrap items-center gap-x-2.5 gap-y-1.5 px-page-x py-2.5 text-[0.8125rem] leading-none lg:max-w-[min(94vw,56rem)] xl:max-w-[min(96vw,80rem)] 2xl:max-w-[84rem]">
        <span className="text-muted-foreground">
          {copy.cliLabel} <span className="font-mono text-foreground/90">v{versions.cli}</span>
        </span>
        <span className="text-muted-foreground">·</span>
        <span className="text-muted-foreground">
          {copy.mcpLabel} <span className="font-mono text-foreground/90">v{versions.mcp}</span>
        </span>
        <span className="hidden text-muted-foreground sm:inline">·</span>
        <ChangelogCommandChip
          command={copy.upgradeCommand}
          copyLabel={copy.copyLabel}
          copiedLabel={copy.copiedLabel}
          className="py-1"
        />
        <span className="hidden text-muted-foreground sm:inline">
          {copy.upgradeNote}
        </span>
      </div>
    </div>
  );
}
