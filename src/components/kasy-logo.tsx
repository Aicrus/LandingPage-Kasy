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
  "logo-wordmark-img !h-7 sm:!h-8 !w-auto max-h-8 object-contain object-left";

export function KasyLogo({ className }: KasyLogoProps) {
  return (
    <span className={cn("inline-flex h-8 items-center", className)}>
      <Image
        src={KASY_WORDMARK.light.src}
        alt="Kasy"
        width={KASY_WORDMARK.light.width}
        height={KASY_WORDMARK.light.height}
        className={cn(wordmarkClassName, "logo-wordmark-img--light")}
        style={{ width: "auto", height: "1.75rem" }}
        sizes="140px"
        priority
        unoptimized
      />
      <Image
        src={KASY_WORDMARK.dark.src}
        alt="Kasy"
        width={KASY_WORDMARK.dark.width}
        height={KASY_WORDMARK.dark.height}
        className={cn(wordmarkClassName, "logo-wordmark-img--dark")}
        style={{ width: "auto", height: "1.75rem" }}
        sizes="140px"
        priority
        unoptimized
      />
    </span>
  );
}
