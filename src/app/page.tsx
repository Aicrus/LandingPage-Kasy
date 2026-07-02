import {
  FeatureHoverCards,
  HeroIntro,
  HeroScreenReveal,
  IntegrationsShowcase,
  KasyPunchline,
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
      <KasyPunchline />
      <WhatYouGet />
    </main>
  );
}
