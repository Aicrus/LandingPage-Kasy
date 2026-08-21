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
    docCta: "Ver documentação",
    copyLinkLabel: "Copiar link",
    copiedLinkLabel: "Link copiado",
    versions: {
      cliLabel: "CLI",
      mcpLabel: "MCP",
      upgradeCommand: "kasy upgrade",
      upgradeNote: "Atualiza a CLI e o MCP para a última versão.",
      copyLabel: "Copiar comando",
      copiedLabel: "Comando copiado",
    },
  },
  en: {
    metadata: {
      title: "Changelog | Kasy",
      description:
        "New Kasy Flutter kit features: Drive, MCP, home widget, and Preview Device.",
    },
    docCta: "View documentation",
    copyLinkLabel: "Copy link",
    copiedLinkLabel: "Link copied",
    versions: {
      cliLabel: "CLI",
      mcpLabel: "MCP",
      upgradeCommand: "kasy upgrade",
      upgradeNote: "Updates the CLI and MCP to the latest version.",
      copyLabel: "Copy command",
      copiedLabel: "Command copied",
    },
  },
  es: {
    metadata: {
      title: "Changelog | Kasy",
      description:
        "Nuevas funciones del kit Flutter Kasy: Drive, MCP, widget nativo y Preview Device.",
    },
    docCta: "Ver documentación",
    copyLinkLabel: "Copiar enlace",
    copiedLinkLabel: "Enlace copiado",
    versions: {
      cliLabel: "CLI",
      mcpLabel: "MCP",
      upgradeCommand: "kasy upgrade",
      upgradeNote: "Actualiza la CLI y el MCP a la última versión.",
      copyLabel: "Copiar comando",
      copiedLabel: "Comando copiado",
    },
  },
};

