import { cn } from "@/lib/utils";

type KasyLogoProps = {
  className?: string;
};

export function KasyLogoIcon({ className }: KasyLogoProps) {
  return (
    <svg
      viewBox="0 0 20 20"
      fill="none"
      aria-hidden
      className={cn("logo-icon shrink-0 text-foreground", className)}
    >
      <rect x="2.5" y="3" width="3.5" height="14" rx="0.75" fill="currentColor" />
      <rect
        x="10"
        y="3"
        width="3.5"
        height="9"
        rx="0.75"
        fill="currentColor"
        transform="rotate(14 11.75 7.5)"
      />
    </svg>
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
      <span className="logo-wordmark">Kasy</span>
    </span>
  );
}
