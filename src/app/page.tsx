import {
  HeroIntro,
  HeroScreenReveal,
  ScrollPlayground,
} from "@/components/sections";

export default function Home() {
  return (
    <main className="bg-background">
      <HeroScreenReveal>
        <HeroIntro />
      </HeroScreenReveal>
      <ScrollPlayground />
    </main>
  );
}
