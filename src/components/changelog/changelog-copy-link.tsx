"use client";

import { Check, Link2 } from "lucide-react";
import { useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ChangelogCopyLinkProps = {
  entryId: string;
  copyLabel: string;
  copiedLabel: string;
};

export function ChangelogCopyLink({
  entryId,
  copyLabel,
  copiedLabel,
}: ChangelogCopyLinkProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}#${entryId}`;

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API may fail in unsupported contexts; ignore silently.
    }
  }, [entryId]);

  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={handleCopy}
      aria-label={copied ? copiedLabel : copyLabel}
      className={cn(
        "h-7 shrink-0 gap-1.5 px-2 text-[0.8125rem] font-medium text-muted-foreground hover:text-foreground",
        copied && "text-foreground",
      )}
    >
      {copied ? <Check className="size-3.5" /> : <Link2 className="size-3.5" />}
      <span>{copied ? copiedLabel : copyLabel}</span>
    </Button>
  );
}
