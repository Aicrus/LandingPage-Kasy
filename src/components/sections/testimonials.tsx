"use client";

import { Fragment } from "react";

import { Reveal } from "@/components/motion/reveal";
import { motion, useReducedMotion } from "@/lib/motion";
import { cn } from "@/lib/utils";

type Testimonial = {
  text: string;
  name: string;
  role: string;
};

const AVATAR_COLORS = [
  "#2563eb",
  "#7c3aed",
  "#f59e0b",
  "#059669",
  "#0d9488",
  "#db2777",
  "#9333ea",
  "#0891b2",
  "#e11d48",
];

const TESTIMONIALS: Testimonial[] = [
  {
    text: "Publiquei meu primeiro app em 6 dias. O CLI já tinha configurado Firebase, auth e pagamentos antes de eu abrir o editor.",
    name: "Lucas Almeida",
    role: "Desenvolvedor indie",
  },
  {
    text: "Não sou desenvolvedora e mesmo assim coloquei um app real nas duas lojas. O Kasy me guiou em cada passo.",
    name: "Marina Costa",
    role: "Fundadora",
  },
  {
    text: "Só o preview no navegador já me poupou horas. Sem emulador — iOS e Android lado a lado, direto no browser.",
    name: "Diego Fernández",
    role: "Engenheiro mobile",
  },
  {
    text: "Migrei um projeto de cliente para Supabase em minutos. Mesmo código, outro backend. Impressionante.",
    name: "Priya Nair",
    role: "Freelancer",
  },
  {
    text: "RevenueCat, push e analytics já vinham prontos. Eu só construí minhas features e publiquei.",
    name: "Tom Becker",
    role: "Founder solo",
  },
  {
    text: "Atualizações pelo CLI sem quebrar o que já estava no ar. Nenhum outro kit faz isso.",
    name: "Sofia Rossi",
    role: "Engenheira de produto",
  },
  {
    text: "Da ideia ao TestFlight em uma semana. A galeria de componentes tornou a UI a parte mais fácil.",
    name: "Akira Tanaka",
    role: "Designer & builder",
  },
  {
    text: "Um stack, três backends. Escolhi Firebase, o cliente quis REST. Zero reescrita.",
    name: "Hannah Müller",
    role: "Líder de agência",
  },
  {
    text: "As regras para editores com IA fizeram o Cursor parecer que já conhecia o projeto Kasy inteiro.",
    name: "Rafael Santos",
    role: "Dev full-stack",
  },
];

const cardShadowClass = cn(
  "shadow-[0_1px_2px_rgba(26,30,44,0.04),0_6px_16px_-10px_rgba(26,30,44,0.12)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_20px_-10px_rgba(0,0,0,0.4)]",
);

function initials(name: string) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function TestimonialCard({
  testimonial,
  colorIndex,
}: {
  testimonial: Testimonial;
  colorIndex: number;
}) {
  const color = AVATAR_COLORS[colorIndex % AVATAR_COLORS.length];

  return (
    <div
      className={cn(
        "rounded-2xl border border-border/70 bg-card p-6",
        cardShadowClass,
      )}
    >
      <p className="text-[0.9rem] leading-[1.6] text-foreground/85">
        {testimonial.text}
      </p>
      <div className="mt-4 flex items-center gap-2.5">
        <span
          aria-hidden
          className="flex size-9 shrink-0 items-center justify-center rounded-full text-[0.75rem] font-semibold text-white"
          style={{ backgroundColor: color }}
        >
          {initials(testimonial.name)}
        </span>
        <div className="min-w-0 leading-tight">
          <p className="truncate text-[0.8125rem] font-semibold text-foreground">
            {testimonial.name}
          </p>
          <p className="truncate text-[0.75rem] text-muted-foreground">
            {testimonial.role}
          </p>
        </div>
      </div>
    </div>
  );
}

function TestimonialsColumn({
  testimonials,
  duration,
  offset,
  className,
}: {
  testimonials: Testimonial[];
  duration: number;
  offset: number;
  className?: string;
}) {
  const reducedMotion = useReducedMotion();

  return (
    <div className={cn("flex flex-col gap-5", className)}>
      <motion.div
        animate={reducedMotion ? undefined : { translateY: "-50%" }}
        transition={{
          duration,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        className="flex flex-col gap-5"
      >
        {[0, 1].map((group) => (
          <Fragment key={group}>
            {testimonials.map((testimonial, i) => (
              <TestimonialCard
                key={`${group}-${testimonial.name}`}
                testimonial={testimonial}
                colorIndex={offset + i}
              />
            ))}
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}

export function Testimonials() {
  const col1 = TESTIMONIALS.slice(0, 3);
  const col2 = TESTIMONIALS.slice(3, 6);
  const col3 = TESTIMONIALS.slice(6, 9);

  return (
    <section
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
          "mb-[clamp(2rem,4vw,3rem)] px-[clamp(1.25rem,4vw,3.5rem)]",
        )}
      >
        <span className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Depoimentos
        </span>
        <h2
          className={cn(
            "text-balance font-heading font-bold text-foreground",
            "text-[clamp(1.625rem,1.15rem+1.6vw,2.5rem)]",
            "leading-[1.12] tracking-[-0.02em]",
          )}
        >
          Amado por quem constrói e publica{" "}
          <span className="text-[#16a34a] dark:text-[#4ade80]">rápido.</span>
        </h2>
        <p className="max-w-fluid-subtitle text-pretty font-rounded text-fluid-subtitle text-muted-foreground">
          Desenvolvedores e fundadores indo da ideia para a App Store em dias,
          não meses.
        </p>
      </Reveal>

      <Reveal
        delay={0.1}
        className={cn(
          "relative grid w-full max-w-[64rem] grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3",
          "h-[36rem] overflow-hidden",
          "[mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]",
          "[-webkit-mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)]",
        )}
      >
        <TestimonialsColumn testimonials={col1} duration={22} offset={0} />
        <TestimonialsColumn
          testimonials={col2}
          duration={28}
          offset={3}
          className="hidden sm:flex"
        />
        <TestimonialsColumn
          testimonials={col3}
          duration={25}
          offset={6}
          className="hidden lg:flex"
        />
      </Reveal>
    </section>
  );
}
