import {
  FeatureHoverCards,
  HeroIntro,
  HeroScreenReveal,
  IntegrationsShowcase,
  VideoShowcase,
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
    </main>
  );
}
