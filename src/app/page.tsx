export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background px-page-x py-page-y">
      <div className="mx-auto flex w-full flex-col items-center gap-stack text-center">
        <h1 className="max-w-fluid-title text-balance text-fluid-display text-foreground">
          <span className="block">Olá, mundo.</span>
          <span className="block text-muted-foreground">Veja como fica.</span>
        </h1>

        <p className="max-w-fluid-body text-pretty text-fluid-body text-muted-foreground">
          Redimensione a janela do navegador para ver o texto e o layout se
          adaptarem.
        </p>
      </div>
    </main>
  );
}
