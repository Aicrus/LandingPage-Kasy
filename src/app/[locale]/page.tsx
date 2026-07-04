import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import {
  AppShowcase,
  Faq,
  FeatureHoverCards,
  HeroIntro,
  HeroScreenReveal,
  IntegrationsShowcase,
  Marquee,
  Pricing,
  QualityStrip,
  Testimonials,
  VideoShowcase,
  WhatYouGet,
} from "@/components/sections";
import { routing } from "@/i18n/routing";

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
      <WhatYouGet />
      <AppShowcase />
      <QualityStrip />
      <Testimonials />
      <Pricing />
      <Marquee />
      <Faq />
    </main>
  );
}
