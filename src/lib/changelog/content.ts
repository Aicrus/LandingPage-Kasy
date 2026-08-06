import type { ChangelogEntry, ChangelogPageCopy, SiteLocale } from "./types";

const DRIVE_VIDEO =
  "https://vz-fc29a166-b94.b-cdn.net/a2787388-4456-4446-88fb-c0de05d10517/play_720p.mp4";

const MCP_VIDEO =
  "https://vz-fc29a166-b94.b-cdn.net/cf0f5640-60d1-4bd6-bd68-76d007aa2036/play_720p.mp4";

const PAGE_COPY: Record<SiteLocale, ChangelogPageCopy> = {
  pt: {
    metadata: {
      title: "Changelog | Kasy",
      description:
        "Novos recursos do kit Flutter Kasy: Drive, MCP, widget nativo e Preview Device.",
    },
    title: "Changelog",
    subtitle: "Lançamentos de features no kit. CLI, app e documentação.",
    docCta: "Ver documentação",
    copyLinkLabel: "Copiar link",
    copiedLinkLabel: "Link copiado",
  },
  en: {
    metadata: {
      title: "Changelog | Kasy",
      description:
        "New Kasy Flutter kit features: Drive, MCP, home widget, and Preview Device.",
    },
    title: "Changelog",
    subtitle: "Feature launches in the kit. CLI, app, and docs.",
    docCta: "View documentation",
    copyLinkLabel: "Copy link",
    copiedLinkLabel: "Link copied",
  },
  es: {
    metadata: {
      title: "Changelog | Kasy",
      description:
        "Nuevas funciones del kit Flutter Kasy: Drive, MCP, widget nativo y Preview Device.",
    },
    title: "Changelog",
    subtitle: "Lanzamientos de features en el kit. CLI, app y documentación.",
    docCta: "Ver documentación",
    copyLinkLabel: "Copiar enlace",
    copiedLinkLabel: "Enlace copiado",
  },
};

