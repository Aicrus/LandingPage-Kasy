import { cn } from "@/lib/utils";

type KasyLogoProps = {
  className?: string;
};

export function KasyLogoIcon({ className }: KasyLogoProps) {
  return (
    <span
      aria-hidden
      className={cn("logo-mark shrink-0 rounded-[14px]", className)}
    />
  );
}

export function KasyLogo({ className }: KasyLogoProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-2.5 text-foreground",
        className,
      )}
    >
      <KasyLogoIcon />
      <span className="logo-wordmark font-features-linear">Kasy</span>
    </span>
  );
}
