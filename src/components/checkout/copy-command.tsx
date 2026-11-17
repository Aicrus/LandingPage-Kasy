"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

/** Bloco de comando com botão de copiar. */
export function CopyCommand({
  value,
  copyLabel,
  copiedLabel,
  className,
}: {
  value: string;
  copyLabel: string;
  copiedLabel: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // sem permissão de clipboard: o texto continua selecionável
    }
  };

  return (
    <div
      className={cn(
        "flex items-center gap-2 rounded-xl border border-border/70 bg-background px-3.5 py-2.5",
        className,
      )}
    >
      <code className="min-w-0 flex-1 select-all text-left font-mono text-[11px] leading-relaxed text-foreground [overflow-wrap:anywhere] sm:text-[0.8125rem]">
        {value}
      </code>
      <button
        type="button"
        onClick={copy}
        aria-label={copied ? copiedLabel : copyLabel}
        className="inline-flex size-8 shrink-0 items-center justify-center gap-1.5 rounded-lg text-xs font-medium sm:size-auto sm:px-2 sm:py-1 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      >
        {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
        <span className="hidden sm:inline">{copied ? copiedLabel : copyLabel}</span>
      </button>
    </div>
  );
}