const ENTRIES: Record<SiteLocale, ChangelogEntry[]> = {
  pt: [
    {
      id: "modular-kit",
      date: "2026-08-06",
      title: "Kit 100% modular",
      summary:
        "Cada funcionalidade do Kasy funciona de forma independente. Você escolhe o que usar, e pode remover depois sem medo de quebrar o projeto.",
      paragraphs: [
        "Auth, Settings, Push e o resto dos módulos deixaram de ser um pacote fechado. Desligue um deles e o app fica com um stub mínimo no lugar, sem import nem rota sobrando. Login social (Google, Apple, Facebook) só aparece na tela quando o provedor está de fato configurado.",
      ],
      bullets: [
        {
          label: "Você decide",
          text: "No Rápido ou no Avançado, escolha exatamente o que entra no projeto, nos três backends.",
        },
        {
          label: "Remove sem susto",
          text: "Desligar um módulo depois não deixa import, rota ou botão morto pra trás.",
        },
      ],
      docHref: "/docs/gerenciar/kasy-remove",
      command: {
        text: "kasy update core",
        note: "Projeto já criado? Sincronize o core.",
      },
    },
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
      command: {
        text: "kasy upgrade",
        note: "Já vem na CLI mais recente.",
      },
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
      command: {
        text: "kasy update widget",
        note: "Projeto já criado? Sincronize o módulo.",
      },
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
      command: {
        text: "kasy upgrade",
        note: "Atualiza a CLI e o MCP juntos.",
      },
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
      command: {
        text: "kasy update drive",
        note: "Projeto já criado? Sincronize o módulo.",
      },
    },
    {
      id: "background-location",
      date: "2026-08-19",
      title: "Localização em segundo plano",
      summary:
        "GPS continua atualizando mesmo com o app fechado ou minimizado, módulo independente, plugável no Drive.",
      paragraphs: [
        "Novo módulo standalone: rastreamento em background pra iOS e Android, sem depender do Drive. Se o Drive também estiver no projeto, ele passa a usar automaticamente. Sem lib paga, construído em cima do geolocator que já vem no kit.",
      ],
      bullets: [
        {
          label: "Funciona sozinho",
          text: "Não precisa do Drive, dá pra usar em qualquer app que precise saber a posição do usuário fora do app.",
        },
        {
          label: "Liga no Drive automaticamente",
          text: "Com os dois módulos ativos, o Drive passa a rastrear em background sem precisar mexer em mais nada.",
        },
      ],
      docHref: "/docs/funcionalidades/background-location",
      command: {
        text: "kasy add background_location",
        note: "Ativa o módulo, com as permissões nativas já configuradas.",
      },
    },
    {
      id: "wasm-web",
      date: "2026-08-20",
      title: "Web compilando em WebAssembly",
      summary:
        "Flutter 3.47 no kit, com o app compilando com flutter build web --wasm: até 2x mais rápido em tela com muita animação, com fallback automático pra JavaScript em navegador sem suporte.",
      paragraphs: [
        "O bloqueio pro Wasm era o bart, a lib de terceiro que cuidava da barra inferior e da sidebar do app. Trocamos pela navegação nativa do próprio go_router (o mesmo padrão já usado no Admin console), sem fork de dependência, sem gambiarra.",
        "O ganho é real e vem de dois lados: o compilador (dart2wasm) já acelera sozinho, sem configuração nenhuma. O ganho extra de renderização em múltiplas threads (skwasm) exige headers de servidor que podem interferir em login social via popup, então isso fica como opção manual, documentada, não como padrão forçado.",
        "Vale só pra projeto criado a partir de agora (kasy new). Projeto já existente segue no build normal (JavaScript) até a gente desenhar o caminho de atualização.",
      ],
      bullets: [
        {
          label: "Até 2x mais rápido",
          text: "Medido pelo próprio time do Flutter em tela com bastante reconstrução de widget.",
        },
        {
          label: "Sem risco pra quem não ativar",
          text: "--wasm é opcional; o build padrão continua JavaScript, sem mudança de comportamento.",
        },
      ],
      docHref: "/docs/publicar/web#webassembly-wasm",
    },
  ],
  en: [
    {
      id: "modular-kit",
      date: "2026-08-06",
      title: "100% modular kit",
      summary:
        "Every Kasy feature works on its own. Pick exactly what you want to use, and remove it later without worrying about breaking the project.",
      paragraphs: [
        "Auth, Settings, Push, and the rest of the modules stopped being a closed package. Turn one off and the app gets a minimal stub in its place, with no leftover import or route. Social login (Google, Apple, Facebook) only shows up on screen when the provider is actually configured.",
      ],
      bullets: [
        {
          label: "You decide",
          text: "Quick or Advanced, choose exactly what goes into the project, across all three backends.",
        },
        {
          label: "Remove with no surprises",
          text: "Turning a module off later leaves no orphan import, route, or dead button behind.",
        },
      ],
      docHref: "/docs/gerenciar/kasy-remove",
      command: {
        text: "kasy update core",
        note: "Already have the project? Sync core.",
      },
    },
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
      command: {
        text: "kasy upgrade",
        note: "Included in the latest CLI.",
      },
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
      command: {
        text: "kasy update widget",
        note: "Already have the project? Sync the module.",
      },
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
      command: {
        text: "kasy upgrade",
        note: "Updates the CLI and MCP together.",
      },
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
      command: {
        text: "kasy update drive",
        note: "Already have the project? Sync the module.",
      },
    },
    {
      id: "background-location",
      date: "2026-08-19",
      title: "Background location",
      summary:
        "GPS keeps updating even with the app closed or minimized, a standalone module, pluggable into Drive.",
      paragraphs: [
        "New standalone module: background tracking for iOS and Android, with no dependency on Drive. If Drive is also in the project, it's used automatically. No paid library, built on top of the geolocator package already in the kit.",
      ],
      bullets: [
        {
          label: "Works on its own",
          text: "Doesn't need Drive, usable in any app that needs to know the user's position outside the app.",
        },
        {
          label: "Wires into Drive automatically",
          text: "With both modules active, Drive starts tracking in the background with nothing else to configure.",
        },
      ],
      docHref: "/docs/funcionalidades/background-location",
      command: {
        text: "kasy add background_location",
        note: "Enables the module, with native permissions already configured.",
      },
    },
    {
      id: "wasm-web",
      date: "2026-08-20",
      title: "Web now compiles to WebAssembly",
      summary:
        "Flutter 3.47 in the kit, with the app compiling via flutter build web --wasm: up to 2x faster on screens with heavy animation, with an automatic fallback to JavaScript on browsers without support.",
      paragraphs: [
        "The blocker for Wasm was bart, the third-party library handling the app's bottom bar and sidebar. We replaced it with go_router's own native navigation (the same pattern already used in the Admin console), no forked dependency, no workaround.",
        "The gain is real and comes from two places: the compiler (dart2wasm) already speeds things up on its own, no configuration needed. The extra multithreaded rendering gain (skwasm) requires server headers that can interfere with social login via popup, so that stays a documented, manual opt-in rather than a forced default.",
        "This only applies to projects created from now on (kasy new). Existing projects keep building with JavaScript until we design an upgrade path.",
      ],
      bullets: [
        {
          label: "Up to 2x faster",
          text: "Measured by the Flutter team itself on screens with heavy widget rebuilds.",
        },
        {
          label: "No risk if you don't opt in",
          text: "--wasm is optional; the default build stays JavaScript, no behavior change.",
        },
      ],
      docHref: "/docs/publicar/web#webassembly-wasm",
    },
  ],
  es: [
    {
      id: "modular-kit",
      date: "2026-08-06",
      title: "Kit 100% modular",
      summary:
        "Cada función de Kasy funciona de forma independiente. Eliges exactamente lo que quieres usar, y puedes quitarlo después sin miedo a romper el proyecto.",
      paragraphs: [
        "Auth, Settings, Push y el resto de los módulos dejaron de ser un paquete cerrado. Apaga uno y la app queda con un stub mínimo en su lugar, sin import ni ruta sobrante. El login social (Google, Apple, Facebook) solo aparece en pantalla cuando el proveedor está realmente configurado.",
      ],
      bullets: [
        {
          label: "Tú decides",
          text: "En Rápido o en Avanzado, elige exactamente qué entra en el proyecto, en los tres backends.",
        },
        {
          label: "Quita sin sustos",
          text: "Apagar un módulo después no deja import, ruta ni botón muerto atrás.",
        },
      ],
      docHref: "/docs/gerenciar/kasy-remove",
      command: {
        text: "kasy update core",
        note: "¿Ya tienes el proyecto? Sincroniza el core.",
      },
    },
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
      command: {
        text: "kasy upgrade",
        note: "Ya viene en la CLI más reciente.",
      },
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
      command: {
        text: "kasy update widget",
        note: "¿Ya tienes el proyecto? Sincroniza el módulo.",
      },
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
      command: {
        text: "kasy upgrade",
        note: "Actualiza la CLI y el MCP juntos.",
      },
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
      command: {
        text: "kasy update drive",
        note: "¿Ya tienes el proyecto? Sincroniza el módulo.",
      },
    },
    {
      id: "background-location",
      date: "2026-08-19",
      title: "Ubicación en segundo plano",
      summary:
        "El GPS sigue actualizando incluso con la app cerrada o minimizada, módulo independiente, conectable al Drive.",
      paragraphs: [
        "Nuevo módulo independiente: rastreo en segundo plano para iOS y Android, sin depender del Drive. Si el Drive también está en el proyecto, se usa automáticamente. Sin librería paga, construido sobre el geolocator que ya viene en el kit.",
      ],
      bullets: [
        {
          label: "Funciona solo",
          text: "No necesita el Drive, se puede usar en cualquier app que necesite saber la posición del usuario fuera de la app.",
        },
        {
          label: "Se conecta al Drive automáticamente",
          text: "Con los dos módulos activos, el Drive empieza a rastrear en segundo plano sin nada más que configurar.",
        },
      ],
      docHref: "/docs/funcionalidades/background-location",
      command: {
        text: "kasy add background_location",
        note: "Activa el módulo, con los permisos nativos ya configurados.",
      },
    },
    {
      id: "wasm-web",
      date: "2026-08-20",
      title: "La web ahora compila a WebAssembly",
      summary:
        "Flutter 3.47 en el kit, con la app compilando vía flutter build web --wasm: hasta 2x más rápido en pantallas con mucha animación, con respaldo automático a JavaScript en navegadores sin soporte.",
      paragraphs: [
        "El bloqueo para Wasm era bart, la librería de terceros que manejaba la barra inferior y el sidebar de la app. La reemplazamos por la navegación nativa del propio go_router (el mismo patrón ya usado en la consola de Admin), sin fork de dependencia, sin parche.",
        "La ganancia es real y viene de dos lados: el compilador (dart2wasm) ya acelera solo, sin configuración. La ganancia extra de renderizado multithread (skwasm) exige headers de servidor que pueden interferir con el login social vía popup, así que queda como opción manual documentada, no como predeterminado forzado.",
        "Esto solo aplica a proyectos creados desde ahora (kasy new). Los proyectos existentes siguen compilando en JavaScript hasta que diseñemos un camino de actualización.",
      ],
      bullets: [
        {
          label: "Hasta 2x más rápido",
          text: "Medido por el propio equipo de Flutter en pantallas con mucha reconstrucción de widgets.",
        },
        {
          label: "Sin riesgo si no lo activas",
          text: "--wasm es opcional; el build predeterminado sigue en JavaScript, sin cambio de comportamiento.",
        },
      ],
      docHref: "/docs/publicar/web#webassembly-wasm",
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
