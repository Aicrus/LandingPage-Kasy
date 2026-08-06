import type { routing } from "@/i18n/routing";

export type SiteLocale = (typeof routing.locales)[number];

export type ChangelogBullet = {
  label: string;
  text: string;
};

export type ChangelogImageMedia = {
  type: "image";
  src: string;
  srcDark?: string;
  alt: string;
  width?: number;
  height?: number;
  /** Tall screenshots (phone mock) get centered with a height cap. */
  layout?: "phone" | "wide";
};

export type ChangelogMp4Media = {
  type: "mp4";
  src: string;
  title: string;
  /** Start playback at this offset in seconds. */
  startAt?: number;
  /** Autoplay (muted) when the video scrolls into view. */
  autoplayInView?: boolean;
  /** Loop from `startAt` after the first play. */
  loop?: boolean;
};

export type ChangelogBunnyMedia = {
  type: "bunny";
  title: string;
  videoId: string;
  autoplayInView?: boolean;
  loop?: boolean;
};

export type ChangelogMedia =
  | ChangelogImageMedia
  | ChangelogMp4Media
  | ChangelogBunnyMedia;

export type ChangelogEntry = {
  id: string;
  date: string;
  title: string;
  summary: string;
  paragraphs: string[];
  bullets?: ChangelogBullet[];
  media?: ChangelogMedia;
  docHref?: string;
};

export type ChangelogPageCopy = {
  metadata: {
    title: string;
    description: string;
  };
  docCta: string;
  copyLinkLabel: string;
  copiedLinkLabel: string;
};
