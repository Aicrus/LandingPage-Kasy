import { ChangelogEntryBlock } from "@/components/changelog/changelog-entry";
import { ChangelogHashScroll } from "@/components/changelog/changelog-hash-scroll";
import type { ChangelogEntry, ChangelogPageCopy } from "@/lib/changelog";

type ChangelogTimelineProps = {
  copy: ChangelogPageCopy;
  entries: ChangelogEntry[];
  locale: string;
};

export function ChangelogTimeline({ copy, entries, locale }: ChangelogTimelineProps) {
  return (
    <div className="mx-auto w-full max-w-[min(96vw,46rem)] px-page-x pb-24 pt-[calc(var(--header-height-mobile)+5rem)] lg:max-w-[min(94vw,56rem)] lg:pb-32 lg:pt-28 xl:max-w-[min(96vw,80rem)] 2xl:max-w-[84rem]">
      <ChangelogHashScroll />

      <div className="space-y-12 md:space-y-16 xl:space-y-20">
        {entries.map((entry, index) => (
          <ChangelogEntryBlock
            key={entry.id}
            entry={entry}
            locale={locale}
            docCta={copy.docCta}
            copyLinkLabel={copy.copyLinkLabel}
            copiedLinkLabel={copy.copiedLinkLabel}
            isFirst={index === 0}
          />
        ))}
      </div>
    </div>
  );
}
