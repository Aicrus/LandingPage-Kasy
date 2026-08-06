"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useState } from "react";

import { cn } from "@/lib/utils";

type ChangelogCommandChipProps = {
  command: string;
  copyLabel: string;
  copiedLabel: string;
  className?: string;
};

export function ChangelogCommandChip({
  command,
  copyLabel,
  copiedLabel,
  className,
}: ChangelogCommandChipProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may fail in unsupported contexts; ignore silently.
    }
  }, [command]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : copyLabel}
      className={cn(
        "group inline-flex items-center gap-2 rounded-md border border-border/60 bg-muted/60 px-2.5 py-1.5 font-mono text-[0.8125rem] leading-none text-foreground/90 transition-colors hover:border-border hover:bg-muted",
        className,
      )}
    >
      <span>{command}</span>
      {copied ? (
        <Check className="size-3.5 shrink-0 text-foreground" />
      ) : (
        <Copy className="size-3.5 shrink-0 text-muted-foreground transition-colors group-hover:text-foreground" />
      )}
    </button>
  );
}
