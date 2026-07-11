import Image from "next/image";

import { cn } from "@/lib/utils";

const KASY_WORDMARK = {
  light: { src: "/assets/kasy-logo-light.png", width: 764, height: 400 },
  dark: { src: "/assets/kasy-logo-dark.png", width: 764, height: 400 },
} as const;

type KasyLogoProps = {
  className?: string;
};

const wordmarkClassName =
  "logo-wordmark-img !h-6 sm:!h-7 !w-auto max-h-7 object-contain object-left";

export function KasyLogo({ className }: KasyLogoProps) {
  return (
    <span className={cn("inline-flex h-7 items-center", className)}>
      <Image
        src={KASY_WORDMARK.light.src}
        alt="Kasy"
        width={KASY_WORDMARK.light.width}
        height={KASY_WORDMARK.light.height}
        className={cn(wordmarkClassName, "dark:hidden")}
        style={{ width: "auto", height: "1.5rem" }}
        sizes="120px"
        priority
        unoptimized
      />
      <Image
        src={KASY_WORDMARK.dark.src}
        alt="Kasy"
        width={KASY_WORDMARK.dark.width}
        height={KASY_WORDMARK.dark.height}
        className={cn(wordmarkClassName, "hidden dark:block")}
        style={{ width: "auto", height: "1.5rem" }}
        sizes="120px"
        priority
        unoptimized
      />
    </span>
  );
}
