"use client";

import {
  SiAndroid,
  SiApple,
  SiClaude,
  SiCodemagic,
  SiCursor,
  SiFacebook,
  SiFirebase,
  SiGoogleadmob,
  SiMeta,
  SiRevenuecat,
  SiStripe,
  SiSupabase,
  SiWindsurf,
} from "@icons-pack/react-simple-icons";
import { Bell, Globe, ToggleRight, Webhook } from "lucide-react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

import { GoogleGIcon, type IconComponent } from "./brand-icons";

type Logo = {
  name: string;
  Icon: IconComponent;
  /** Cor de marca — `null` usa o tom neutro do texto (logos monocromáticos ou multicoloridos). */
  color: string | null;
};

type CategoryMeta = {
  key: string;
  logos: Logo[];
};

type CategoryCopy = { title: string; detail: string };

type Category = CategoryMeta & CategoryCopy;

const ROW_ONE_META: CategoryMeta[] = [
  {
    key: "backend",
    logos: [
      { name: "Firebase", Icon: SiFirebase, color: "#DD2C00" },
      { name: "Supabase", Icon: SiSupabase, color: "#3FCF8E" },
      { name: "REST API", Icon: Webhook, color: null },
    ],
  },
  {
    key: "auth",
    logos: [
      { name: "Google", Icon: GoogleGIcon, color: null },
      { name: "Apple", Icon: SiApple, color: null },
      { name: "Facebook", Icon: SiFacebook, color: "#0866FF" },
    ],
  },
  {
    key: "subs",
    logos: [
      { name: "RevenueCat", Icon: SiRevenuecat, color: "#F2545B" },
      { name: "Stripe", Icon: SiStripe, color: "#635BFF" },
    ],
  },
  {
    key: "ads",
    logos: [
      { name: "AdMob", Icon: SiGoogleadmob, color: "#EA4335" },
      { name: "Meta Ads", Icon: SiMeta, color: "#0467DF" },
    ],
  },
  {
    key: "push",
    logos: [{ name: "FCM", Icon: Bell, color: "#F59E0B" }],
  },
];

const ROW_TWO_META: CategoryMeta[] = [
  {
    key: "ui",
    logos: [{ name: "UI Kit", Icon: ToggleRight, color: "#22C55E" }],
  },
  {
    key: "cicd",
    logos: [{ name: "Codemagic", Icon: SiCodemagic, color: "#F45E3F" }],
  },
  {
    key: "platforms",
    logos: [
      { name: "iOS", Icon: SiApple, color: null },
      { name: "Android", Icon: SiAndroid, color: "#3DDC84" },
      { name: "Web", Icon: Globe, color: "#38BDF8" },
    ],
  },
  {
    key: "aiReady",
    logos: [
      { name: "Cursor", Icon: SiCursor, color: null },
      { name: "Claude", Icon: SiClaude, color: "#D97757" },
      { name: "Windsurf", Icon: SiWindsurf, color: null },
    ],
  },
];

const cardShadowClass = cn(
  "shadow-[0_1px_2px_rgba(3,26,24,0.04),0_6px_16px_-10px_rgba(3,26,24,0.12)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_20px_-10px_rgba(0,0,0,0.4)]",
);

function LogoTile({ logo }: { logo: Logo }) {
  const glow = logo.color ?? "var(--foreground)";

  return (
    <span
      title={logo.name}
      aria-hidden
      className="flex size-7 shrink-0 items-center justify-center rounded-lg sm:size-9 sm:rounded-xl"
      style={{
        backgroundColor: `color-mix(in srgb, ${glow} 14%, transparent)`,
      }}
    >
      <span className="inline-flex origin-center scale-[0.82] sm:scale-100">
        <logo.Icon size={17} color={glow} />
      </span>
    </span>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div
      className={cn(
        "flex w-[11.75rem] shrink-0 flex-col gap-2 rounded-xl sm:w-[15.5rem] sm:gap-3.5 sm:rounded-2xl md:w-[16.5rem]",
        "border border-border/70 bg-card",
        "px-3.5 py-2.5 sm:px-5 sm:py-4",
        cardShadowClass,
      )}
    >
      <div className="flex items-center gap-1.5 sm:gap-2">
        {category.logos.map((logo) => (
          <LogoTile key={logo.name} logo={logo} />
        ))}
      </div>
      <div className="min-w-0">
        <p className="text-[0.8125rem] font-semibold leading-tight text-foreground sm:text-[0.95rem] sm:leading-normal">
          {category.title}
        </p>
        <p className="mt-0.5 truncate text-[0.6875rem] text-muted-foreground sm:text-[0.8rem]">
          {category.detail}
        </p>
      </div>
    </div>
  );
}

function MarqueeRow({
  categories,
  animationClass,
}: {
  categories: Category[];
  animationClass: string;
}) {
  const items = [...categories, ...categories];

  return (
    <div
      aria-hidden
      className={cn(
        "relative w-full overflow-hidden py-1 sm:py-2",
        "[mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
        "[-webkit-mask-image:linear-gradient(to_right,transparent,black_6%,black_94%,transparent)]",
      )}
    >
      <div
        className={cn(
          "flex w-max gap-2 sm:gap-4",
          "motion-safe:hover:[animation-play-state:paused]",
          animationClass,
        )}
      >
        {items.map((category, index) => (
          <CategoryCard key={`${category.key}-${index}`} category={category} />
        ))}
      </div>
    </div>
  );
}

export function IntegrationsShowcase() {
  const t = useTranslations("integrationsShowcase");
  const categoriesCopy = t.raw("categories") as Record<string, CategoryCopy>;
  const ROW_ONE: Category[] = ROW_ONE_META.map((meta) => ({
    ...meta,
    ...categoriesCopy[meta.key],
  }));
  const ROW_TWO: Category[] = ROW_TWO_META.map((meta) => ({
    ...meta,
    ...categoriesCopy[meta.key],
  }));
  const allIntegrations = [...ROW_ONE, ...ROW_TWO];

  return (
    <section
      className={cn(
        "mx-auto flex w-full flex-col items-center",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)] pb-[clamp(3rem,6vw,5rem)]",
      )}
    >
      <Reveal
        className={cn(
          "flex w-full flex-col items-center text-center",
          "gap-[clamp(0.75rem,1vw+0.25rem,1.125rem)]",
          "mb-[clamp(1.5rem,4vw,3rem)] px-[clamp(1rem,4vw,3.5rem)] sm:px-[clamp(1.25rem,4vw,3.5rem)]",
        )}
      >
        <h2
          className={cn(
            "text-balance font-heading font-bold text-foreground",
            "text-[clamp(1.625rem,1.15rem+1.6vw,2.5rem)]",
            "leading-[1.12] tracking-[-0.02em]",
          )}
        >
          {t("heading")}
        </h2>
        <p className="max-w-fluid-subtitle text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
          {t("subtitle")}
        </p>
      </Reveal>

      <Reveal delay={0.1} className="relative flex w-full flex-col gap-0 sm:gap-0.5">
        <MarqueeRow
          categories={ROW_ONE}
          animationClass="motion-safe:animate-[marquee-left_46s_linear_infinite]"
        />
        <MarqueeRow
          categories={ROW_TWO}
          animationClass="motion-safe:animate-[marquee-right_40s_linear_infinite]"
        />
      </Reveal>

      <ul className="sr-only">
        {allIntegrations.map((category) => (
          <li key={category.key}>
            {category.title}: {category.detail}
          </li>
        ))}
      </ul>
    </section>
  );
}
