import { surfaceBorderClass } from "@/lib/surface-border";
import { cn } from "@/lib/utils";

function OnlineIndicator() {
  return (
    <span
      aria-hidden
      className="relative flex size-4 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_oklch,#22c55e,transparent_78%)]"
    >
      <span className="absolute inset-0 rounded-full bg-[#22c55e]/35 motion-safe:animate-[online-ping_2.4s_cubic-bezier(0.4,0,0.2,1)_infinite]" />
      <span className="relative size-1.5 rounded-full bg-[#22c55e] motion-safe:animate-[online-pulse_2.4s_ease-in-out_infinite]" />
    </span>
  );
}

export function HeroSocialProof() {
  return (
    <div
      className={cn(
        "inline-flex max-w-full items-center gap-2 rounded-full border bg-card/70 px-2.5 py-1.5 backdrop-blur-sm dark:bg-card/50 sm:gap-2.5 sm:px-3 sm:py-1.5",
        surfaceBorderClass,
      )}
    >
      <OnlineIndicator />
      <p className="min-w-0 text-left font-rounded text-fluid-social-proof leading-[var(--text-fluid-social-proof--line-height)] sm:whitespace-nowrap">
        <span className="font-normal text-muted-foreground">Amado por </span>
        <span className="font-bold text-foreground">+70 usuários</span>
      </p>
    </div>
  );
}
