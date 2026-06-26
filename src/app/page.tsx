import { HeroIntro } from "@/components/sections";

export default function Home() {
  return (
    <main className="bg-background">
      <section className="flex min-h-screen flex-col items-center justify-center px-page-x pt-page-y-top pb-page-y-bottom">
        <HeroIntro />
      </section>

      <section className="flex min-h-[70vh] items-center px-page-x py-page-y">
        <p className="mx-auto max-w-fluid-title text-balance font-features-linear text-fluid-display text-muted-foreground">
          Tudo que você precisa para lançar — sem começar do zero.
        </p>
      </section>
    </main>
  );
}
