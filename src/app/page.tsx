import { HeroIntro, ScrollPlayground } from "@/components/sections";

export default function Home() {
  return (
    <main className="bg-background">
      <section className="flex min-h-screen flex-col items-center px-page-x pt-[calc(var(--spacing-hero-inset-top)+var(--header-height-mobile))] sm:pt-hero-inset-top">
        <HeroIntro />
      </section>
      <ScrollPlayground />
    </main>
  );
}
