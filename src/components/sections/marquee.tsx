import { cn } from "@/lib/utils";

const PHRASES = [
  "7 dias até a App Store",
  "Firebase · Supabase · REST",
  "60+ componentes · 95+ variantes",
  "iOS · Android · Web",
  "Publique em 7 dias",
];

export function Marquee() {
  return (
    <div
      className={cn(
        "mx-auto w-full",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
      )}
    >
      <div
        className={cn(
          "relative w-full overflow-hidden border-y border-border/70 py-4 sm:py-5",
          "[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
          "[-webkit-mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
        )}
      >
        <div
          className={cn(
            "flex w-max items-center",
            "motion-safe:animate-[marquee-left_34s_linear_infinite]",
            "motion-safe:hover:[animation-play-state:paused]",
          )}
        >
          {[0, 1].map((group) => (
            <div key={group} className="flex shrink-0 items-center" aria-hidden={group === 1}>
              {PHRASES.map((phrase, i) => (
                <span
                  key={i}
                  className="inline-flex shrink-0 items-center whitespace-nowrap font-heading text-[1.0625rem] font-semibold tracking-[-0.01em] text-foreground sm:text-[1.3125rem]"
                >
                  {phrase}
                  <span
                    aria-hidden
                    className="mx-[clamp(1.25rem,2.5vw,1.75rem)] text-[0.875rem] text-[#16a34a] dark:text-[#4ade80]"
                  >
                    ✦
                  </span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <ul className="sr-only">
        {PHRASES.map((phrase) => (
          <li key={phrase}>{phrase}</li>
        ))}
      </ul>
    </div>
  );
}
