import { ChangelogCopyLink } from "@/components/changelog/changelog-copy-link";
import { ChangelogMediaBlock } from "@/components/changelog/changelog-media";
import { Link } from "@/i18n/navigation";
import type { ChangelogEntry } from "@/lib/changelog";
import { formatChangelogDate } from "@/lib/changelog";
import { cn } from "@/lib/utils";

type ChangelogEntryBlockProps = {
  entry: ChangelogEntry;
  locale: string;
  docCta: string;
  copyLinkLabel: string;
  copiedLinkLabel: string;
  isFirst?: boolean;
};

export function ChangelogEntryBlock({
  entry,
  locale,
  docCta,
  copyLinkLabel,
  copiedLinkLabel,
  isFirst = false,
}: ChangelogEntryBlockProps) {
  const formattedDate = formatChangelogDate(entry.date, locale);

  return (
    <article
      id={entry.id}
      className={cn(
        "grid gap-4 scroll-mt-[calc(var(--header-height-mobile)+0.75rem)] sm:scroll-mt-28",
        "md:grid-cols-[7.5rem_minmax(0,1fr)] md:gap-x-12 md:gap-y-0",
        "xl:grid-cols-[minmax(14rem,20rem)_minmax(0,44rem)_minmax(0,1fr)] xl:gap-x-0",
        "2xl:grid-cols-[minmax(16rem,24rem)_minmax(0,48rem)_minmax(0,1fr)]",
        !isFirst && "border-t border-border/50 pt-12 md:pt-16 xl:pt-20",
      )}
    >
      <div
        className={cn(
          "md:sticky md:top-28 md:self-start",
          "xl:col-start-1 xl:flex xl:justify-start xl:pl-0 xl:text-left",
        )}
      >
        <time
          dateTime={entry.date}
          className="block text-[0.8125rem] tabular-nums text-muted-foreground xl:text-[0.875rem]"
        >
          {formattedDate}
        </time>
      </div>

      <div className="min-w-0 space-y-6 md:space-y-7 xl:col-start-2 xl:space-y-8 2xl:space-y-9">
        <header className="space-y-3 xl:space-y-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="min-w-0 font-heading text-[1.625rem] font-bold leading-tight tracking-[-0.02em] text-foreground md:text-[1.75rem] xl:text-[2rem] 2xl:text-[2.125rem]">
              {entry.title}
            </h2>
            <ChangelogCopyLink
              entryId={entry.id}
              copyLabel={copyLinkLabel}
              copiedLabel={copiedLinkLabel}
            />
          </div>
          <p className="text-[0.9375rem] leading-relaxed text-muted-foreground xl:text-base xl:leading-[1.7]">
            {entry.summary}
          </p>
        </header>

        {entry.paragraphs.length > 0 ? (
          <div className="space-y-3 text-[0.9375rem] leading-[1.7] text-foreground/88 xl:text-base xl:leading-[1.75]">
            {entry.paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        ) : null}

        {entry.bullets && entry.bullets.length > 0 ? (
          <ul className="space-y-2.5 text-[0.9375rem] leading-[1.65] text-foreground/88 xl:space-y-3 xl:text-base xl:leading-[1.7]">
            {entry.bullets.map((bullet) => (
              <li key={bullet.label}>
                <span className="font-semibold text-foreground">{bullet.label}</span>
                <span className="text-foreground/80"> {bullet.text}</span>
              </li>
            ))}
          </ul>
        ) : null}

        {entry.media ? (
          <ChangelogMediaBlock media={entry.media} locale={locale} />
        ) : null}

        {entry.docHref ? (
          <p>
            <Link
              href={entry.docHref}
              className="text-[0.8125rem] font-medium text-muted-foreground underline-offset-4 transition-colors hover:text-foreground hover:underline xl:text-[0.875rem]"
            >
              {docCta}
            </Link>
          </p>
        ) : null}
      </div>
    </article>
  );
}
