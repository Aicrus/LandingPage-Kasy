"use client";

import type { ComponentProps } from "react";
import { useLocale } from "next-intl";

function hashId(href: string | undefined) {
  return href?.match(/#(.+)$/)?.[1] ?? null;
}

export function HashLink({ href, onClick, ...props }: ComponentProps<"a">) {
  const locale = useLocale();
  const id = hashId(href);
  const resolvedHref = id ? `/${locale}/#${id}` : href;

  return (
    <a
      href={resolvedHref}
      onClick={(e) => {
        const target = id ? document.getElementById(id) : null;

        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: "auto", block: "start" });
          window.history.pushState(null, "", `#${id}`);
        }

        onClick?.(e);
      }}
      {...props}
    />
  );
}
