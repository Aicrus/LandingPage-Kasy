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

export default function Home() {
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
      <Marquee />
      <QualityStrip />
      <Testimonials />
      <Pricing />
      <Faq />
    </main>
  );
}
