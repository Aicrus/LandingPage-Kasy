import { heroPillSurfaceClass, surfaceBorderClass } from "@/lib/surface-border";
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
        "inline-flex max-w-full items-center gap-2 rounded-full border px-2.5 py-1.5 shadow-[0_1px_2px_rgba(26,30,44,0.04),0_4px_14px_-6px_rgba(26,30,44,0.07)] dark:shadow-[0_1px_2px_rgba(0,0,0,0.2),0_4px_14px_-6px_rgba(0,0,0,0.24)] sm:gap-2.5 sm:px-3 sm:py-1.5",
        heroPillSurfaceClass,
        surfaceBorderClass,
      )}
    >
      <OnlineIndicator />
      <p className="min-w-0 text-left font-rounded text-fluid-social-proof leading-[var(--text-fluid-social-proof--line-height)] sm:whitespace-nowrap">
        <span className="font-medium text-muted-foreground">Amado por </span>
        <span className="font-extrabold text-foreground">+70 usuários</span>
      </p>
    </div>
  );
}
