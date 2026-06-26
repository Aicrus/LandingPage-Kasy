/* ----------------------------------------------------------------------------
 * Seção de teste — bloco de texto longo usado para validar o scroll, a
 * transição vinda da pasta e o comportamento do header ao rolar.
 * -------------------------------------------------------------------------- */
const PARAGRAPHS = [
  "Olá, tudo bom? Seja muito bem-vindo. Como é que você está hoje? Esperamos que a sua jornada por aqui seja leve, agradável e cheia de boas descobertas.",
  "Boa tarde! Este é um espaço reservado apenas para testes de rolagem. Role para cima e para baixo à vontade e observe como os elementos da seção anterior reagem ao movimento.",
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.",
  "Nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident.",
  "Sunt in culpa qui officia deserunt mollit anim id est laborum. E mais uma vez: olá, tudo bem? Continue rolando — ainda há bastante texto pela frente para esticar bem a página.",
  "Curabitur pretium tincidunt lacus. Nulla gravida orci a odio. Nullam varius, turpis et commodo pharetra, est eros bibendum elit, nec luctus magna felis sollicitudin mauris.",
];

export function ScrollPlayground() {
  return (
    <section className="relative bg-background px-page-x py-32 sm:py-40">
      <div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
        <h2 className="font-heading text-fluid-display text-foreground">
          Área de testes
        </h2>
        <p className="font-rounded text-fluid-subtitle text-muted-foreground">
          Texto longo apenas para esticar a página e validar a rolagem.
        </p>

        {PARAGRAPHS.map((text, i) => (
          <p
            key={i}
            className="font-rounded text-lg leading-relaxed text-muted-foreground"
          >
            {text}
          </p>
        ))}
      </div>
    </section>
  );
}
