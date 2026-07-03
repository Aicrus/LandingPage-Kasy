"use client";

import { Accordion } from "@base-ui/react/accordion";
import { ChevronDown } from "lucide-react";

import { Reveal } from "@/components/motion/reveal";
import { cn } from "@/lib/utils";

type FaqItem = {
  id: string;
  question: string;
  answer: string;
};

const FAQ_ITEMS: FaqItem[] = [
  {
    id: "q1",
    question: "Preciso saber programar para usar o Kasy?",
    answer:
      "Conhecimento básico de desenvolvimento ajuda, mas o kit foi feito para ser acessível. Com o treinamento, você pode criar seu primeiro app do zero.",
  },
  {
    id: "q2",
    question: "Qual a diferença entre o Kasy e outros boilerplates?",
    answer:
      "Entregamos o único kit Flutter de ponta a ponta, da configuração técnica ao design das telas. Outros entregam uma coisa ou outra. Nossa CLI também entrega atualizações sem quebrar o projeto que você já criou.",
  },
  {
    id: "q3",
    question: "Posso usar o kit em vários projetos?",
    answer: "Sim. Todos os planos incluem apps ilimitados.",
  },
  {
    id: "q4",
    question: "E se eu já tiver um projeto em andamento?",
    answer:
      "O Kasy foi projetado para novos projetos, mas os componentes podem ser copiados manualmente para projetos existentes.",
  },
  {
    id: "q5",
    question: "O que acontece quando meu acesso anual vence?",
    answer:
      "Você pode renovar ou migrar para o acesso vitalício. Seu app continua funcionando. Você só deixa de receber atualizações.",
  },
  {
    id: "q6",
    question: "Em quais plataformas o app roda?",
    answer: "iOS, Android e Web. O suporte a Linux e Windows chegará em breve.",
  },
  {
    id: "q7",
    question: "O que é o treinamento?",
    answer:
      "Um curso prático para não desenvolvedores, que ensina você a criar um app completo em 7 dias usando o Kasy e ferramentas de IA como Cursor e Claude Code.",
  },
  {
    id: "q8",
    question: "Posso vender os apps que criar com o kit?",
    answer: "Sim. A licença é comercial em todos os planos.",
  },
  {
    id: "q9",
    question: "Posso pedir reembolso?",
    answer:
      "Depois que você tem acesso ao kit, o Kasy é seu para sempre. Por isso, as compras não são reembolsáveis. Tem dúvidas? Pergunte antes de comprar. Teremos prazer em ajudar. Em média, quem usa o Kasy publica o app em 7 dias.",
  },
];

const cardShadowClass = cn(
  "shadow-[0_1px_2px_rgba(26,30,44,0.04),0_6px_16px_-10px_rgba(26,30,44,0.12)]",
  "dark:shadow-[0_1px_2px_rgba(0,0,0,0.18),0_8px_20px_-10px_rgba(0,0,0,0.4)]",
);

export function Faq() {
  return (
    <section
      id="faq"
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
          FAQ
        </span>
        <h2
          className={cn(
            "text-balance font-heading font-bold text-foreground",
            "text-[clamp(1.625rem,1.15rem+1.6vw,2.5rem)]",
            "leading-[1.12] tracking-[-0.02em]",
          )}
        >
          Dúvidas, respondidas.
        </h2>
      </Reveal>

      <Reveal delay={0.1} className="w-full max-w-[46rem]">
        <Accordion.Root className="flex flex-col gap-3">
          {FAQ_ITEMS.map((item) => (
            <Accordion.Item
              key={item.id}
              value={item.id}
              className={cn(
                "overflow-hidden rounded-2xl border border-border/70 bg-card",
                cardShadowClass,
              )}
            >
              <Accordion.Header>
                <Accordion.Trigger
                  className={cn(
                    "group flex w-full items-center justify-between gap-4",
                    "px-5 py-4 sm:px-6 sm:py-[1.125rem]",
                    "text-left text-[0.9375rem] font-semibold text-foreground",
                    "cursor-pointer transition-colors duration-200 hover:bg-muted/50",
                    "outline-none focus-visible:bg-muted/50",
                  )}
                >
                  {item.question}
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-muted-foreground transition-transform duration-300",
                      "group-data-[panel-open]:rotate-180",
                    )}
                    strokeWidth={2.5}
                  />
                </Accordion.Trigger>
              </Accordion.Header>

              <Accordion.Panel
                className={cn(
                  "h-[var(--accordion-panel-height)] overflow-hidden",
                  "transition-[height] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                  "data-[starting-style]:h-0 data-[ending-style]:h-0",
                )}
              >
                <p className="px-5 pb-5 text-[0.875rem] leading-[1.6] text-muted-foreground sm:px-6 sm:pb-6">
                  {item.answer}
                </p>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion.Root>
      </Reveal>
    </section>
  );
}