const ENTRIES: Record<SiteLocale, ChangelogEntry[]> = {
  pt: [
    {
      id: "preview-device",
      date: "2026-05-28",
title: "Preview Device",
      summary:
        "Desenvolva e inspecione seu app no navegador com fidelidade de dispositivo real.",
      paragraphs: [
        "Troque entre iPhone, Android, iPad e Desktop sem sair do editor. Auth, onboarding e guest seguem o fluxo nativo.",
      ],
      bullets: [
        {
          label: "Quatro perfis",
          text: "iPhone, Android, iPad e Desktop.",
        },
        {
          label: "No browser",
          text: "Roda com kasy run --web em todo projeto gerado.",
        },
      ],
      media: {
        type: "image",
        layout: "wide",
        src: "/changelog/preview-device.png",
        alt: "Preview Device do Kasy no navegador",
        width: 2940,
        height: 1680,
      },
      docHref: "/docs/referencia/guia-web",
    },
    {
      id: "home-widget",
      date: "2026-06-10",
title: "Widget na tela inicial",
      summary:
        "Widgets nativos no iOS e Android, sincronizados com o estado do app.",
      paragraphs: [
        "Extensão nativa pronta, atualização em segundo plano e App Groups no iOS. Ligue com kasy add widget.",
      ],
      bullets: [
        {
          label: "iOS e Android",
          text: "Mesmo contrato no kit, sem reescrever nativo do zero.",
        },
        {
          label: "Sincronizado",
          text: "O widget reflete dados reais do app, como assinatura ativa.",
        },
      ],
      docHref: "/docs/funcionalidades/widget",
    },
    {
      id: "mcp-kasy",
      date: "2026-06-24",
title: "MCP Kasy",
      summary:
        "Mais de 40 tools no chat. A IA usa a CLI real do Kasy, sem improvisar estrutura.",
      paragraphs: [
        "Cursor, Claude Desktop e outras IDEs compatíveis. Peça para preparar a máquina, criar o app ou adicionar uma feature.",
      ],
      bullets: [
        {
          label: "+40 tools",
          text: "Projeto, deploy, branding, kanban e mais.",
        },
        {
          label: "Um instalador",
          text: "curl kasy.dev/install configura CLI e MCP juntos.",
        },
      ],
      media: {
        type: "mp4",
        src: MCP_VIDEO,
        title: "Demonstração do MCP Kasy",
        autoplayInView: true,
        loop: true,
      },
      docHref: "/docs/mcp",
    },
    {
      id: "drive",
      date: "2026-07-14",
title: "Drive",
      summary:
        "Fluxo completo de motorista e passageiro, pronto como um app de corridas.",
      paragraphs: [
        "Mapa Mapbox, estimativa de preço no servidor e UI no padrão Kasy. iOS, Android e Web nos três backends.",
      ],
      bullets: [
        {
          label: "Dois papéis",
          text: "Passageiro e motorista com onboarding e histórico.",
        },
        {
          label: "Um comando",
          text: "kasy add drive liga o módulo com Mapbox configurado.",
        },
      ],
      media: {
        type: "mp4",
        src: DRIVE_VIDEO,
        title: "Demonstração do fluxo Drive",
        startAt: 17,
        autoplayInView: true,
        loop: true,
      },
      docHref: "/docs/funcionalidades/drive",
    },
  ],
  en: [
    {
      id: "preview-device",
      date: "2026-05-28",
title: "Preview Device",
      summary:
        "Build and inspect your app in the browser with real device fidelity.",
      paragraphs: [
        "Switch between iPhone, Android, iPad, and Desktop without leaving the editor. Auth, onboarding, and guest follow the native flow.",
      ],
      bullets: [
        {
          label: "Four profiles",
          text: "iPhone, Android, iPad, and Desktop.",
        },
        {
          label: "In the browser",
          text: "Runs with kasy run --web in every generated project.",
        },
      ],
      media: {
        type: "image",
        layout: "wide",
        src: "/changelog/preview-device.png",
        alt: "Kasy Preview Device in the browser",
        width: 2940,
        height: 1680,
      },
      docHref: "/docs/referencia/guia-web",
    },
    {
      id: "home-widget",
      date: "2026-06-10",
title: "Home-screen widget",
      summary: "Native iOS and Android widgets, kept in sync with app state.",
      paragraphs: [
        "Ready native extension, background updates, and App Groups on iOS. Enable with kasy add widget.",
      ],
      bullets: [
        {
          label: "iOS and Android",
          text: "Same kit contract without rewriting native code from scratch.",
        },
        {
          label: "Synced",
          text: "The widget reflects real app data such as active subscription.",
        },
      ],
      docHref: "/docs/funcionalidades/widget",
    },
    {
      id: "mcp-kasy",
      date: "2026-06-24",
title: "Kasy MCP",
      summary: "40+ tools in chat. AI uses the real Kasy CLI, no improvised structure.",
      paragraphs: [
        "Cursor, Claude Desktop, and other compatible IDEs. Ask to prepare your machine, create the app, or add a feature.",
      ],
      bullets: [
        {
          label: "40+ tools",
          text: "Project, deploy, branding, kanban, and more.",
        },
        {
          label: "One installer",
          text: "curl kasy.dev/install sets up CLI and MCP together.",
        },
      ],
      media: {
        type: "mp4",
        src: MCP_VIDEO,
        title: "Kasy MCP demo",
        autoplayInView: true,
        loop: true,
      },
      docHref: "/docs/mcp",
    },
    {
      id: "drive",
      date: "2026-07-14",
title: "Drive",
      summary:
        "Full driver and passenger flow, ready like a ride-hailing app.",
      paragraphs: [
        "Mapbox map, server-side price estimate, and Kasy-standard UI. iOS, Android, and Web across all three backends.",
      ],
      bullets: [
        {
          label: "Two roles",
          text: "Passenger and driver with onboarding and history.",
        },
        {
          label: "One command",
          text: "kasy add drive enables the module with Mapbox configured.",
        },
      ],
      media: {
        type: "mp4",
        src: DRIVE_VIDEO,
        title: "Drive flow demo",
        startAt: 17,
        autoplayInView: true,
        loop: true,
      },
      docHref: "/docs/funcionalidades/drive",
    },
  ],
  es: [
    {
      id: "preview-device",
      date: "2026-05-28",
title: "Preview Device",
      summary:
        "Desarrolla e inspecciona tu app en el navegador con fidelidad de dispositivo real.",
      paragraphs: [
        "Cambia entre iPhone, Android, iPad y Desktop sin salir del editor. Auth, onboarding y guest siguen el flujo nativo.",
      ],
      bullets: [
        {
          label: "Cuatro perfiles",
          text: "iPhone, Android, iPad y Desktop.",
        },
        {
          label: "En el navegador",
          text: "Corre con kasy run --web en todo proyecto generado.",
        },
      ],
      media: {
        type: "image",
        layout: "wide",
        src: "/changelog/preview-device.png",
        alt: "Preview Device de Kasy en el navegador",
        width: 2940,
        height: 1680,
      },
      docHref: "/docs/referencia/guia-web",
    },
    {
      id: "home-widget",
      date: "2026-06-10",
title: "Widget en la pantalla de inicio",
      summary:
        "Widgets nativos en iOS y Android, sincronizados con el estado de la app.",
      paragraphs: [
        "Extensión nativa lista, actualización en segundo plano y App Groups en iOS. Actívalo con kasy add widget.",
      ],
      bullets: [
        {
          label: "iOS y Android",
          text: "Mismo contrato del kit sin reescribir nativo desde cero.",
        },
        {
          label: "Sincronizado",
          text: "El widget refleja datos reales de la app, como suscripción activa.",
        },
      ],
      docHref: "/docs/funcionalidades/widget",
    },
    {
      id: "mcp-kasy",
      date: "2026-06-24",
title: "MCP Kasy",
      summary:
        "Más de 40 tools en el chat. La IA usa la CLI real de Kasy, sin improvisar estructura.",
      paragraphs: [
        "Cursor, Claude Desktop y otras IDEs compatibles. Pide preparar la máquina, crear la app o agregar una feature.",
      ],
      bullets: [
        {
          label: "+40 tools",
          text: "Proyecto, deploy, branding, kanban y más.",
        },
        {
          label: "Un instalador",
          text: "curl kasy.dev/install configura CLI y MCP juntos.",
        },
      ],
      media: {
        type: "mp4",
        src: MCP_VIDEO,
        title: "Demostración del MCP Kasy",
        autoplayInView: true,
        loop: true,
      },
      docHref: "/docs/mcp",
    },
    {
      id: "drive",
      date: "2026-07-14",
title: "Drive",
      summary:
        "Flujo completo de conductor y pasajero, listo como una app de viajes.",
      paragraphs: [
        "Mapa Mapbox, estimación de precio en el servidor y UI al estándar Kasy. iOS, Android y Web en los tres backends.",
      ],
      bullets: [
        {
          label: "Dos roles",
          text: "Pasajero y conductor con onboarding e historial.",
        },
        {
          label: "Un comando",
          text: "kasy add drive activa el módulo con Mapbox configurado.",
        },
      ],
      media: {
        type: "mp4",
        src: DRIVE_VIDEO,
        title: "Demostración del flujo Drive",
        startAt: 17,
        autoplayInView: true,
        loop: true,
      },
      docHref: "/docs/funcionalidades/drive",
    },
  ],
};

export function getChangelogPageCopy(locale: string): ChangelogPageCopy {
  if (locale in PAGE_COPY) {
    return PAGE_COPY[locale as SiteLocale];
  }
  return PAGE_COPY.en;
}

export function getChangelogEntries(locale: string): ChangelogEntry[] {
  const entries =
    locale in ENTRIES ? ENTRIES[locale as SiteLocale] : ENTRIES.en;
  return [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function formatChangelogDate(date: string, locale: string): string {
  const parsed = new Date(`${date}T12:00:00`);
  return new Intl.DateTimeFormat(locale, {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}
