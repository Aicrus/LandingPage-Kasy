export type KasyVersions = {
  cli: string;
  mcp: string;
};

// Emergency fallback only, used if the npm registry is unreachable at request
// time. Not a source of truth — nobody needs to bump this on release.
const FALLBACK_VERSIONS: KasyVersions = {
  cli: "1.70.0",
  mcp: "0.15.0",
};

async function fetchLatestVersion(pkg: string): Promise<string | null> {
  try {
    const res = await fetch(`https://registry.npmjs.org/${pkg}/latest`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    const version = (data as { version?: unknown })?.version;
    return typeof version === "string" ? version : null;
  } catch {
    return null;
  }
}

export async function getKasyVersions(): Promise<KasyVersions> {
  const [cli, mcp] = await Promise.all([
    fetchLatestVersion("kasy-cli"),
    fetchLatestVersion("kasy-mcp"),
  ]);
  return {
    cli: cli ?? FALLBACK_VERSIONS.cli,
    mcp: mcp ?? FALLBACK_VERSIONS.mcp,
  };
}
