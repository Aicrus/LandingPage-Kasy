import Link from "next/link";
import { Check } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Plan = {
  label: string;
  price: string;
  per: string;
  tag?: string;
  featured?: boolean;
  cta: string;
  features: string[];
};

const PLANS: Plan[] = [
  {
    label: "Anual",
    price: "$127",
    per: "/ ano",
    cta: "Começar agora",
    features: [
      "Firebase, Supabase & REST API",
      "Apps ilimitados",
      "60+ componentes de UI (95+ variantes)",
      "Todos os recursos opcionais",
      "Atualizações por 1 ano",
      "Suporte da comunidade",
    ],
  },
  {
    label: "Kit + Curso",
    price: "$227",
    per: "único pagamento",
    tag: "Mais popular",
    featured: true,
    cta: "Quero o Kit + Curso",
    features: [
      "Tudo do plano Anual",
      "Curso completo por 1 ano de acesso",
      "Da ideia ao app publicado em 7 dias",
      "Feito para não desenvolvedores",
      "Comunidade exclusiva de criadores",
      "Suporte prioritário",
    ],
  },
];

const cardShadowClass = cn(
  "shadow-[0_1px_2px_rgba(26,30,44,0.04),0_6px_16px_-10px_rgba(26,30,44,0.12)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_20px_-10px_rgba(0,0,0,0.4)]",
);

const featuredShadowClass = cn(
  "shadow-[0_4px_10px_rgba(26,30,44,0.06),0_24px_56px_-20px_rgba(26,30,44,0.22)]",
  "dark:shadow-[0_4px_14px_rgba(0,0,0,0.28),0_28px_60px_-20px_rgba(0,0,0,0.5)]",
);

function PlanCard({ plan }: { plan: Plan }) {
  return (
    <div
      className={cn(
        "relative flex flex-col rounded-2xl border p-6 transition-[transform,box-shadow] duration-300 sm:p-7",
        plan.featured
          ? cn(
              "border-primary/40 bg-card sm:-translate-y-2",
              featuredShadowClass,
            )
          : cn("border-border/70 bg-card hover:-translate-y-1", cardShadowClass),
      )}
    >
      {plan.featured && plan.tag ? (
        <span
          className={cn(
            "absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full border border-border/70 bg-background px-3.5 py-1 text-xs font-semibold whitespace-nowrap text-foreground",
            "shadow-[0_4px_14px_-4px_rgba(0,0,0,0.2)]",
          )}
        >
          {plan.tag}
        </span>
      ) : null}

      <div className="flex items-center gap-2">
        <h3 className="font-heading text-[1.1875rem] font-semibold text-foreground">
          {plan.label}
        </h3>
        {!plan.featured && plan.tag ? (
          <span className="rounded-full border border-border/70 bg-muted px-2.5 py-0.5 text-[0.6875rem] font-medium text-muted-foreground">
            {plan.tag}
          </span>
        ) : null}
      </div>

      <div className="mt-3.5 flex items-baseline gap-1.5">
        <span className="font-heading text-[2.375rem] font-bold tracking-[-0.025em] text-foreground">
          {plan.price}
        </span>
        <span className="text-sm text-muted-foreground">{plan.per}</span>
      </div>

      <Button
        variant={plan.featured ? "default" : "outline"}
        nativeButton={false}
        className="mt-6 h-auto w-full justify-center rounded-full py-2.5 text-[0.9375rem]"
        render={<Link href="/obter-kasy" />}
      >
        {plan.cta}
      </Button>

      <ul className="mt-6 flex flex-col gap-3">
        {plan.features.map((feature) => (
          <li
            key={feature}
            className="flex items-start gap-2.5 text-[0.875rem] text-foreground/85"
          >
            <Check
              className="mt-0.5 size-4 shrink-0 text-muted-foreground"
              strokeWidth={2.5}
            />
            {feature}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Pricing() {
  return (
    <section
      id="precos"
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
          "mb-[clamp(2.5rem,4.5vw,3.5rem)] px-[clamp(1.25rem,4vw,3.5rem)]",
        )}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Preços
        </span>
        <h2
          className={cn(
            "text-balance font-heading font-bold text-foreground",
            "text-[clamp(1.625rem,1.15rem+1.6vw,2.5rem)]",
            "leading-[1.12] tracking-[-0.02em]",
          )}
        >
          Invista uma vez. Construa para sempre.
        </h2>
        <p className="max-w-fluid-subtitle text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
          Cartões internacionais aceitos via Stripe. Acesso imediato, o kit é
          seu para sempre.
        </p>
      </Reveal>

      <Reveal
        delay={0.1}
        className="grid w-full max-w-[42rem] grid-cols-1 items-start gap-6 sm:grid-cols-2 sm:gap-5"
      >
        {PLANS.map((plan) => (
          <PlanCard key={plan.label} plan={plan} />
        ))}
      </Reveal>

      <p className="mt-8 max-w-md text-center text-[0.8125rem] text-muted-foreground">
        Checkout seguro via Stripe. Acesso imediato, o kit é seu para sempre.
      </p>
    </section>
  );
}
