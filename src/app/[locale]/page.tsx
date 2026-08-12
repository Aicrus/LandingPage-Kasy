import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import {
  AppShowcase,
  Faq,
  FeatureHoverCards,
  FeaturePhones,
  HeroIntro,
  HeroScreenReveal,
  IntegrationsShowcase,
  KitLivePreview,
  Marquee,
  McpShowcase,
  Pricing,
  QualityStrip,
  Testimonials,
  VideoShowcase,
  WhatYouGet,
} from "@/components/sections";
import { routing } from "@/i18n/routing";

/** Seção "Teste em tempo real" (KitLivePreview). Oculta até reativar. */
const SHOW_KIT_LIVE_PREVIEW = false;

export default async function Home({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  return (
    <main className="bg-background">
      <HeroScreenReveal>
        <HeroIntro />
      </HeroScreenReveal>
      <VideoShowcase />
      <FeatureHoverCards />
      <IntegrationsShowcase />
      {SHOW_KIT_LIVE_PREVIEW ? <KitLivePreview /> : null}
      <WhatYouGet />
      <FeaturePhones />
      <McpShowcase />
      <AppShowcase />
      <QualityStrip />
      <Testimonials />
      <Pricing />
      <Marquee />
      <Faq />
    </main>
  );
}
