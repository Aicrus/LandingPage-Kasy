import Link from "next/link";

import { KasyLogo } from "@/components/kasy-logo";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="w-full px-page-x py-4">
      <div className="mx-auto flex w-full max-w-header items-center justify-between">
        <Link href="/" className="rounded-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
          <KasyLogo />
        </Link>

        <nav className="flex items-center gap-5 sm:gap-6">
          <Link
            href="/documentacao"
            className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <span className="sm:hidden">Docs</span>
            <span className="hidden sm:inline">Documentação</span>
          </Link>
          <Button
            variant="outline"
            className="h-auto rounded-full p-4"
            render={<Link href="/obter-kasy" />}
          >
            Obter Kasy Pro
          </Button>
        </nav>
      </div>
    </header>
  );
}
