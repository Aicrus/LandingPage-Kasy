"use client";

import {
  SiAndroid,
  SiAppstore,
  SiApple,
  SiClaude,
  SiCodemagic,
  SiCursor,
  SiDart,
  SiFacebook,
  SiFirebase,
  SiFlutter,
  SiGoogleadmob,
  SiGooglegemini,
  SiGoogleplay,
  SiMapbox,
  SiMeta,
  SiMixpanel,
  SiRevenuecat,
  SiSentry,
  SiStripe,
  SiSupabase,
  SiWindsurf,
} from "@icons-pack/react-simple-icons";
import { Bell, Globe, ToggleRight, Webhook } from "lucide-react";
import { useTranslations } from "next-intl";

import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

import { GoogleGIcon, OpenAiIcon, type IconComponent } from "./brand-icons";

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
  {
    key: "aiChat",
    logos: [
      { name: "OpenAI", Icon: OpenAiIcon, color: null },
      { name: "Gemini", Icon: SiGooglegemini, color: "#8E75B2" },
    ],
  },
  {
    key: "observability",
    logos: [
      { name: "Mixpanel", Icon: SiMixpanel, color: "#7856FF" },
      { name: "Sentry", Icon: SiSentry, color: "#362D59" },
    ],
  },
  {
    key: "maps",
    logos: [{ name: "Mapbox", Icon: SiMapbox, color: null }],
  },
  {
    key: "stack",
    logos: [
      { name: "Flutter", Icon: SiFlutter, color: "#02569B" },
      { name: "Dart", Icon: SiDart, color: "#0175C2" },
    ],
  },
  {
    key: "stores",
    logos: [
      { name: "App Store", Icon: SiAppstore, color: "#0D96F6" },
      { name: "Google Play", Icon: SiGoogleplay, color: null },
    ],
  },
];

const cardShadowClass = cn(
  "shadow-[0_1px_2px_rgba(4,43,89,0.04),0_6px_16px_-10px_rgba(4,43,89,0.12)]",
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

const COLUMN_COUNT = 9;
/** Deslocamento vertical de cada coluna (rem), criando o efeito de parede desorganizada. */
const COLUMN_OFFSETS = [0, 1.75, -1, 2.25, 0.5, -1.5, 1.25, 2.5, -0.5];

const tileNeutralClass = cn(
  "border border-border/70 bg-card",
  cardShadowClass,
);

function LogosGrid({ categories }: { categories: Category[] }) {
  const allLogos = categories.flatMap((cat) => cat.logos);

  const columns: Logo[][] = Array.from({ length: COLUMN_COUNT }, () => []);
  allLogos.forEach((logo, i) => {
    columns[i % COLUMN_COUNT].push(logo);
  });

  const wallMask =
    "radial-gradient(ellipse 78% 82% at 50% 50%, black 40%, transparent 100%)";

  return (
    <div
      className="relative w-full overflow-hidden"
      style={{
        maskImage: wallMask,
        WebkitMaskImage: wallMask,
      }}
    >
      <div className="flex w-full items-start justify-center gap-2 py-3 sm:gap-3.5 sm:py-5">
        {columns.map((column, colIndex) => (
          <div
            key={colIndex}
            className="flex flex-col gap-2 sm:gap-3.5"
            style={{
              transform: `translateY(${COLUMN_OFFSETS[colIndex % COLUMN_OFFSETS.length]}rem)`,
            }}
          >
            {column.map((logo, rowIndex) => {
              const iconColor = logo.color ?? "var(--foreground)";
              return (
                <div
                  key={`${logo.name}-${colIndex}-${rowIndex}`}
                  title={logo.name}
                  className={cn(
                    "flex size-12 shrink-0 items-center justify-center rounded-lg sm:size-16 sm:rounded-xl transition-transform hover:scale-110",
                    tileNeutralClass,
                  )}
                >
                  <span className="inline-flex origin-center scale-75 sm:scale-100">
                    <logo.Icon size={24} color={iconColor} />
                  </span>
                </div>
              );
            })}
          </div>
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
        "mx-auto flex w-full flex-col items-center relative overflow-hidden",
        "max-w-[min(96vw,76rem)]",
        "px-[clamp(0.75rem,2.5vw,2rem)] max-sm:px-[clamp(1rem,3.25vw,2rem)]",
        "mt-[var(--spacing-editor-to-features)] pb-[clamp(3rem,6vw,5rem)]",
      )}
    >
      <Reveal
        className={cn(
          "relative flex w-full flex-col items-center text-center",
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

      <Reveal delay={0.1} className="relative w-full">
        <LogosGrid categories={allIntegrations} />
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
