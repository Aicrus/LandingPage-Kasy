import type { Metadata } from "next";
import { hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";

import { ChangelogTimeline } from "@/components/changelog/changelog-timeline";
import { ChangelogVersionBanner } from "@/components/changelog/changelog-version-banner";
import { routing } from "@/i18n/routing";
import {
  getChangelogEntries,
  getChangelogPageCopy,
  getKasyVersions,
} from "@/lib/changelog";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = getChangelogPageCopy(locale);

  return {
    title: copy.metadata.title,
    description: copy.metadata.description,
  };
}

export default async function ChangelogPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const copy = getChangelogPageCopy(locale);
  const entries = getChangelogEntries(locale);
  const versions = await getKasyVersions();

  return (
    <main className="bg-background pb-14">
      <ChangelogTimeline copy={copy} entries={entries} locale={locale} />
      <ChangelogVersionBanner copy={copy.versions} versions={versions} />
    </main>
  );
}
