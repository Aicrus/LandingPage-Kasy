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
    <div className="mx-auto w-full max-w-[min(96vw,46rem)] px-page-x pb-24 pt-[calc(var(--header-height-mobile)+1.75rem)] lg:max-w-[min(94vw,56rem)] lg:pb-32 lg:pt-16 xl:max-w-[min(96vw,80rem)] 2xl:max-w-[84rem]">
      <ChangelogHashScroll />

      <header className="mb-14 space-y-3 md:mb-20 xl:mx-auto xl:mb-24 xl:max-w-[44rem] xl:text-center 2xl:max-w-[48rem]">
        <h1 className="font-heading text-[clamp(2rem,4vw,2.75rem)] font-bold leading-[1.08] tracking-[-0.025em] text-foreground xl:text-[clamp(2.25rem,3.2vw,3rem)]">
          {copy.title}
        </h1>
        <p className="max-w-[34rem] text-[0.9375rem] leading-relaxed text-muted-foreground xl:mx-auto xl:max-w-[38rem] xl:text-base">
          {copy.subtitle}
        </p>
      </header>

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
