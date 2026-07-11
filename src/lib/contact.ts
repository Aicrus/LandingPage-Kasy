export const CONTACT_EMAIL = "kasy@aicrus.io" as const;

export function contactMailtoHref(subject?: string) {
  if (!subject) {
    return `mailto:${CONTACT_EMAIL}`;
  }

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}`;
}
