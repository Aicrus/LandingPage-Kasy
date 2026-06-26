"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { KasyLogo } from "@/components/kasy-logo";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const SCROLL_OFFSET = 32;

const morphTransition =
  "transition-[width,max-width,padding,border-radius,background-color,box-shadow,border-color,gap,backdrop-filter,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none";

export function SiteHeader() {
  const [isCompact, setIsCompact] = useState(false);

  useEffect(() => {
    const update = () => {
      setIsCompact(window.scrollY > SCROLL_OFFSET);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full",
        morphTransition,
        isCompact ? "px-4 pt-3" : "px-page-x",
      )}
    >
      <div
        className={cn(
          "mx-auto flex items-center justify-between",
          morphTransition,
          isCompact
            ? "w-fit max-w-[calc(100%-0.5rem)] gap-3 rounded-full border border-border/50 bg-background/72 py-2 pl-3 pr-2 shadow-[0_4px_24px_-6px_rgba(26,30,44,0.14),0_1px_3px_rgba(26,30,44,0.06)] backdrop-blur-xl supports-[backdrop-filter]:bg-background/62 dark:border-border/40 dark:bg-background/55 dark:shadow-[0_4px_28px_-6px_rgba(0,0,0,0.45),0_1px_3px_rgba(0,0,0,0.25)] sm:gap-4 sm:pl-4 sm:pr-2.5"
            : "w-full max-w-header gap-0 rounded-none border border-transparent bg-transparent py-4 shadow-none backdrop-blur-none",
        )}
      >
        <Link
          href="/"
          className={cn(
            "rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
            morphTransition,
            isCompact && "scale-[0.94] origin-left",
          )}
        >
          <KasyLogo />
        </Link>

        <nav
          className={cn(
            "flex items-center",
            morphTransition,
            isCompact ? "gap-3 sm:gap-4" : "gap-5 sm:gap-6",
          )}
        >
          <Link
            href="/documentacao"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="sm:hidden">Docs</span>
            <span className="hidden sm:inline">Documentação</span>
          </Link>
          <Button
            variant="outline"
            className={cn(
              "rounded-full",
              morphTransition,
              isCompact ? "h-auto px-3.5 py-2 text-[0.8125rem]" : "px-4",
            )}
            render={<Link href="/obter-kasy" />}
          >
            Obter Kasy Pro
          </Button>
        </nav>
      </div>
    </header>
  );
}
